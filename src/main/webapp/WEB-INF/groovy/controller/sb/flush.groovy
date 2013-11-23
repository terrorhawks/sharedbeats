package controller.sb

import com.google.appengine.api.datastore.PreparedQuery
import com.google.appengine.api.datastore.Query
import static com.google.appengine.api.datastore.FetchOptions.Builder.withLimit

def query = new Query("track")
PreparedQuery preparedQuery = datastore.prepare(query)
def entities = preparedQuery.asList( withLimit(1000) )
entities.each {
  it.delete()
}
