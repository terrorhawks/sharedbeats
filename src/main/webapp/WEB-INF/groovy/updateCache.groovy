

import com.google.appengine.api.memcache.Expiration
import com.google.appengine.api.images.*
import com.google.appengine.api.datastore.*
import static com.google.appengine.api.datastore.FetchOptions.Builder.*
import twitter4j.*
import twitter4j.http.*
import com.thriftebook.*

log.info "Invoking cache service to check for new items"

private String shortenUrl(url) {
	try {
		def result = urlFetch.fetch(new URL("http://is.gd/api.php?longurl=" + url))
		def shortened = (result.responseCode == 200 ? new String(result.content) : url) 
		log.info "Shorted URL ${url} to ${shortened}"
		return shortened
	} catch (Exception e) {
		return url // epic fail...
	}
}

private void tweet(def dealInfo) {
	if (!localMode) {	
		try {
			def statusText = "${dealInfo.title} (${dealInfo.name}) -- " + shortenUrl(dealInfo.url) + " -- ${dealInfo.details}"
			if (statusText.size() > 140) {
				statusText = statusText[0..139]
			}
			log.info "Preparing to tweet: [${statusText}]"
			def query =  new Query(Constants.TWITTER_AUTH)
			PreparedQuery preparedQuery = datastore.prepare(query)
			def cred = preparedQuery.asList( withLimit(1) )
			if (cred) {
				log.info "Successfully retrieved twitter creds: ${cred[0].token} ${cred[0].tokenSecret}"
				def config = new Properties()
				config.load(Constants.class.getClassLoader().getResourceAsStream("config.properties"))
		    	Twitter twitter = new TwitterFactory().getInstance()
		    	twitter.setOAuthConsumer(config.consumer_key, config.consumer_secret)
		    	AccessToken accessToken = new AccessToken(cred[0].token, cred[0].tokenSecret)
		    	twitter.setOAuthAccessToken(accessToken)
		    	twitter.verifyCredentials()
		    	Status status = twitter.updateStatus(statusText)
		    	log.info "Successfully updated the status to [${status.text}]"
	    	} else {
	    		log.info "No twitter creds found, skipping tweet..."
	    	}
	    	
    	} catch (Exception e) {
    		log.info "Error tweeting status for ${dealInfo.title}: ${e}"
    	}
	} else {
		log.info "Tweeting turned off in DEV mode"
	}
}

private byte[] resizeImage(byte[] imageBytes, int width, int height) {
    Image oldImage = ImagesServiceFactory.makeImage(imageBytes)
    Transform resize = ImagesServiceFactory.makeResize(width, height)
    Image resizedImage = images.applyTransform(resize, oldImage, ImagesService.OutputEncoding.JPEG)
	byte[] resizedImageBytes = resizedImage.getImageData()
	return resizedImageBytes
}

private Map fetchAndResizeImage(def imageUrl) {
	log.info "Fetching and resizing ${imageUrl}"
	try {
		def imageBytes = urlFetch.fetch(new URL(imageUrl)).content
		log.info "Fetch of ${imageUrl} was " + (imageBytes ? "successful" : "failed" )
		if (imageBytes) {
			byte[] resizedImageBytes = resizeImage(imageBytes, 125, 164)
			byte[] tinyThumb = resizeImage(imageBytes, 62, 82)
			return [ standard: resizedImageBytes, tiny : tinyThumb ]
		}
	} catch (Exception e) {
		log.info "Fetch of ${imageUrl} failed: ${e}" 	
	}
	return [ standard: new byte[0], tiny: new byte[0] ] // keep it all null-safe
}

private void save(dealInfo) {
	
	def newEntity = new Entity(Constants.DEALINFO)
	def safeHash = [ name: dealInfo.name, url: dealInfo.url?.toString(), 
					created: dealInfo.created, title: dealInfo.title?.toString(),
					details: dealInfo.details?.toString(),
					imageBytes: new Blob(dealInfo.imageBytes), tinyThumb: new Blob(dealInfo.tinyThumb) ]
	newEntity << safeHash
	log.info "Saving a new entity for ${newEntity.name}"
	newEntity.save()
	
}


private boolean saveIfRequired(dealInfo) {
	
	def query = new Query(Constants.DEALINFO)
 
	// sort results by descending order of the creation date
	query.addSort("created", Query.SortDirection.DESCENDING)
 
	// filters the entities so as to return only scripts by a certain author
	query.addFilter("url", Query.FilterOperator.EQUAL, dealInfo.url?.toString())
 
	PreparedQuery preparedQuery = datastore.prepare(query)
 
	// return only the first 10 results
	def entities = preparedQuery.asList( withLimit(20) )
	
	if (entities) {
		if (entities.get(0)?.created) {
			def diff = new Date() - entities.get(0)?.created
			if (diff > 5) { // haven't seen this deal for a few days, must be new
				//def newEntity = dealInfo as Entity
				save(dealInfo)
				return true
			} else {
				log.info "Skipping existing deal: ${dealInfo.name} at ${dealInfo.url}"
			}
		}
	} else {
		// Nothing in the cache, let's save it!
		//def newEntity = dealInfo as Entity
		save(dealInfo)
		return true
	}
	return false
}


