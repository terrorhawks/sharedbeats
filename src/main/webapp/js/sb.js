$(function() {

    $("#artistSearch").autocomplete({
        source: '/searchArtist',
        minLength : 3
    });

    $('.addPlaylist').live('click', function() {
        var that = this;
        var id = $(this).attr('data-id');
        $.get('addPlaylist?trackId=' + id + "&id=" + $("#id").val());
        $(that).attr('class', 'removePlaylist');
        $(that).children('img').attr('src', '/i/Button-Delete-icon.png');
        var idStr = "#" + id;
        $("#currentTracks").append("<li id='track" + id + "'>" + $(idStr).text() + "</li>").fadeIn();
        return false;

    });

    $('.removePlaylist').live('click', function() {
        $("#track" + $(this).attr('data-id')).remove().fadeOut('slow');
        $(this).attr('class', 'addPlaylist');
        $(this).children('img').attr('src', '/i/Button-Add-icon.png');
    });

    $('.pause').live('click', function() {
        ytplayer = document.getElementById("ytPlayer");
        ytplayer.pauseVideo();
        $(this).attr('class', 'play');
        $(this).children('img').attr('src', '/i/Button-Play-icon.png');
    });

    $('.play').live('click', function() {
        $(".pause").attr('class', 'play').children('img').attr('src', '/i/Button-Play-icon.png');
        ;
        var id = $(this).attr('data-vid');
        var that = this;
        var play = function(that, id) {
            ytplayer = document.getElementById("ytPlayer");
            ytplayer.cueVideoById(id);
            var result = ytplayer.playVideo();
            console.log(result);
            $(that).attr('class', 'pause');
            $(that).children('img').attr('src', '/i/Button-Pause-icon.png');
        }

        if (id === '') {
            $.get('/getVID?id=' + $(this).attr('data-id'), function(data) {
                play(that, data);
            })
        } else {
            play(that, id);
        }

    });

    $("#findTracks").click(function() {
        $("#tracks li").fadeOut().remove();
        //var id = $("#id").val();
        var url = "/findTracks?" + $("#artistSearch").serialize();
        $("#tracks").load(url).fadeIn();
        return false;
    });


});