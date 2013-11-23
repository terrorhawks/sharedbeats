package controller.sb

import com.google.appengine.api.datastore.Entity
import com.google.appengine.api.datastore.Query
import com.google.appengine.api.datastore.PreparedQuery
import static com.google.appengine.api.datastore.FetchOptions.Builder.withLimit

log.info("Tracks found for artist search ${params.search} ")
request.tracks = updateTracks(params)
forward "/view/playlist/track.gtpl"

private List<Entity> updateTracks(params) {
  def currentTracks = getTracks(params.search.toLowerCase())
  if (!currentTracks || !currentTracks[0].lastModified || currentTracks[0].lastModified.plus(30) < new Date() ) {
    //no current tracks or needs updating
    def response = new XmlSlurper().parse("http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${params.search}&api_key=3791e54d9a38e77f7347c7f29e8f1fc8")
    def currentTrackNames = !currentTracks ? [] :currentTracks*.name
    response.toptracks.track.each { item  ->
      def name = item.name.text()
      if (!currentTracks || !currentTrackNames.contains(name)) {
        def newTrack = createTrack(item)
        currentTracks.add(newTrack)
        addTrackToQueue(newTrack)
      } else {
        def updatedTrack = currentTracks.find { it.name==name }
        updateTrack(updatedTrack, item)
        if (!updatedTrack.tubeId) {
          addTrackToQueue(updatedTrack)
        }
      }
    }
  }
  return currentTracks
}


private void addTrackToQueue(track) {
  queue = queues.default
  queue.add countdownMillis: 0, url: "/task/findMusic", method: 'PUT', params: [trackId: track.key.id,
                  artist : track.artist,
                  track : track.name ]
}

private List<Entity> getTracks(artist) {
  def query = new Query("track")
  query.addFilter("artistKey", Query.FilterOperator.EQUAL, artist)
  PreparedQuery preparedQuery = datastore.prepare(query)
  preparedQuery.asList( withLimit(100) )
}

private Entity updateTrack(track, item) {
  //def updateTrack = datastore.get(KeyFactory.createKey("track", track.key.id as Long))
  //updateTrack.artistImageUrl = item.image[2].text() as String
  track.lastModified = (new Date())
  track.save()
  return track
}

private Entity createTrack(item) {

                def track = new Entity("track")
                track.name = item.name.text()
                track.artist = item.artist[0].name.text()
                track.artistKey = item.artist[0].name.text().toLowerCase() 
                track.artistImageUrl = item.image[2].text()
                track.lastModified = new Date() - 31
                track.save()
                return track
      
}