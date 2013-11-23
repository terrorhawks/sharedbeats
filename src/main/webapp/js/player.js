/*
    HTML5 (Jamendo Radio) AUDIO() PLAYER (Fullscreen)
    proof-of-concept design
    API           : Jamendo.com, Twitter.com
    Built with    : HTML5 Audio,
                    Canvas + ProcessingJS,
                    Javascript / jQueryUI,
                    CSS3
 
    License       : MIT
    Web Site      : http://webmove.org/projects/jamendo-html5-audio-player/
    Github Repo.  : http://github.com/webmove/Jamendo-HTML5-Audio-Player (soon)

    Browser:      : Mozilla Firefox, Google Chrome, Appel Safari
 -----------------------------------------------------------------------------------------------------------------------

    HTML5 info:
                    http://matt.might.net/articles/how-to-native-iphone-ipad-apps-in-javascript/
                    http://html5boilerplate.com/
                    http://html5doctor.com/native-audio-in-the-browser/
                    http://www.w3.org/TR/html5/video.html#media-element
                    http://en.wikipedia.org/wiki/Comparison_of_layout_engines_(HTML5_Media)#cite_note-webkit-codecs-23
                    http://en.wikipedia.org/wiki/Use_of_Ogg_formats_in_HTML5


    @todo jquery.cookie handler to save fav artists
    @todo oop: audio + api + processing
    @todo jQuery mobile touch


    changelog:
    - add chromium support (html5->ogg2) 2010-09-29
    - add firefox support 2010-09-02
    - add artist page 2010-07-09
    - modify css selectors
 
*/




    Player = function() {

        //var _internalVars = "";

        //var tracks = [];
        var last_query = '';
        //var search_index = -1;
        //var currently_playing_track_id = -1;

        function go_to_track(new_track_id) {
               console.log("next track")
       /*     // if there currently is a next track, return
            if ( $('ul.Playlist li.next_track').length > 0 ) {
                return false;
            }

            // keep track numbers within bounds
            new_track_id = new_track_id % ( $('ul.Playlist li').length );
             console.log("go_to_track " + new_track_id);
            // return if we are currently playing that track
            var current_track_id = $('ul.Playlist .current_track').prevAll('li').length;

            if ( current_track_id == new_track_id ) {
                return false;
            }

            pauseTrack();
            $('#Playing').html('');*/

            // set next_track position
            // misbehaviour/bug in ff:
            // if current track position is set to 0, and the eventlisterner ended
            // and next track becomes current track to play,
            // then both track will play.
            //seek_current_track(0);

            // addClass next_track for #Tracks .Tracks
          /*  var cur_track_list = $('ol.Tracks li.current_track');
            var next_track_list = cur_track_list.parents('ol.Tracks').children('li').eq( new_track_id );
            next_track_list.addClass('next_track');

            // addClass next_track for #Display .Title
            var cur_track_title = $('ul.Title li.current_track');
            var next_track_title = cur_track_title.parents('ul').children('li').eq( new_track_id );
            next_track_title.addClass('next_track');

            // addClass next_track for .Playlist
            var cur_track = $('ul.Playlist li.current_track');
            var next_track = cur_track.parents('ul').children('li').eq( new_track_id );
            next_track.addClass('next_track');
            next_track.hide();

            // find h2 and fade out h2 and current_track,
            // check if Visualizer is checked,
            // exchange li->next_track to current track, remove next_track class
            cur_track_title.find('h2').fadeOut(200, function() {
                cur_track.fadeOut(200, function() {

                    if($('input#Visualizer[type="checkbox"]').is(':checked'))
                        $('#visualizer').fadeOut(100);

                    $('li.current_track').removeClass('current_track');

                    // the next song item
                    var next_song = $('li.next_track');
                    // current song ressource remove class
                    next_song.addClass('current_track');

                    next_track_title.find('h2').fadeIn(400);
                    //next_track.fadeIn(200);

                    next_track.animate({
                        height: 'toggle'
                    }, 400);

                    next_song.removeClass('next_track');

                    if ($('#Player').is('.playing'))
                        playTrack();
                });
            });*/
    }

    function play(id, dataId) {

        var playme = function(id, dataId) {
            if (id!==undefined) {
                var ytplayer = document.getElementById("ytPlayer");
                ytplayer.loadVideoById(id, 0, "small");
                $('ol.Tracks li.current_track').attr('class', '');
                var chosenTrack = $('ol.Tracks li[data-id=' + dataId + ' ]');
                chosenTrack.attr('class', 'current_track');
                $('#Playing').html('<img src="/img/eq.gif" alt="eq" height="16" width="14"/> <span>' + chosenTrack.text() +'</span>');
            }
        }

        if (id===undefined) {
            var track = $('ol.Tracks li.current_track');
            id = track.attr('data-vid');
            dataId = track.attr('data-id');
        }

        if (id==='#') {
            $.get('/getVID?id=' + dataId, function(data) {
                playme(data, dataId);
            })
        } else {
            playme(id, dataId);
        }



    /*    currently_playing_track_id = $('ul.Playlist li.current_track').prevAll('li').length;

        //Find track url to use for <audio src"...">
        var href = $('ul.Playlist li.current_track').find('a.song_audio').attr('href');
        //tracks[currently_playing_track_id].load();

        // workaround for webkit.
        // when assigning src attribute, webkit begins to load track
        // and set current position to 0.
        // so we try to assign src only if current time is 0.
        // this is important for pause / play events.
        if (tracks[currently_playing_track_id].currentTime == 0){
            tracks[currently_playing_track_id].setAttribute('src', href);
            $('#Playing').html('');
            $('#Time').html('');
            $('#Duration').html('');
        }

        tracks[currently_playing_track_id].play();

        // add eventlisterner 'timeupate'
        tracks[currently_playing_track_id].addEventListener('timeupdate', function(){

            // progressbar
            var width = parseInt($('li#title_'+ currently_playing_track_id +' h2').css('width'));
            var width2 = parseInt($('#Gauge').css('width'));

            var percentPlayed = Math.round(tracks[currently_playing_track_id].currentTime / tracks[currently_playing_track_id].duration * 100);

            var barWidth = Math.ceil(percentPlayed * (width / 100));
            var barWidth2 = Math.ceil(percentPlayed * (width2 / 100));

            $('#load'+ currently_playing_track_id +' .play-progress').css('width', barWidth);
            $('#Gauge .play-progress').css('width', barWidth2);

            // current time
            var current_time =  get_time(tracks[currently_playing_track_id].currentTime);

            // time on window.title, div#Time update event
            document.title = current_time +' ' + $('ol.Tracks li.current_track').text();
            $('#Time').html('<time>' + current_time + '</time>');

            // just experimental on timeupdate
            if ($('#Player').is('.playing'))
                $('#Playing').html('<img src="inc/css/img/eq.gif" alt="eq" height="16" width="14"/> <span>'
                    + $('ol.Tracks li.current_track').text() +'</span>');

            // better in seperated eventlisterner eg. loadeddata to check only 1x
            $('#Duration').html('<time>'+ get_time(tracks[currently_playing_track_id].duration) +'</time>');

            // easy slider
            // open -40
            $('#Gauge').click(function(e){
                // get x value of div#Gauge
                var x = e.pageX - this.offsetLeft - 40;
                var x_percent = (x * 100) / this.offsetLeft;

                //var seeker = tracks[currently_playing_track_id].duration / 100 * x_percent;
                var seeker = Math.round((tracks[currently_playing_track_id].duration / 100) * x_percent);
                //console.log('duration: '+Math.round(tracks[currently_playing_track_id].duration)+'; seeker pos: '+seeker);
                seek_current_track(seeker);
            });
        }, true);

        // add eventlisterner 'empty' or 'dataunavailable' to skip empty track data
        setTimeout(function() {
            tracks[currently_playing_track_id].addEventListener('empty', stream_detection(), true);
        }, stream_timeout);

        if($('input#Visualizer[type="checkbox"]').is(':checked')) {
            setTimeout(function(){
                $('#visualizer').fadeIn(400);
            }, 1000);
        }*/
    }

    function playTrack(id, dataId) {
        console.log("playTrack");
        $('#Player').removeClass('paused');
        $('#Player').addClass('playing');
        play(id, dataId);
    }

    function pauseTrack() {
        console.log("pauseTrack");
        pause();
        $('#Player').removeClass('playing');
        $('#Player').addClass('paused');
        $('#Playing').html('<img src="/i/eq_off.gif" alt="eq" height="16" width="14"/> <span>' + $('ol.Tracks li.current_track').text() +'</span>');
    }

    function pause() {
        var ytplayer = document.getElementById("ytPlayer");
        ytplayer.pauseVideo();
    }

    function clearTracks() {
       //if (search_index === 1)
       //     $('#Playlist .Tracks').html();

        $('#Playlist').removeClass('opac');
        $('#Playlist .Tracks').html('<li style="list-style: none;">loading...</li>');
    }



    return {

       togglePlayPause : function() {
           console.log("toggle play/pause");
             if ($('div#Player').is('.paused')) {
                playTrack();
             } else {
                pauseTrack();
             }
        },

        // menu tabs
        tab : function(n) {
            //hide
            $('#Playlist .tab_selected').addClass('tab');
            $('#Playlist .tab_selected').removeClass('tab_selected');

            //show
            $($('#Menu .tab')[n]).addClass('tab_selected');
            $($('#Tabs .tab')[n]).addClass('tab_selected');

            $($('#Menu .tab')[n]).removeClass('tab');
            $($('#Tabs .tab')[n]).removeClass('tab');
        },

        search : function() {
            var searchTerm = $('input#artistSearch').val();
            var url = "/findTracks?" + $("#artistSearch").serialize();
            if ((searchTerm != '') && (searchTerm != last_query)){
                last_query = searchTerm;
                clearTracks();
                $('#Playlist .Tracks').load(url).fadeIn();
            } else
                return false;
        },

        play : function(id, dataId) {
            playTrack(id, dataId)
        },

        pause : function() {
            pauseTrack()
        },

        nextTrack : function(trackInc) {
            var current_track_id = $('ol.Tracks li.current_track').prevAll('li').length + 1;
            var nextTrack = $('ol.Tracks li:nth-child(' + (current_track_id + trackInc) + ')');
            playTrack(nextTrack.attr('data-vid'), nextTrack.attr('data-id'));
        },

        setUp : function() {
           var ytplayer = document.getElementById("ytPlayer");
            ytplayer.addEventListener('onStateChange', Player.onPlayerStateChange);
            ytplayer.addEventListener('onError', Player.onPlayerError);
            ytplayer.addEventListener('onPlayerQualityChange', Player.onPlayerQualityChange);
            ytplayer.addEventListener('onReady', Player.onPlayerReady);

        },

        onPlayerStateChange : function(event) {
            console.log("onPlayerStateChange: " + Object(event).Data);
            if (event===0) {
                Player.nextTrack();
            }
        },
        onPlayerError : function(event) {
            console.log("onPlayerError: " + Object(event).Data);
        },
        onPlayerQualityChange : function(event) {
            console.log("onPlayerQualityChange: " + Object(event).Data);
        },
        onPlayerReady : function(event) {
            console.log("onPlayerReady: " + Object(event).Data);
        }

    };

}();


