package controller.sb

import com.google.appengine.api.datastore.PreparedQuery
import com.google.appengine.api.datastore.Query

def query = new Query("playlist")
query.addFilter("id", Query.FilterOperator.EQUAL, params.id)
PreparedQuery preparedQuery = datastore.prepare(query)
def playlist = preparedQuery.asList( withLimit(1) )