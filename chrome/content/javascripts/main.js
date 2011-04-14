$(window).load(function()
{
    if( prefManager.getCharPref("oauth.token") +
        prefManager.getCharPref("oauth.token_secret") != '')
    {
//        oauth.setAccessToken([prefManager.getCharPref("oauth.token"),
///                                prefManager.getCharPref("oauth.token_secret")]);

        $('#authorization, #signin-button').hide();
    }

    dump('token ->'+prefManager.getCharPref('oauth.token')+"\n");
    dump('token_secret ->'+prefManager.getCharPref('oauth.token_secret')+"\n");
    dump('consumer_key ->'+prefManager.getCharPref('oauth.consumer_key')+"\n");
    dump('consumer_secret ->'+prefManager.getCharPref('oauth.consumer_secret')+"\n");

    oauth = OAuth({consumerKey : prefManager.getCharPref('oauth.consumer_key'),
                    consumerSecret : prefManager.getCharPref('oauth.consumer_secret'),
                    accessTokenKey : prefManager.getCharPref('oauth.token'),
                    accessTokenSecret : prefManager.getCharPref('oauth.token_secret') });


    $('#pin').keyup(function(e)
    {
       if(e.keyCode == 13)
        oauth.fetchAccessToken(function(data)
        {
            $('#authorization').hide();
            accessParams = oauth.parseTokenRequest(data.text);
            prefManager.setCharPref("oauth.token", accessParams.oauth_token);
            prefManager.setCharPref("oauth.token_secret", accessParams.oauth_token_secret);
        }, function()
        {
           dump('Erro!'); 
        });
    });

    $('#signin-button').click(function()
    {
        $('#signin-button label').text('Loadding...');

        oauth.fetchRequestToken(function(url)
        {
          open_external(url);
          $('#signin-button').hide();
        }, function()
        {
           dump('error: '+data.text);
        });
    });

    $('#text-enter-tweet').keyup(function(e)
    {
       var $$ = $(this);

       if(e.keyCode == 13)
       {
         tweet($$.val(), function(data)
         {
             $$.val('');
         }, function(data)
         {
             dump('Error: '+data.text);
         });
         return;
       }

       var container = $$.parents('#text-enter'),
          counter = container.find('.word-counter'),
          limit = $$.attr('limit'),
          n = this.value.length;

          if (n > limit) {container.addClass('counter-overflow');}
          else {container.removeClass('counter-overflow');}

          counter.text( parseInt(limit) - parseInt(n) );
    });

});