//events
$(function () {



    $('.PlayPause').click(function() {
        Player.setUp();
        Player.togglePlayPause();
    });

    $("#artistSearch").autocomplete({
        source: '/searchArtist',
        minLength : 3
    });

    $("#Playlist").draggable({
         handle: '#Menu'
    });

    $("#Playlist").resizable({
       alsoResize: '#Tracks'
    });

    $('.NextTrack a').click( function() {
        return Player.nextTrack( 1 );
    });

    $('.PrevTrack a').click( function() {
        return Player.nextTrack( -1 );
    });


});




// api vars
//var api = 'http://api.jamendo.com/get2/';
//var stream_failed = 0;
//var stream_count = 0;
//var search_index = -1;
//var stream_timeout = 12000;
//var query, api_url, artist_id;

//var app_url ='http://webmove.org/projects/jamendo-html5-audio-player/';

// opera browser detection...
//if ($.browser.opera) {
//    var json = 'jsonpretty'; // open: opera -> same origin policy
//    var datatype = 'jsonp';
//}
//else {
//    json = 'json';
//    datatype = 'json';
//}

// webkit = mp3, ff,opera = ogg2, chromium linux = ogg2
//if (($.browser.webkit) && (navigator.platform.indexOf("Chromium") != -1))
//    var stream = '&streamencoding=mp31'
//else
//    stream = '&streamencoding=ogg2';

