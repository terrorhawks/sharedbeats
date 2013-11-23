package task

import com.google.appengine.api.datastore.Entity
import service.AmazonBookService
import com.google.appengine.api.datastore.Link

log.info("processing... ${params}")

def AmazonBookService amazonBookService = new AmazonBookService()

Entity result = new Entity("result")
def book = amazonBookService.getBook(params.search)
log.info "found ${book}"
if (book.title) {
  result << params
  result.createdDate = new Date()
  result.name = book?.title as String
  result.price = book?.price as String
  result.save()
}

println  """ok"""
