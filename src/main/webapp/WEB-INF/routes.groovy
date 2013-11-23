// example routes
/*
get "/blog/@year/@month/@day/@title", forward: "/WEB-INF/groovy/blog.groovy?year=@year&month=@month&day=@day&title=@title"
get "/something", redirect: "/blog/2008/10/20/something", cache: 2.hours
get "/book/isbn/@isbn", forward: "/WEB-INF/groovy/book.groovy?isbn=@isbn", validate: { isbn ==~ /\d{9}(\d|X)/ }
*/


get "/", forward : "/controller/home.groovy"
get "/search", forward : "/controller/search.groovy"
get "/results", forward : "/controller/result.groovy"
get "/bookNames", forward : "/controller/bookNames.groovy"
put "/task/book", forward : "/task/book.groovy"

//
get "/sharedbeats", forward: "/controller/sb/index.groovy"
get "/createPlaylist" , forward: "/controller/sb/createPlaylist.groovy"
get "/searchArtist", forward: "/controller/sb/searchArtist.groovy"
get "/findTracks", forward: "/controller/sb/findTracks.groovy"
put "/task/findMusic", forward: "/task/sb/findMusic.groovy"
get "/addPlaylist", forward : "/controller/sb/addPlaylist.groovy"
get "/play", forward : "/controller/sb/playlist.groovy"
get "/flush", forward : "/controller/sb/flush.groovy"
get "/getVID", forward : "/controller/sb/getVideo.groovy"
get "/player", forward : "/controller/sb/player.groovy"

// routes for the common thriftebook actions
get "/latest", forward: "/latest.groovy"
get "/updateCache", forward: "/updateCache.groovy"
get "/feed", forward: "/feed.groovy"
get "/oauth", forward: "/oauth.groovy"