// player vars
//var loading_msg = 'pondering track';
//var error_msg = 'error..., skip to next track';
//var play_msg = 'playing';

//var track_dump = '';
//var tracks = [];
//var track_loaded = [];
//var currently_playing_track_id = -1;
//var volume_multiplier = 1;

$(document).ready(function() {
    try {
        //console.debug('ini_start');
        // get artist string or start default setting
     //   query = location.search.substring(1);

  //      if (query.indexOf('artist_id') !=-1)
    //        get_artist_track(getquery('artist_id')); // get artist id
      //  else
            set(); // start default setting

        // bind player click events
   /*     $('.PlayPause').click( function() {

        });*/




        $('input#VolumeControl').change( function() {
            set_volume( parseInt($('input#VolumeControl').val()) / 20 );
        });

      /*  $('div#tweet').click(function(){
            $(this).fadeOut(200);
        });*/

        // window opacity binding click
        $('input#Opacity[type="checkbox"]').bind('click',function() {
            if($('input#Opacity[type="checkbox"]').is(':checked'))
                $('#Playlist').removeClass('opac');
            else
                $('#Playlist').addClass('opac');
        });

        // keypress vs keydown // ff vs webkit
    /*    $(document).keydown(function(e){
            // except input element on nodeName
            var element = e.target.nodeName.toLowerCase();
            if (element != 'input' && element != 'textarea') {
                // left key
                if (e.which == 37) {
                    return advance_track( -1 );
                }
                // right key
                if (e.which == 39) {
                    return advance_track( 1 );
                }
                // space pause/play
                if (e.which == 32) {
                    if ( $('div#Player').is('.paused') ) {
                        resume_playback();

                        if($('input#Visualizer[type="checkbox"]').is(':checked'))
                            setTimeout(function(){
                                $('#visualizer').fadeIn(400);
                            }, 700);
                    } else {
                        pause_playback();
                        if($('input#Visualizer[type="checkbox"]').is(':checked'))
                            $('#visualizer').fadeOut(100);
                    }
                }
            }
            // volume up
            if (e.which == 38) {
                var volnum = parseInt($('input#VolumeControl').val()) + 1;
                if (volnum <21){
                    set_volume(volnum / 20);
                    $('input#VolumeControl').val(volnum);
                }
            }
            // volume down
            if (e.which == 40) {
                volnum = parseInt($('input#VolumeControl').val()) - 1;
                if (volnum > -1){
                    set_volume(volnum / 20);
                    $('input#VolumeControl').val(volnum);
                }
            }
        });  */



        //$('#visualizer').draggable();
        //$('#visualizer').resizable();
        //$('#tweet').draggable();

    //console.debug('ini_end');
    }
    catch(e) {
        //console.error(e);
        alert(e);
    }
});

// get artist id etc.
function getquery(variable) {
    console.log("get query");

    /*if (query != '') {
        var vars = query.split("&");

        for (var i=0; i<vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
    }*/
}



// settings
function set() {
/*    var _num, _order, _rating, _tags, _base;
    _tags   = $('select#Tags').val();
    _num    = $('select#Items').val();
    _order  = $('select#Order').val();
    _rating = $('select#Rating').val();

    // disable settings button
    $('#set_submit').attr("disabled", true);

    _base = api
    + 'id+name+url+stream+duration+album_name+album_url+album_id+artist_id+artist_name/'
    + 'track/'+json+'/track_album+album_artist/'
    + '?n='+ _num +'&order='+ _rating +'_'+ _order;

    if ((_tags == undefined) || (_tags == ''))
        api_url = _base
    else
        api_url = _base +'&tag_idstr='+ _tags;*/

    //tab(0);
    //return call();
}

// enable settings button onchange event from select
function enable_set() {
    // enable button
    console.log("enable set");
    $('#set_submit').removeAttr("disabled");
}

// get artist playlist
/*function get_artist_track(artist) {
    if (artist_id == artist) return false;

    api_url = api
    + 'id+name+url+stream+duration+album_name+album_url+album_id+artist_id+artist_track+artist_name/'
    + 'track/'+json+'/track_album+album_artist/'
    + '?artist_id='+ artist;

    //$('select#Tags').val('artist');
    artist_id = artist;
    tab(0);
    return call();
}*/

// searchbox


