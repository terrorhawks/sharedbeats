package controller

import com.google.appengine.repackaged.org.json.JSONArray
import service.AmazonBookService

def AmazonBookService amazonBookService = new AmazonBookService()

def results = amazonBookService.findBooks(params.term) as JSONArray
log.info("results = ${results}")
println """${results} """