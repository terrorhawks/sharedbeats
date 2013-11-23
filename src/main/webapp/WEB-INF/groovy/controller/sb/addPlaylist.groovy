package controller.sb

import com.google.appengine.api.datastore.PreparedQuery
import com.google.appengine.api.datastore.Query
import static com.google.appengine.api.datastore.FetchOptions.Builder.withLimit
import com.google.appengine.api.datastore.KeyFactory

log.info("adding track ${params.trackId} to playlist ${params.id} ")
def key = KeyFactory.createKey("playlist", params.id as Long)
def playlist = datastore.get(key)
playlist.trackId = params.trackId
playlist.save()

