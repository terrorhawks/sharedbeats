<% request.tracks.eachWithIndex { track, index -> %>
<li id='track_${track.key.id}' data-id='${track.key.id}' data-vid='${track.tubeId ?: "#"}' <% if (index==0) { %>class='current_track'<% } %> onclick='Player.play("${track.tubeId ?: "#"}", "${track.key.id}")'>${track.name}&nbsp;<a href='#add' class='addPlaylist' data-id='${track.key.id}'>+</a></li>
<% } %>