// api request
/*function call() {
    var _current, _style;

    // save the current track list to switch back
    if (search_index === 1)
        track_dump = $('#Playlist .Tracks').html();

    $('#Playlist').removeClass('opac');
    $('#Playlist .Tracks').html('<li style="list-style: none;">thinking...</li>');
    api_url = api_url + stream;

    $.ajax({
        url: api_url,
        //dataType: datatype,
        context: document.body,
        cache: true,
        success: function(data){

            if ((data == '[]') || (data == 'undefined') || (data == '')) {
                $('#Playlist .Tracks').html(
                    '<li style="color: red;list-style: none;">Sorry, no results found.</li>'
                    +'<li id="error_data" style="list-style: none;"><< Return to previous playlist</li>'
                    );

                $('li#error_data').click( function() {
                    if (track_dump != ''){
                        $('#Playlist .Tracks').html(track_dump);
                        search_index = 1;
                        // after click, same search query is possible.
                        last_query = '';
                    }
                    else
                        window.location = app_url;
                });
                search_index = -1;
                return false;
            }
            else {
                // fader
                //fade_track();

                // init
                search_index = 1;
                var _listing = '';
                var _tracks = '';
                var _display = '';

                // make json object
                data = eval(data);
                //data = JSON.parse(data);

                for(var i = 0; i < data.length ; ++i){
                    if (i == 0) {
                        _current = 'class=\"current_track\"'
                        _style = '';
                    } else {
                        _current = '';
                        _style = 'style=\"display: none;\"';
                    }

                    _listing 	+=

                    '<li id="song_'+ i +'" '+ _current +'>'
                    +'<img src="'+ api +'image/album/redirect/?id='
                    + data[i].album_id +'&imagesize=600"/>'
                    +'<a class="song_audio" href="'+data[i].stream+'"></a></li>';

                    _tracks 	+=

                    '<li id="track_'+ (i) +'" '+ _current +' onclick="go_to_track('+ i +');" >'
                    + data[i].name.replace(/\n/g, '') +' - '
                    + data[i].artist_name.replace(/\n/g, '') +'</li>';

                    _display	+=

                    '<li id="title_'+ (i) +'" '+ _current +'><h2 '+ _style +' class="leftradius shadow transition">'
                    +'<a href="'+ data[i].album_url +'" target="new" title="Download '+ data[i].album_name.replace(/\n/g, '')
                    +' Album on Jamendo"><img class="album_image" src="'+ api +'image/album/redirect/?id='
                    + data[i].album_id +'&imagesize=100" /></a>'
                    +'<em title="Play All Tracks From '+ data[i].artist_name.replace(/\n/g, '')
                    +'" onclick="get_artist_track('+ data[i].artist_id +');">'
                    + data[i].artist_name.replace(/\n/g, '') +'</em><br/>'
                    + data[i].name.replace(/\n/g, '') +' <br/>'

                    // cookie link, permalink
                    +'<a href="#" onclick="setCookie(\''+ data[i].artist_name.replace(/\n/g, '') +'\','
                    + data[i].artist_id +', 365); return false" title="love this track"></a> '
                    +'<a href="?artist_id='+ data[i].artist_id +'&amp;artist_name='+ data[i].artist_name.replace(/\n/g, '')
                    +'" title="Permalink of '+ data[i].artist_name.replace(/\n/g, '') +'">Permalink</a> '

                    // download link
                    +'<a href="'+ data[i].album_url +'" target="new" title="Download '+ data[i].album_name.replace(/\n/g, '')
                    +' Album on Jamendo">Download Album</a> '

                    // addthis link
                    +'<a target="new" class="aptureEnhance" href="http://www.addthis.com/bookmark.php?v=250&amp;username=webmove'
                    +'&amp;url='+ app_url +'?artist_id='+ data[i].artist_id +'&amp;title=Playing '
                    + data[i].artist_name.replace(/\n/g, '') +' - Music - HTML5 Audio Player @webmove" title="Share Artist Tracks: Permalink">'
                    +'<img src="http://s7.addthis.com/static/btn/sm-plus.gif" '
                    +'width="12" height="12" border="0" alt="Share"/></a>'

                    +'<div id="load'+ (i) +'" class="load-progress"> '
                    +	'<div class="play-progress"></div>'
                    +'</div>'
                    +'</h2></li> ';
                }

                // switch to complete: function() will orveride $('#Playlist .Tracks').html(_tracks);
                $('#Background .Playlist').html(_listing);
                $('#Playlist .Tracks').html(_tracks);
                $('#Display .Title').html(_display);

                // starting engine: load_tracks()
                setTimeout(load_tracks, 500);

                // pause_current_track();
                if ($('#Player').is('.playing'))
                    pause_playback();


            }*/
            // due to line 339 if data == []
            // switch to complete: function() will orveride $('#Playlist .Tracks').html(_tracks);
            /*
            $('#Background .Playlist').html(_listing);
            $('#Playlist .Tracks').html(_tracks);
            $('#Display .Title').html(_display);

            // starting engine: load_tracks()
            setTimeout(load_tracks, 500);

            // pause_current_track();
            if ($('#Player').is('.playing')) {
                pause_playback();
            }
                */
       //},
        /*
        complete: function(){


            $('#Background .Playlist').html(_listing);
            $('#Playlist .Tracks').html(_tracks);
            $('#Display .Title').html(_display);

            // starting engine: load_tracks()
            setTimeout(load_tracks, 500);

            // pause_current_track();
            if ($('#Player').is('.playing')) {
                pause_playback();
            }

        },
        */
   /*     error: function(XHR, textStatus, errorThrown) {
            $('#Playlist .Tracks').html('<li style="list-style: none;">Error '+XHR+': '+ errorThrown +': '+ textStatus +'</li>');
        }
    });
} */





function load_tracks() {
    // fader
    //fade_track();

    console.log("load_tracks");

   /* $('ul.Playlist li').each( function(i) {

        //var audioTagSupport = !!(document.createElement('audio').canPlayType);
        // create html5 audio element and setAttribute
        tracks[i] = document.createElement('audio');

        $(this).append('<div class="loading_indicator"><span class="radius shadow transition">'+ loading_msg +'</span></div>');

        tracks[i].addEventListener("ended", function() {
            advance_track(1);
        }, true);

        track_loaded[i] = false;

        // 2010-09-24 change to 'canplay'
        tracks[i].addEventListener('canplay', function(){
            //console.log('canplaythrough: ' + tracks[i]);
            set_volume(parseInt($('input#VolumeControl').val()) / 20 );

            var loading = $('ul.Playlist li').eq(i).find('div.loading_indicator');
            loading.html('<span class="radius shadow transition">'+ play_msg +'</span>');
            loading.fadeOut('200', function() {
                $(this).remove();

                if($('input#Visualizer[type="checkbox"]').is(':checked')) {
                    setTimeout(function(){
                        visualization();
                    }, 500);
                }
            });

            track_loaded[i] = true;
        }, true);
    });

    // check status
    if ($('#Player').is('.paused'))
        resume_playback();

    // check window setting
    if($('input#Opacity[type="checkbox"]').is(':checked'))
        $('#Playlist').removeClass('opac');
    else
        $('#Playlist').addClass('opac');

    // check visualization
    return visualization();

    // addthis share button api
    addthis.button('.share-btn');*/
}





