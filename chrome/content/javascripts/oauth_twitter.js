//Globals

var prefManager = Components.classes["@mozilla.org/preferences-service;1"]
                                      .getService(Components.interfaces.nsIPrefBranch);
var op = { consumerKey : prefManager.getCharPref("oauth.consumer_key"),
           consumerSecret : prefManager.getCharPref("oauth.consumer_secret")
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


var request_auth = function(loading, success, fail)
{
    loading = (loading || function(){});
    success = (success || function(){});
    fail = (fail || function(){});

    loading();
    oauth.get('https://api.twitter.com/oauth/request_token', function(data)
    {
        open_external("https://api.twitter.com/oauth/authorize?"+data.text);
        success();
        requestParams = data.text;
    },fail);
};

var get_vars_from_query_string  = function(text)
{
    var out = {};

    $.each(text.split('&'), function()
    {
        var pieces = this.split('=');
        out[pieces[0]] = pieces[1];
    });
    return out;
}

var save_auth = function(pin, success, fail)
{
    success = (success || function(){});
    fail = (fail || function(){});

    oauth.get('https://api.twitter.com/oauth/access_token?oauth_verifier='+pin+'&'+requestParams,
    function(data)
    {
        accessParams = get_vars_from_query_string(data.text);
        oauth.setAccessToken([accessParams.oauth_token, accessParams.oauth_token_secret]);

        prefManager.setCharPref("oauth.token", accessParams.oauth_token);
        prefManager.setCharPref("oauth.token_secret", accessParams.oauth_token_secret);
        success();
    },fail);
}
