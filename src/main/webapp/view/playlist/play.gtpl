<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="/css/default.css" type="text/css" media="all"/>
        <link rel="stylesheet" href="/css/jquery-ui-1.8.4.custom.css" type="text/css" media="all"/>
        <title>sharedbeats.com</title>
        <meta name="description" content="" />
        <!-- Add to yahoo search results <link rel="image_src" href="http://webmove.org/uploaded_images/2010/04/html-5-audio-player.jpg" /> -->
        <!--<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;">-->
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="icon" href="favicon.ico" />
        <link rel="apple-touch-icon" href="audio-player.png" />

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
                    "videoDiv", "400", "200", "8", null, null, params, atts);
          }

          function updatePlayerInfo() {

          }

          google.setOnLoadCallback(loadPlayer);
          //]]>
        </script>
    </head>
    <body>

        <h1 class="visibility">HTML5 Audio() Player Experiment: HTML5 Audio, Javascript, Canvas  &amp; Processing.js</h1>

        <div id="Player" class="paused">

            <div id="Background"><ul class="Playlist"></ul></div>
            <!--<canvas id="visualizer" width="1" height="1"></canvas>-->
            <!--<div id="tweet" class="radius shadow transition"></div>-->

            <div id="Display"><ul class="Title"></ul></div>

            <div id="PrevTrack" class="PrevTrack transition"><a href="#" title="Previous track">Previous track</a></div>
            <div id="NextTrack" class="NextTrack transition"><a href="#" title="Next track">Next track</a></div>
            <div id="PlayPause" class="PlayPause transition"><a href="#" title="Play / pause">Play / pause</a></div>



            <div id="Playlist" class="radius shadow transition">
                <div id="Menu">
                    <h2>
                        <span class="tab_selected" onclick="Player.tab(0)">Playlist</span>
                        <span class="tab" onclick="Player.tab(1)">Settings</span>
                        <span class="tab" onclick="Player.tab(2)">About</span>

                    </h2>

                    <div id="Search">
                        <form action="" autocomplete="off" onSubmit="Player.search(); return false;">
                            <!--<label for="Searchbox">Search</label>-->
                            <input id="artistSearch" name="search" class="ui-autocomplete-input" type="text" size="14" placeholder="" title="Search for artist, track, album"/>
                            <input id="SearchboxSubmit" type="submit" value="Search" title="Search"/>
                        </form>
                    </div>
                </div>

                <div id="Controls">
                    <div id="Playing" class="radius"></div>

                    <div id="PlayPause2" class="PlayPause"><a href="#" title="Play / pause"></a></div>
                    <div id="PrevTrack2" class="PrevTrack"><a href="#" title="Previous track"></a></div>
                    <div id="NextTrack2" class="NextTrack"><a href="#" title="Next track"></a></div>

                    <div id="Duration" class="radius"></div>
                    <div id="Gauge" class="radius"><div class="play-progress radius"></div></div>

                    <div id="Time" class="radius"></div>
                </div>

                <div>
                  <div id="videoDiv"></div>
                </div>

                <div id="Tabs">
                    <div id="Tracks" class="tab_selected">
                        <ol class="Tracks"></ol>
                    </div>
                    <div id="Settings" class="tab">
                        <form id="Volume" action="">

                            <label for="VolumeControl">Volume</label>
                            <input type="range" name="range" min="0" max="20" step="1" value="18" id="VolumeControl" />

                            <!--
                            <label for="Tags">Tags</label>
                            <select id="Tags" onchange="enable_set()">
                                <option value="" selected>all</option>
                                <option value="acoustic">acoustic</option>

                                <option value="alternative">alternative</option>
                                <option value="ambient">ambient</option>
                                <option value="blues">blues</option>
                                <option value="chillout">chillout</option>
                                <option value="classical">classical</option>
                                <option value="dance">dance</option>

                                <option value="dancehall">dancehall</option>
                                <option value="dark">dark</option>
                                <option value="electro">electro</option>
                                <option value="experimental">experimental</option>
                                <option value="folk">folk</option>
                                <option value="funk">funk</option>

                                <option value="guitar">guitar</option>
                                <option value="hiphop">hiphop</option>
                                <option value="house">house</option>
                                <option value="idm">idm</option>
                                <option value="indie">indie</option>
                                <option value="industrial">industrial</option>

                                <option value="instrumental">Instrumental</option>
                                <option value="jazz">jazz</option>
                                <option value="lounge">lounge</option>
                                <option value="metal">metal</option>
                                <option value="minimal">minimal</option>
                                <option value="noise">noise</option>

                                <option value="piano">piano</option>
                                <option value="pop">pop</option>
                                <option value="punk">punk</option>
                                <option value="rap">rap</option>
                                <option value="reggae">reggae</option>
                                <option value="reggaeton">reggaeton</option>

                                <option value="rock">rock</option>
                                <option value="salsa">salsa</option>
                                <option value="samba">samba</option>
                                <option value="soundtrack">soundtrack</option>
                                <option value="swing">swing</option>
                                <option value="techno">techno</option>

                                <option value="Trance">trance</option>
                                <option value="world">world</option>
                            </select>

                            <label for="Rating">Popularity</label>
                            <select id="Rating" onchange="enable_set()">
                                <option value="random" selected>random</option>

                                <option value="ratingmonth">month</option>
                                <option value="ratingweek">week</option>
                                <option value="rating">all time</option>
                                <option value="date">latest releases</option>
                                <option value="downloaded">most downloaded</option>
                                <option value="listened">most listened to</option>

                                <option value="starred">most starred</option>
                                <option value="playlisted">most playlisted</option>
                                <option value="needreviews">requires reviews</option>
                            </select>

                            <label for="Order">Order</label>
                            <select id="Order" onchange="enable_set()">

                                <option value="desc"  selected>descending</option>
                                <option value="asc">ascending</option>
                            </select>

                            <label for="Items">Tracks</label>
                            <select id="Items" onchange="enable_set()">
                                <option value="50"  selected>50</option>

                                <option value="100">100</option>
                                <option value="200">200</option>
                                <option value="500">500</option>
                                <option value="1000">1000</option>
                            </select>
                             -->
                            <input type="submit" id="set_submit" disabled="disabled" onclick="set(); return false;" value="OK"/>

                            <label for="Opacity">Always On Top</label>
                            <input type="checkbox" id="Opacity" checked value="" />
                            <!--<label for="Visualizer">Visualization (experimental!)</label>
                            <input type="checkbox" id="Visualizer" value="" />-->
                        </form>
                    </div>
                 <!---   <div id="About" class="tab">
                      <p id="Description">
                            A smart
                            <a href="http://webmove.org/2010/04/02/new-version-of-my-html5-audio-web-player-experiment.html" target="new">
                                html5 &lt;audio&gt; experiment
                            </a> - proof-of-concept - that plays free songs
                            from <a href="http://www.jamendo.com" target="new">Jamendo</a>, a community of free, legal and unlimited music
                            published under Creative Commons licenses.
                            <br/><br/>The player receives audio content via Jamendo's API service:
				Random playlists, albums, artist information, tracks and more soon...
                            <br/><br/>Share on:
                            <a href="http://www.facebook.com/sharer.php?u=http://webmove.org/projects/jamendo-html5-audio-player/&amp;t=%23HTML5%20%23Audio%20Player%20Experiment%20Jamendo%20Radio&amp;src=sp" target="new">

                                <img src="http://static.ak.fbcdn.net/images/connect_favicon.png" alt=""/> Facebook
                            </a>
                            <a href="http://twitter.com/home?status=%23HTML5%20%23Audio%20Player%20Experiment%20Jamendo%20Radio%20@webmove%20http%3A%2F%2Fbit.ly%2Fb19pNE" target="new">
                                <img src="http://webmove.org/include/res/twitter_32x32.png" width="14" height="14" alt=""/> Twitter
                            </a>
                            <br/><br/>Current Browser Support: Mozilla Firefox, Google Chrome, Apple Safari.
                        </p>
                    </div>   -->
                </div>

            </div>
        </div>
        <div id="DebugDiv"></div>

        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js" ></script>
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.4/jquery-ui.min.js" ></script>
        <script type="text/javascript" src="/js/processing.min.js"></script>
        <script type="text/javascript" src="/js/player.js"></script>
    </body>
</html>