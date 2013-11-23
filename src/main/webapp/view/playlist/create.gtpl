<% include '/view/include/header.gtpl' %>

<script src="http://www.google.com/jsapi?key=ABQIAAAACQ-KkgYnHwOGiVeGe-PneBRJdo3R2VlHKsUElE91TmGYQNX5pRQ7FHcB_5VGeM3iy7LwvITrav0u2w" type="text/javascript"></script>
<script language="Javascript" type="text/javascript">
  //<![CDATA[

  google.load("swfobject", "2.1");

  function loadPlayer() {
    // Lets Flash from another domain call JavaScript
    var params = { allowScriptAccess: "always" };
    // The element id of the Flash embed
    var atts = { id: "ytPlayer" };
    // All of the magic handled by SWFObject (http://code.google.com/p/swfobject/)
    swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&version=3",
            "videoDiv", "100", "100", "8", null, null, params, atts);
  }

  function updatePlayerInfo() {
  }

  google.setOnLoadCallback(loadPlayer);
  //]]>
</script>
<div id="videoDiv"></div>
<div class="currentPlayList">
  <ul id="currentTracks" ></ul>
</div>
<div id="form">
  <form action="#" autocomplete="off">
    <input type="hidden" id="id" value="${request.playList.key.id}"/>
    <input type="text" name="search" id="artistSearch" class="ui-autocomplete-input input" maxlength="36"/>
    <input type="submit" id="findTracks" value="Add Tracks" class="addTrackBtn"/>
  </form>
  <ul id="tracks" class="entry"></ul>
</div>


<script src="/js/sb.js" type="text/javascript"></script>

<% include '/view/include/footer.gtpl' %>