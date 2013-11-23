package controller.sb

import com.google.appengine.repackaged.org.json.JSONArray

def response = new XmlSlurper().parse("http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${params.term}&api_key=3791e54d9a38e77f7347c7f29e8f1fc8")
def artists = []
response.results.artistmatches.artist.each { item  ->
        artists.add ( item.name as String )
}
println """${artists as JSONArray} """ 