function mute_current_track() {
    console.log("mute") ;
   /* if ( currently_playing_track_id != -1 ) {
        tracks[ currently_playing_track_id ].volume = 0;
    }*/
}

function set_volume( volume_level ) {
    console.log("volume") ;
    /*if ( currently_playing_track_id != -1 ) {
        tracks[ currently_playing_track_id ].volume = volume_level * volume_multiplier;
    }*/
}

// seconds to time format
/*function get_time(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
}*/

/*function stream_detection(){
    // open
    // we count the number of playable tracks
    // and compare with var stream_failed to display stream error msg
    // and to skip to next track
    stream_count = stream_count + 1;

    var stream_message = $('ul.Playlist li').eq(currently_playing_track_id).find('div.loading_indicator');
    if (stream_count >= stream_failed * 3) {
        stream_failed = 0;
        stream_count = 0;
    }

    if (stream_failed == 3){
        stream_message.fadeIn('100');
        stream_message.html('<span style="color: yellow;" class="radius shadow transition">'+ error_msg +'</span>');
    }

    // open
    setTimeout(function() {
        if ((tracks[currently_playing_track_id].currentTime <= 0) && ($('#Player').is('.playing'))){
            if (stream_failed == 3) {
                stream_message.fadeOut('200', function() {
                    $(this).remove();
                });
            }
            // count how many fails
            stream_failed = stream_failed + 1;
            advance_track(1);
        }
    }, 2000);
}*/



// open: delay beetween browser api and os soundmanager
//  depending on performance
// log better than linear
/*
function fade_track() {
    if ( currently_playing_track_id != -1 ) {
        var i = parseInt($('input#VolumeControl').val()) * 200;
        for(i > 0; --i;){
            set_volume( (i / 200) / 20 );
        }
        mute_current_track();
    }
}
*/

function seek_current_track( position ) {
    console.log("seek");
  /*  if ( ( currently_playing_track_id != -1 ) && ( track_loaded[ currently_playing_track_id ] ) ) {
        mute_current_track();
        tracks[ currently_playing_track_id ].currentTime = position;
    }*/
}

/*
	html5, canvas, experiment. code borrowed and modified from:
	http://9elements.com/io/projects/html5/canvas/
*/

/*
Array.prototype.remove = function(from, to) {
	if (typeof from != "number") return this.remove(this.indexOf(from));
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;

	return this.push.apply(this, rest);
};
*/


// Redirect iPhone/iPod visitors
/*
function isiPhone(){
    return (
        (navigator.platform.indexOf("iPhone") != -1) ||
        (navigator.platform.indexOf("iPod") != -1)
    );
}
if(isiPhone()){
    processing for mobile, lol.
}
*/

