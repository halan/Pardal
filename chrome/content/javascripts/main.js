$(window).load(function()
{
    if( prefManager.getCharPref("oauth.token") +
        prefManager.getCharPref("oauth.token_secret") != '')
    {
        oauth.setAccessToken([prefManager.getCharPref("oauth.token"),
                                prefManager.getCharPref("oauth.token_secret")]);

        $('#authorization, #signin-button').hide();
    }

    verify_credentials(function(data)
    {
        $('#timeline_tab').attr('image', data.profile_image_url);

        var background = '#'+data.profile_background_color+
                                   ' url('+data.profile_background_image_url+') '+
                                        (data.profile_background_tile ? '' : 'no-repeat')+';';
        $('#timeline_browser').get(0).contentDocument.querySelector('html')
                                                        .setAttribute('style', 'background: '+background);
    }, function(data) 
    {
        dump(data.text)
    });

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
