package controller

import com.google.appengine.api.datastore.PreparedQuery
import com.google.appengine.api.datastore.Query
import groovyx.gaelyk.logging.GroovyLogger
import static com.google.appengine.api.datastore.FetchOptions.Builder.withLimit

def log = new GroovyLogger("myLogger")
log.info "Checking results ${params.searchId}"
def query = new Query("result")
query.addSort("price", Query.SortDirection.DESCENDING)
query.addFilter("key", Query.FilterOperator.EQUAL, params.searchId)
PreparedQuery preparedQuery = datastore.prepare(query)
def entities = preparedQuery.asList( withLimit(100) )
def results = []
entities.each {
  results.add it.properties
}
//println jsonResponse as JSONArray
//request.results = results
request.searchResults = results

forward '/view/search/resultMiddle.gtpl'