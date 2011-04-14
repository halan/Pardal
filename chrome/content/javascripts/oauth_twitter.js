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


var request_auth = function()
{
    $('#signin_button label').text('Loadding...');
    oauth.get('https://api.twitter.com/oauth/request_token', function(data)
    {
        open_external("https://api.twitter.com/oauth/authorize?"+data.text);
        $('#signin_button').hide();
        requestParams = data.text;
    },function(data)
    {
    });
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

var save_auth = function(pin)
{
    oauth.get('https://api.twitter.com/oauth/access_token?oauth_verifier='+pin+'&'+requestParams,
    function(data)
    {
        accessParams = get_vars_from_query_string(data.text);
        oauth.setAccessToken([accessParams.oauth_token, accessParams.oauth_token_secret]);

        prefManager.setCharPref("oauth.token", accessParams.oauth_token);
        prefManager.setCharPref("oauth.token_secret", accessParams.oauth_token_secret);
        $('#authorization').hide();
    },
    function(data){ dump('error')});
}

$(window).load(function()
{
    if( prefManager.getCharPref("oauth.token") +
        prefManager.getCharPref("oauth.token_secret") != '')
    {
        oauth.setAccessToken([prefManager.getCharPref("oauth.token"),
                                prefManager.getCharPref("oauth.token_secret")]);
        $('#authorization, #signin_button').hide();
    }

    $('#pin').keyup(function(e)
    {
       if(e.keyCode == 13) save_auth($('#pin').val());
    });
});
