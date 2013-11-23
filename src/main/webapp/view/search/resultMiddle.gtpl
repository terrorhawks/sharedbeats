<% request.searchResults.each{ result ->   %>
<li>
   ${result.name} - ${result.price} <a href="${result.url}">buy</a>
</li>
<% } %>

