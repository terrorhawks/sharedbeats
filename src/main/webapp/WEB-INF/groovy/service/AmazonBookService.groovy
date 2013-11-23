package service

import com.cbso.service.amazon.AmazonWebService
import groovyx.gaelyk.logging.GroovyLogger
import com.google.appengine.api.urlfetch.URLFetchService

class AmazonBookService {

  def log = new GroovyLogger("myLogger")

  def getBook(isbn) {
    assert isbn
    AmazonWebService helper = AmazonWebService.getInstance('ecs.amazonaws.com', '1MNKB80E2N9ARQC5WYR2', 'zY0BEvdoQeL/Fx1d6l5bFzXYINLDCO93Kdrt5OFk');
    def webParams = ['Service':'AWSECommerceService', 'Version': '2009-03-31', 'Operation' : 'ItemLookup',
            'AssociateTag' : 'cheapestboo01-20', 'ResponseGroup':'Medium', 'ItemId': isbn]
    def requestUrl = helper.sign(webParams);
    log.info("url... ${requestUrl}")
    def response = new XmlSlurper().parse(requestUrl)
    log.info("response... ${response.Items.Item.ItemAttributes}")
    def item = response.Items.Item
    return [title : item.ItemAttributes.Title, author : item.ItemAttributes.Author.collect {it}.join(', '),
            price : item.ItemAttributes.ListPrice.FormattedPrice, mediumImageURL: item.MediumImage.URL,
            url : item.DetailPageURL ]
  }

  def findBooks(name) {
    assert name
    AmazonWebService helper = AmazonWebService.getInstance('ecs.amazonaws.com', '1MNKB80E2N9ARQC5WYR2', 'zY0BEvdoQeL/Fx1d6l5bFzXYINLDCO93Kdrt5OFk');
    def webParams = ['Service':'AWSECommerceService', 'SearchIndex' : 'Books', 'Version': '2009-03-31', 'Operation' : 'ItemSearch',
            'AssociateTag' : 'cheapestboo01-20', 'ResponseGroup':'Small,Medium', 'Title': name]
    def requestUrl = helper.sign(webParams);
    log.info("url... ${requestUrl}")
    def response = new XmlSlurper().parse(requestUrl)
    //return response.Items*.Item.ASIN
    def titleMatch = []
      response.Items.Item.each { item  ->
        log.info("found ${item.ItemAttributes.Title}")
        titleMatch.add ( item.ItemAttributes.Title as String )
      }
    return titleMatch
  }
}
