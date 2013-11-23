package task.sb

import com.google.appengine.api.datastore.KeyFactory

log.info("processing... ${params}")

def key = KeyFactory.createKey("track", params.trackId as Long)
def track = datastore.get(key)

if (!track) { log.error("Track id not found ${params.trackId}")}

if (!track?.lastModified || track?.lastModified.plus(30) < new Date()) {
  log.info("tracks require update for ${params.artist} ${params.track}")
  def response = new XmlSlurper().parse("http://gdata.youtube.com/feeds/api/videos?q=${params.artist}+${params.track}&max-results=1&v=2")
    if (response.entry[0].group[0].videoid[0].text()) {
      response.entry[0].group[0].thumbnail.eachWithIndex { item, i ->
         track."image${i}" = item.@url.text()
      }
      track.videoTitle = response.entry[0].title.text()
      track.tubeId = response.entry[0].group[0].videoid[0].text()
      track.lastModified = new Date() - 60
      track.save()
      //response.entry[0].content.@src.text()
  }
}
println  """ok"""
