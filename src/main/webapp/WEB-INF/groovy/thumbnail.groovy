
def pub = params.pub

def pubDetails  = memcache.get(pub)
if (pubDetails.imageBytes != null) {
	byte[] b = pubDetails.imageBytes
	response.setContentType("image/jpg")
	response.setContentLength(b.length)
	sout.write(b)  // note: response.getOutputStream().write(byte[]) causes security errors when deployed
} else {
	response.sendError(404)	
}
