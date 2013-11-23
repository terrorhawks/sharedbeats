import com.google.appengine.api.datastore.Entity

Entity jabber = new Entity("jabber")
jabber.from = message.from
jabber.recipients = message.recipients
jabber.body = message.body
jabber.save()