def apress = new Expando() 
apress.fetch = {
	def htmlBytes = urlFetch.fetch(new URL("http://apress.com/info/dailydeal")).content
	def html = new String(htmlBytes)
	def pattern = ~/(?m)(?s)<div class='bookdetails'>.*?<a href='(.*?)'>(.*?)<\/a.*<div class='cover'>.*?<img.*?src="(.*?)"/

	def matcher = pattern.matcher(html)
	if (matcher.find()) {
		def imageUrl = "http://apress.com${matcher.group(3)}"
		def thumbs = fetchAndResizeImage(imageUrl)
		def imageBytes = thumbs?.standard
		def tinyThumb = thumbs?.tiny
		
		return [ url: "http://apress.com${matcher.group(1)}",
				title: matcher.group(2),
				details: "Purchase "  + matcher.group(2).toString() + " for \$10 <a href='http://apress.com/info/dailydeal'>here</a>", // it's all we've got!
				imageUrl: imageUrl,
				imageBytes: imageBytes,
				tinyThumb: tinyThumb,
				created: new Date() ]
   		
	} else {
    	log.info "No Match on APress site!"
    	return [ : ]
	}
} 

def manning = new Expando()
manning.fetch = {
	def htmlBytes = urlFetch.fetch(new URL("http://incsrc.manningpublications.com/dotd.js")).content
	def html = new String(htmlBytes)
	def pattern = ~/(?m)(?s).*?<a href='(.*?)'>(.*?)<\/a>.*?<br>(.*?)"/

	def matcher = pattern.matcher(html)
	if (matcher.find()) {
		
		def url = matcher.group(1)
		def authorId = url.split(/\//)[-1]
		def imageUrl = "${url}/${authorId}_cover150.jpg"
		def thumbs = fetchAndResizeImage(imageUrl)
		def imageBytes = thumbs?.standard
		def tinyThumb = thumbs?.tiny
		
		return [ url: url,
				title: matcher.group(2),
				details: matcher.group(3).replaceAll("<[^>]+>", " "),
				imageUrl: imageUrl,
				imageBytes: imageBytes,
				tinyThumb: tinyThumb,
				created: new Date() ]
	       
	   
	} else {
	   log.info "No Match on Manning site!"
       return [ :  ]
	}
}

def oreilly = new Expando()
oreilly.fetch = {
	def htmlBytes = urlFetch.fetch(new URL("http://feeds.feedburner.com/oreilly/ebookdealoftheday")).content
	def html = new String(htmlBytes)
	def bookDeals = new XmlSlurper().parseText(html)
	def firstEntry = bookDeals.entry[0]
	def deal = firstEntry.title as String
	def pattern = ~/Deal of the Day:(.*?)- Only/
	log.info "Deal is: [${deal}]"
	def matcher = pattern.matcher(deal)
	def title = ""
	if (matcher.find()) {
	    title = matcher.group(1).trim()
	}
	log.info "Title is: [${title}]"
	def href = firstEntry.link.@href.text() as String
	def catNum = href.split(/\//)[-1]
	def imageUrl = "http://covers.oreilly.com/images/${catNum}/cat.gif"
	def thumbs = fetchAndResizeImage(imageUrl)
	def imageBytes = thumbs?.standard
	def tinyThumb = thumbs?.tiny

	return [ url: href, title: title, details: deal, imageUrl: imageUrl, 
	         imageBytes: imageBytes, tinyThumb: tinyThumb, created: new Date() ]
}

def urls = [
		[ name: Constants.APRESS, handler: apress ],
		[ name: Constants.MANNING, handler: manning ],
		[ name: Constants.OREILLY, handler: oreilly ],
]

urls.each { feed ->
	
	log.info "Downloading feed ${feed.name}"
	try {
		def result = feed.handler.fetch()
		if (result.url) {
		    def existingEntry = memcache[feed.name]
		    if (!existingEntry || existingEntry.url != result.url) {
			    log.info "Putting the url ${result.url} in the cache keyed by ${feed.name}"
			    result.name = feed.name

			    def newDeal = saveIfRequired(result)
			    if (newDeal) {
			    	tweet(result)
			    }
			    memcache.put feed.name, result, Expiration.byDeltaSeconds(60 * 60 * 72) // keep for 72 hours just in case
		    }
		} else {
			// we have errors, just skip it..
		}
	} catch (Exception e) {
		log.info "Error retrieving feed ${feed.name}: ${e}"
	}
	
}

forward '/updateCache.gtpl'