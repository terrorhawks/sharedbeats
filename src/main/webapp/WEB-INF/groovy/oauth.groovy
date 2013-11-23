
import twitter4j.*
import com.google.appengine.api.datastore.*
import com.thriftebook.*


log.info "Processing oAuth Credential Transfer"

def config = new Properties()
config.load(Constants.class.getClassLoader().getResourceAsStream("config.properties"))


def generateRequestToken(twitter, callbackUrl, config) {	
	
	def consumerKey = config.getProperty("consumer_key")
	def consumerSecret = config.getProperty("consumer_secret")
	twitter.setOAuthConsumer(consumerKey, consumerSecret)
	def requestToken = twitter.getOAuthRequestToken(callbackUrl)
	return requestToken 
	
}


println config.getProperty("authorize_url")


if (!request.getSession().requestToken) {
		
	def twitterClient = new twitter4j.Twitter()	
	def returnUrl = config.return_url
	log.info "Generating request with return url of [${returnUrl}]"
	def requestToken = generateRequestToken(twitterClient, returnUrl, config)
	request.session.twitter = twitterClient
	request.session.requestToken = requestToken
	response.sendRedirect(requestToken.getAuthorizationURL())
	
} else {
	def accessToken = request.session.twitter.getOAuthAccessToken(request.session.requestToken, params.oauth_verifier)
	def twitterAuth = [ token: accessToken.token, tokenSecret : accessToken.tokenSecret ]

	def newEntity = new Entity(Constants.TWITTER_AUTH)
	newEntity << twitterAuth
	newEntity.save()
	
	log.info "Saved twitter creds..."
	def twitterUser = request.session.twitter.verifyCredentials()
	log.info "Validate successful for ${twitterUser.screenName}"
	request.session.user = twitterUser
	forward '/oauth.gtpl'
}