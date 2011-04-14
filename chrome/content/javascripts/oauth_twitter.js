//Globals

var prefManager = Components.classes["@mozilla.org/preferences-service;1"]
                                      .getService(Components.interfaces.nsIPrefBranch);
var op = { consumerKey : prefManager.getCharPref("oauth.consumer_key"),
           consumerSecret : prefManager.getCharPref("oauth.consumer_secret"),
           requestTokenUrl : 'https://api.twitter.com/oauth/request_token',
           authorizationUrl : 'https://api.twitter.com/oauth/authorize',
           accessTokenUrl : 'https://api.twitter.com/oauth/access_token'
         },
         requestParams,
         accessParams;
var oauth = OAuth(op);

var open_external = function(url)
{
    var ioservice = Components.classes["@mozilla.org/network/io-service;1"]
                              .getService(Components.interfaces.nsIIOService);

    var uriToOpen = ioservice.newURI(url, null, null);

    Components.classes["@mozilla.org/uriloader/external-protocol-service;1"]
                          .getService(Components.interfaces.nsIExternalProtocolService)
                          .loadURI(uriToOpen, null);
}

var tweet = function(text, success, fail)
{
    oauth.post("http://api.twitter.com/1/statuses/update.json", {status: text.replace("\n", '')}, success, fail);
}

var verify_credentials = function(success, fail)
{
    //TODO
}
