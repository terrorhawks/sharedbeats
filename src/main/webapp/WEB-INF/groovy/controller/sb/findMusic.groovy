package controller.sb


import com.google.appengine.repackaged.org.json.JSONArray
import com.google.appengine.api.datastore.Query
import com.google.appengine.api.datastore.PreparedQuery
import static com.google.appengine.api.datastore.FetchOptions.Builder.withLimit
import com.google.appengine.api.datastore.KeyFactory

def response = new XmlSlurper().parse("http://gdata.youtube.com/feeds/api/videos?q=${params.artist}+${params.track}&max-results=1&v=2")
def music = []
def details = [:]

def key = KeyFactory.createKey("track", params.trackId as Long)
def track = datastore.get(key)
//track[0].tubeId = response.entry[0].content.@src.text()
//response.entry.each { item  ->
response.entry[0].group[0].thumbnail.eachWithIndex { item, i ->
   details.put( "image${i}", item.@url.text())
}
details.putAll( [title : response.entry[0].title.text(), id : response.entry[0].group[0].videoid[0].text()])
music.add ( details)
track.tubeId = response.entry[0].group[0].videoid[0].text()
track.save()
//}
//list.add (  [name : [0]., url : response.entry[0].content.@src.text()] )
println """ ${music as JSONArray} """