/*
if
((!navigator.userAgent.match(/iPhone/i)) || (!navigator.userAgent.match(/iPod/i)) || (!navigator.userAgent.match(/iPad/i))
    || (!navigator.userAgent.match(/SymbianOS/i)) || (!navigator.userAgent.match(/Android/i)) || (!navigator.userAgent.match(/IEMobile/i))
    || (!navigator.userAgent.match(/BlackBerry/i)) || (!navigator.userAgent.match(/Maemo/i))  || (!navigator.userAgent.match(/Mobile/i))) {

    function visualization() {
        $('input#Visualizer[type="checkbox"]').bind('click',function() {
            if ($(this).is(':checked')) {
                jQuery(function ($) {

                    var numParticles = 100;
                    var i;
                    var el = document.getElementById('visualizer');
                    var width = window.innerWidth;
                    var height = window.innerHeight;

                    $(window).resize(function() {
                        width = $(window).width();
                        height = $(window).height();
                    });


                    var p = Processing(el);
                    var mx = 0;
                    var my = 0;
                    var impulsX = 0;
                    var impulsY = 0;
                    var impulsToX = 0;
                    var impulsToY = 0;
                    var startedAt;
                    var now;
                    //var machine = [6775, 10217, 13583, 16967, 20375, 23777, 27113, 30466, 33842, 37209, 40651, 43992, 47371, 50659, 55091, 57497, 60840, 64245, 67580, 71863, 74326, 77769, 81233, 84448, 87838, 91228, 94558, 98394];
                    var machine = [13094, 13653, 15132, 16624, 18137, 19629, 21172, 22629, 24140, 25631, 27140, 28728, 30108, 31633, 33142, 34656, 36134, 37636, 39152, 40668, 42131, 43596, 45170, 46619, 48147, 49642, 51163, 52626, 54220, 55669, 57149, 58617, 60118, 61572, 63064, 64549, 66134, 67616, 70573, 72115, 73594, 75107, 76604, 78117, 79628, 81125, 82628, 84161, 85644, 87213, 88651, 90194, 91673, 93248, 94668, 96147, 97629, 99173, 100637, 102242, 103692, 105236, 106636, 108182, 109587, 111148, 112630, 114060, 115637, 117069, 118042, 120172, 121676, 123254, 124577, 126202, 127817, 129686, 132052, 133604, 135179, 136652, 138187, 139609, 141084, 142571, 144084, 145603, 147180, 148573, 150142, 151820, 153211, 154567, 156097, 157597, 159110, 160595, 162149, 163617, 165123, 166565, 168089, 169603, 171215, 173446, 175598, 177048, 178490, 180269, 181616, 184604, 189284, 192782, 195827, 198787, 201856, 204867, 207819, 211191, 213709, 216808, 219764, 222804, 225795, 228737, 229605, 231068, 232588, 234106, 235611, 237056, 238591, 240083, 241606, 243091, 244580];
                    var machineIndex = 0;
                    var events = [];
                    var play = false;
                    var focusedParticleIndex = null;
                    var theTweets = null;
                    components = [];

                    // universe
                    var pixels = [];
                    for(i = 0; i<numParticles; i++ ) {
                        pixels[i] = {
                            x          : Math.random()*width,
                            y          : height/2,
                            toX        : 0,
                            toY        : height/2,
                            color      : Math.random()*200 + 55,
                            angle      : Math.random()*Math.PI*2,
                            size       : 0,
                            toSize     : Math.random()*4+1,
                            r		   : 0,
                            g		   : 0,
                            b          : 0,
                            toR 	   : Math.random()*255,
                            toG 	   : Math.random()*255,
                            toB 	   : Math.random()*255,
                            flightMode : 0
                        };
                        pixels[i].toX = pixels[i].x;
                        pixels[i].speedX = 0;
                        pixels[i].speedY = 0;
                    }

                    var transitions = [
                    // random position
                    function() {
                        for(i = 0; i<pixels.length; i++ ) {
                            var p = pixels[i];
                            if(p.flightMode != 2) {
                                p.toX = Math.random()*width;
                                p.toY = Math.random()*height;
                                p.speedX = Math.cos(p.angle) * Math.random() * 3;
                                p.speedY = Math.sin(p.angle) * Math.random() * 3;
                            }
                        }
                    },
                    // white flash
                    function() {
                        for(i = 0; i<pixels.length; i++ ) {
                            var p = pixels[i];
                            if(p.flightMode != 2) {
                                p.r = 255;
                                p.g = 255;
                                p.b = 255;
                                p.size = Math.random()*50 + 50;
                            }
                        }
                    },
                    // change size
                    function() {
                        for(i = 0; i<pixels.length; i++ ) {
                            var p = pixels[i];
                            if(p.flightMode != 2) {
                                p.toSize = Math.random()*10+1;
                            }
                        }
                    },
                    // circle shape
                    function() {
                        var r = Math.floor(Math.random()*250 + 100);
                        for(i = 0; i<pixels.length; i++ ) {
                            var p = pixels[i];
                            if(p.flightMode != 2) {
                                p.toSize = Math.random()*4+1;
                                p.toX = width/2 + Math.cos(i*3.6*Math.PI/180) * r;
                                p.toY = height/2 + Math.sin(i*3.6*Math.PI/180) * r;
                                impulsX = 0;
                                impulsY = 0;
                                p.speedX = (Math.random() - 0.5)/2;
                                p.speedY = (Math.random() - 0.5)/2;
                                p.toR = Math.random()*255;
                                p.toG = Math.random()*255;
                                p.toB = Math.random()*255;
                            }
                        }
                    },

                    // heart
                    function() {
                        var heart = [[707,359],[707,359],[707,359],[707,359],[708,358],[711,354],[713,352],[714,348],[716,345],[720,335],[721,334],[722,333],[724,332],[725,330],[727,327],[731,322],[734,320],[737,318],[740,314],[743,312],[745,311],[749,309],[753,308],[757,306],[761,303],[764,302],[767,302],[771,301],[774,301],[778,301],[783,301],[786,301],[790,300],[796,300],[801,300],[805,300],[809,300],[811,300],[815,302],[817,303],[820,305],[822,306],[824,307],[827,309],[830,311],[834,313],[836,314],[838,316],[841,318],[844,321],[845,324],[847,326],[849,328],[852,332],[853,334],[855,336],[857,337],[858,339],[860,341],[862,345],[863,349],[863,352],[864,356],[864,359],[865,362],[866,364],[868,368],[869,372],[870,377],[871,381],[872,384],[872,388],[872,392],[872,395],[872,399],[872,401],[872,405],[872,409],[871,412],[870,417],[869,419],[869,422],[867,427],[866,429],[865,434],[863,438],[862,442],[861,443],[860,445],[857,448],[854,451],[852,454],[849,456],[846,459],[843,460],[836,466],[835,466],[833,467],[821,475],[820,477],[819,478],[817,481],[815,483],[811,486],[808,487],[803,491],[802,491],[800,492],[795,493],[791,497],[789,498],[786,498],[780,502],[772,507],[770,510],[767,511],[762,516],[758,520],[756,524],[753,527],[750,529],[746,532],[741,534],[736,537],[732,538],[731,539],[735,537],[735,537],[735,537],[730,543],[729,546],[727,551],[726,553],[723,555],[721,558],[715,568],[714,570],[714,572],[713,575],[708,585],[708,586],[707,586],[704,583],[704,359],[704,359],[700,356],[698,352],[697,350],[696,345],[694,343],[693,340],[690,335],[688,335],[687,334],[683,332],[681,329],[677,326],[675,323],[672,319],[669,314],[668,312],[663,310],[660,310],[656,310],[653,309],[647,309],[644,308],[642,308],[637,307],[632,303],[628,301],[624,297],[621,297],[619,297],[616,297],[616,298],[616,299],[614,300],[620,302],[620,302],[620,302],[618,302],[612,302],[605,302],[598,302],[596,303],[594,305],[592,307],[590,309],[586,310],[583,313],[582,315],[579,319],[576,320],[573,323],[571,325],[569,327],[563,329],[560,333],[558,336],[557,338],[556,341],[555,343],[551,346],[549,349],[549,354],[549,357],[547,361],[546,367],[543,372],[542,375],[541,380],[540,381],[540,382],[540,382],[540,382],[540,382],[540,384],[540,386],[540,389],[539,391],[539,394],[539,398],[539,404],[539,408],[539,412],[539,416],[540,423],[542,428],[544,433],[549,436],[552,439],[555,442],[557,445],[560,448],[562,452],[564,459],[565,461],[560,449],[560,449],[561,450],[571,458],[580,466],[584,469],[587,473],[589,476],[591,477],[575,466],[575,466],[575,466],[576,466],[582,471],[587,475],[590,477],[594,481],[598,484],[601,489],[604,491],[607,495],[611,496],[617,498],[622,500],[626,501],[629,504],[633,508],[636,510],[642,515],[650,522],[651,525],[655,528],[657,529],[660,530],[663,530],[667,533],[671,534],[676,536],[679,537],[681,539],[683,540],[676,536],[676,536],[676,536],[679,539],[684,546],[687,548],[689,551],[692,554],[696,558],[698,563],[701,567],[702,571],[704,574],[705,577],[706,579],[707,580],[708,582],[709,586]];
                        impulsX = 0;
                        impulsY = 0;
                        for(i = 0; i<pixels.length; i++ ) {
                            var p = pixels[i];
                            if(p.flightMode != 2) {
                                p.toX = heart[Math.floor(i*3.6) % heart.length][0]-200;
                                p.toY = heart[Math.floor(i*3.6) % heart.length][1]-150;
                                p.speedX = (Math.random() - 0.5)/2;
                                p.speedY = (Math.random() - 0.5)/2;
                            }
                        }
                    },


                    // star, well not really needs better x,y coords.
                    function() {
                        var star = [[75, 0],[100, 50],[150, 50],[112, 75],[150, 150],[75, 100],[0, 150],[37, 75],[0, 50],[50, 50],[78, 3],[103, 53],[153, 53],[115, 78],[153, 153],[78, 103],[3, 153],[40, 78],[3, 53],[53, 53],[84, 9],[109, 59],[159, 59],[121, 84],[159, 159],[84, 109],[9, 159],[46, 84],[9, 59],[59, 59],[102, 27],[127, 77],[177, 77],[139, 102],[177, 177],[102, 127],[27, 177],[64, 102],[27, 77],[77, 77],[156, 81],[181, 131],[231, 131],[193, 156],[231, 231],[156, 181],[81, 231],[118, 156],[81, 131],[131, 131],[318, 243],[343, 293],[393, 293],[355, 318],[393, 393],[318, 343],[243, 393],[280, 318],[243, 293],[293, 293],[804, 729],[829, 779],[879, 779],[841, 804],[879, 879],[804, 829],[729, 879],[766, 804],[729, 779],[779, 779]];
                        impulsX = 0;
                        impulsY = 0;
                        for(i = 0; i<pixels.length; i++ ) {
                            var p = pixels[i];
                            if(p.flightMode != 2) {
                                p.toX = star[i % star.length][0]-Math.cos(i) * Math.random() * 25;
                                p.toY = star[i % star.length][1]-Math.sin(i) * Math.random() * 25;
                                p.speedX = (Math.random() - 0.5)/2;
                                p.speedY = (Math.random() - 0.5)/2;
                            }
                        }
                    },

                    // color flash
                    function() {
                        for(i = 0; i<pixels.length; i++ ) {
                            var p = pixels[i];
                            if(p.flightMode != 2) {
                                p.r = i + 155;
                                p.g = i ;
                                p.b = i + 50;
                                p.size = Math.random()*0.2 + 25;
                                p.toX = Math.cos(i) * Math.random() * 25;
                                p.toY = Math.sin(i) * Math.random() * 25;
                            }
                        }
                    }
                    ];

                    var Universe = function Pixels() {
                        return {
                            framecount : 0,

                            update: function () {
                                impulsX = impulsX + (impulsToX - impulsX) / 30;
                                impulsY = impulsY + (impulsToY - impulsY) / 30;

                                // move to tox
                                for(i = 0; i<pixels.length; i++ ) {
                                    pixels[i].x = pixels[i].x + (pixels[i].toX - pixels[i].x) / 10;
                                    pixels[i].y = pixels[i].y + (pixels[i].toY - pixels[i].y) / 10;
                                    pixels[i].size = pixels[i].size + (pixels[i].toSize - pixels[i].size) / 10;

                                    pixels[i].r = pixels[i].r + (pixels[i].toR - pixels[i].r) / 10;
                                    pixels[i].g = pixels[i].g + (pixels[i].toG - pixels[i].g) / 10;
                                    pixels[i].b = pixels[i].b + (pixels[i].toB - pixels[i].b) / 10;
                                }

                                // update speed
                                for(i = 0; i<pixels.length; i++ ) {
                                    // check for flightmode
                                    var a = Math.abs(pixels[i].toX - mx) *  Math.abs(pixels[i].toX - mx);
                                    var b = Math.abs(pixels[i].toY - my) *  Math.abs(pixels[i].toY - my);
                                    var c = Math.sqrt(a+b);

                                    if(pixels[i].flightMode != 2) {
                                        if(c < 120) {
                                            if(pixels[i].flightMode == 0) {
                                                var alpha = Math.atan2(pixels[i].y - my, pixels[i].x - mx) * 180 / Math.PI + Math.random()*180-90;
                                                pixels[i].degree = alpha;
                                                pixels[i].degreeSpeed = Math.random()*1+0.5;
                                                pixels[i].frame = 0;
                                            }
                                            pixels[i].flightMode = 1;
                                        } else {
                                            pixels[i].flightMode = 0;
                                        }
                                    }

                                    // random movement
                                    if(pixels[i].flightMode == 0) {
                                        // change position
                                        pixels[i].toX += pixels[i].speedX;
                                        pixels[i].toY += pixels[i].speedY;

                                        // check for bounds
                                        if(pixels[i].x < 0) {
                                            pixels[i].x = width;
                                            pixels[i].toX = width;
                                        }
                                        if(pixels[i].x > width) {
                                            pixels[i].x = 0;
                                            pixels[i].toX = 0;
                                        }

                                        if(pixels[i].y < 0) {
                                            pixels[i].y = height;
                                            pixels[i].toY = height;
                                        }
                                        if(pixels[i].y > height) {
                                            pixels[i].y = 0;
                                            pixels[i].toY = 0;
                                        }
                                    }

                                    // seek mouse
                                    if(pixels[i].flightMode == 1) {
                                        pixels[i].toX = mx + Math.cos((pixels[i].degree + pixels[i].frame ) % 360 * Math.PI /180)*c;
                                        pixels[i].toY = my + Math.sin((pixels[i].degree + pixels[i].frame ) % 360 * Math.PI /180)*c;
                                        pixels[i].frame += pixels[i].degreeSpeed;
                                        pixels[i].degreeSpeed += 0.01;
                                    }

                                    if(pixels[i].flightMode != 2) {
                                        // add impuls
                                        pixels[i].toX += Math.floor(impulsX * pixels[i].size/30);
                                        pixels[i].toY += Math.floor(impulsY * pixels[i].size/30);
                                    }
                                }

                                // set an choord
                                var r1 = Math.floor(Math.random() * pixels.length);
                                var r2 = Math.floor(Math.random() * pixels.length);

                                if(pixels[r1].flightMode != 2) pixels[r1].size = Math.random()*30;
                                if(pixels[r2].flightMode != 2) pixels[r2].size = Math.random()*30;

                                this.framecount++;

                                now = new Date();
                                if(now.getTime() - startedAt.getTime() >= machine[machineIndex]) {
                                    machineIndex++;
                                    impulsX = Math.random()*800-400;
                                    impulsY = -Math.random()*400;

                                    var transIndex = Math.floor(Math.random()*transitions.length);
                                    transitions[transIndex]();

                                    //restart machineIndex
                                    if (machineIndex == machine.length) {
                                        machineIndex = 0;
                                        startedAt = new Date();
                                    }

                                }
                            },
                            draw: function () {
                                //p.stroke(255, 0, 0);
                                //p.ellipse(p.mouseX+5, p.mouseY+5, 5, 5);
                                p.stroke(0, Math.random()*255, Math.random()*155);

                                for(i = 0; i<pixels.length; i++ ) {
                                    p.fill(Math.floor(pixels[i].r), Math.floor(pixels[i].g), Math.floor(pixels[i].b));
                                    p.ellipse(pixels[i].x, pixels[i].y, pixels[i].size, pixels[i].size);
                                //console.log(pixels[i].x);
                                }

                                if(focusedParticleIndex != null) {
                                    p.fill(Math.floor(pixels[focusedParticleIndex].r), Math.floor(pixels[focusedParticleIndex].g), Math.floor(pixels[focusedParticleIndex].b));
                                    p.ellipse(pixels[focusedParticleIndex].x, pixels[focusedParticleIndex].y, pixels[focusedParticleIndex].size, pixels[focusedParticleIndex].size);
                                }
                            }
                        }
                    };
                    components.push(new Universe());

                    // setup processing object
                    p.setup = function() {
                        $(window).resize(function() {
                            p.size(width, height);
                        });
                        p.size(width, height);
                        //p.noStroke();
                        p.frameRate( 60 );
                        p.fill(0, 0, 0);
                        p.strokeWeight(2);
                        startedAt = new Date();
                    }

                    p.mouseMoved = function(){
                        mx = p.mouseX;
                        my = p.mouseY;
                    }

                    p.mousePressed = function() {
                        var d = new Date().getTime() - startedAt.getTime();
                        /*events.push(d);
                                            console.log(events); */
