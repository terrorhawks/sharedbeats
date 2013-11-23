package controller.sb

import com.google.appengine.api.datastore.Entity

def playList = new Entity("playlist")
playList << [ name: params.name ]
log.info "Saving playlist ${playList.name}"
playList.save()

request.playList = playList

forward '/view/playlist/create.gtpl'