<% include '/WEB-INF/includes/header.gtpl' %>


<% 
def feedDetails = request.getAttribute("feedDetails")
if (feedDetails) {

	println """
		<table>
			<tr>
				<th>Cover</th>
				<th>Title</th>
				<th>Publisher</th>
				<th>Details</th>
				<th>Updated</th>
			</tr>	
"""
	def row = 0
	feedDetails.each { feedName, feedInfo ->
		def rowHeader = "<tr class='" + ((row++ % 2) ? "even" : "odd") + "'>"
		println rowHeader
		println "<td>"
		if (feedInfo.imageBytes) {
			println "<img src='thumbnail.groovy?pub=${feedName}' alt='${feedInfo.title}' title='${feedInfo.title}'/>"
		} else {
			println "<img src='/images/noimage.png' alt='No image available for ${feedInfo.title}' title='No image available for ${feedInfo.title}'/>"
		} 
		println "</td>"
		println "<td><a href='${feedInfo.url}'>${feedInfo.title}</a></td>"
		println "<td>${feedName}</td>"
		println "<td>${feedInfo.details}</td><td>"
		if (feedInfo.lastUpdate) { println feedInfo.lastUpdate }
		println "</td>"
		println "</tr>"
	}
	println "</table>"

} else {
	println "No deals available right now. Check back soon."
}
%>

<p>
    
</p>

<% include '/WEB-INF/includes/footer.gtpl' %>

