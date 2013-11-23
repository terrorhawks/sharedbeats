<% include '/view/include/header.gtpl' %>
<div id="form" >
<form action="/createPlaylist" method="get" autocomplete = "off">
    <input type="text" name="name" maxlength="36" class="input" />
    <input type="submit" value="Go" id="homesubmit" class="btn" />
</form>
</div>
<h1 class="homeintro">Enter a <span class = "bold">playlist name</span>.</h1>
<h2 class="example"><strong>and invite some friends</strong></h2>
<% include '/view/include/footer.gtpl' %>