package controller.sb

import com.google.appengine.api.datastore.KeyFactory

if (params.id) {
def key = KeyFactory.createKey("track", params.id as Long)
println """${datastore.get(key)?.tubeId}"""
} else {
  println """"""
}