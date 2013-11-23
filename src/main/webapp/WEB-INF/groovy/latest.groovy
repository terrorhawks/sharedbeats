
import com.google.appengine.api.memcache.Expiration
import com.thriftebook.*


String getNiceDate(Date date) {
	
	if (!date)
		return null;

	def now = new Date()
	
	def diff = Math.abs(now.getTime() - date.getTime())
	
	long second = 1000
	long minute = 1000 * 60
	long hour = minute * 60
	long day = hour * 24
	
	def niceTime = ""
	
	long calc = 0L;
	
	calc = Math.floor(diff / day)
	if (calc > 0) {
	    niceTime += calc + " day" + (calc > 1 ? "s " : " ")
	    diff = diff % day
	}
	
	calc = Math.floor(diff / hour)
	if (calc > 0) {
	    niceTime += calc + " hour" + (calc > 1 ? "s " : " ")
	    diff = diff % hour
	}
	
	calc = Math.floor(diff / minute)
	if (calc > 0) {
	    niceTime += calc + " minute" + (calc > 1 ? "s " : " ")
	    diff = diff % minute
	}
	
	if (niceTime.length() == 0) {
	    niceTime = "Right now"
	} else {
	    niceTime += (date.getTime() > now.getTime()) ? "from now" : "ago"
	}
	
	return niceTime

}

log.info "Invoking display page"

def feeds = [ Constants.MANNING, Constants.OREILLY, Constants.APRESS ]

def feedDetails = [ : ]

feeds.each { feed ->
	
	log.info "Looking for feed: ${feed}"
	def value = memcache.get(feed)
	if (value?.url) {
		log.info "URL for feed ${feed} is ${value.url} with date of ${value.created}"
		value.lastUpdate = getNiceDate(value?.created)
		feedDetails[feed] = value
	} else {
		log.info "Nothing in there for ${feed}..."
	}
	
} 

request.setAttribute 'feedDetails', feedDetails

forward '/latest.gtpl'