/*
                        if(focusedParticleIndex != null) {
                            pixels[focusedParticleIndex].flightMode = 0;
                            pixels[focusedParticleIndex].toSize = Math.random()*10+1;
                        }
                        for(var i = 0; i<numParticles; i++ ) {
                            if(pixels[i].flightMode == 1) {
                                pixels[i].flightMode = 2;

                                pixels[i].toSize = 100;
                                pixels[i].toX = 200;
                                pixels[i].toY = height/2;

                                focusedParticleIndex = i;

                                var randomTweet = theTweets[Math.floor(Math.random()*theTweets.length)];

                                var text = randomTweet.text.replace(/http:\/\/(\S+)/, "<a href=\"http://$1\" target=\"new\">http://$1</a>");
                                text = text.replace(/@(\S+)/, "<a href=\"http://twitter.com/$1\" target=\"new\">@$1</a>");

                                $('#tweet').html('<h1>' + text + '</h1><a href="http://twitter.com/' + randomTweet.from_user + '" target=\"new\"><img src="'
                                    + randomTweet.profile_image_url + '" width="20" height="20" border="0" /> '
                                    + randomTweet.from_user + '</a>');
                                $('#tweet').fadeIn(200);

                                $('a').css('color', 'rgb(' + Math.floor(pixels[i].r) + ',' + Math.floor(pixels[i].g) + ',' + Math.floor(pixels[i].b) + ')');

                                // abort for loop
                                i = numParticles;
                            }
                        }
                    }
                    p.draw=function(){
                        if(play) {
                            for (var i=0; i<components.length; i++) {
                                components[i].update();
                            }
                            p.background( 0 );
                            for (i=0; i<components.length; i++) {
                                components[i].draw();
                            }
                        }
                    }

                    p.init();

                    // get twitter data
                    $.ajax({
                        url: 'http://search.twitter.com/search.json?rpp=100&q=html5+audio+music',
                        dataType: 'jsonp',
                        success: function (data) {
                            theTweets = data.results;

                            setTimeout(function() {
                                startedAt = new Date();
                                $('#tweet').hide();
                                play = true;
                            }, 500);
                        }
                    });
                });

                if ($('#Player').is('.playing')) {
                    setTimeout(function(){
                        $('#visualizer').fadeIn(400);
                    }, 500);
                }
            }
            else {
                $('#visualizer').fadeOut(200);
            }
        });
    }
}   */