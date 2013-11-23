<% include '/WEB-INF/includes/header.gtpl' %>

<script type="text/javascript">
	\$(function() {
		\$("#search").autocomplete({
			source: '/bookNames',
            minLength : 3
		});
	});
</script>


<form action="/search">
<label>Search Books</label>
  <input autocomplete=off class="ui-autocomplete-input" id=search name=name maxlength=2048 type=text />
  <input type=submit value=go />
</form>

<% include '/WEB-INF/includes/footer.gtpl' %>
