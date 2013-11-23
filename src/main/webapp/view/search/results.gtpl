<% include '/WEB-INF/includes/header.gtpl' %>

<h2>Results for ${request.name}</h2>

<input id="searchId" type="hidden" value="${request.searchId}">

<ul id="resultList"></ul>

<div id="viewerCanvas" style="width: 600px; height: 500px"></div>


<script type="text/javascript">
  \$(function() {
    //google.load("books", "0");
    function initialize() {
      var viewer = new google.books.DefaultViewer(document.getElementById('viewerCanvas'));
      viewer.load('ISBN:' + \$("#searchId"));
    }
    //google.setOnLoadCallback(initialize);
    window.setInterval(function() {
      var searchId = \$("#searchId").attr("value");
      \$.get('/results?searchId=' + searchId, function(data) {
        \$("#resultList").html(data);
      });
    }, 3000);
  });
</script>

<% include '/WEB-INF/includes/footer.gtpl' %>