package controller

import com.google.appengine.api.datastore.Entity

Entity search = new Entity("search")
search.name = params.name
search.createdDate = new Date()
search.save()
queue = queues.default

def suppliers = [
		[ name: "apress" ],
        [ name: "manning" ],
		[ name: "oreilly" ],
]

suppliers.each { supplier ->

  queue.add countdownMillis: 1000, url: "/task/book",
    method: 'PUT', params: [search: search.name, supplier : supplier.name, key : search.key.id ]

}

request.searchId =  search.key.id
request.name = search.name

forward '/view/search/results.gtpl'
