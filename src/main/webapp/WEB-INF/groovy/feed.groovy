
import com.sun.syndication.feed.synd.*
import com.sun.syndication.io.SyndFeedOutput

import com.google.appengine.api.images.*
import com.google.appengine.api.datastore.*
import static com.google.appengine.api.datastore.FetchOptions.Builder.*

import com.google.appengine.api.memcache.Expiration

import com.thriftebook.*

log.info "Generating RSS Feed"

def query = new Query(Constants.DEALINFO)
 
// sort results by descending order of the creation date
query.addSort("created", Query.SortDirection.DESCENDING)
 
PreparedQuery preparedQuery = datastore.prepare(query)
 
// return only the first 10 results
def entities = preparedQuery.asList( withLimit(20) )

def feedEntries = [ ]
 
entities.each { dealInfo ->
	
	def desc = new SyndContentImpl(type: "text/plain", value: dealInfo.details)
	def entry = new SyndEntryImpl(title: dealInfo.title + " - " + dealInfo.name, 
	        		link: dealInfo.url,
	        		publishedDate: dealInfo.created, description: desc)
	feedEntries.add(entry)
	
}

SyndFeed feed = new SyndFeedImpl(feedType: "rss_2.0", title: 'Thriftebook',
        		link: 'http://www.thriftebook.com', description: 'Thriftebook.com: daily tech eBook deals',
        		entries: feedEntries);
        
StringWriter writer = new StringWriter()
SyndFeedOutput output = new SyndFeedOutput()
output.output(feed,writer)
writer.close()

println writer.toString()
