/*--- spliting columns --*/

var split_columns = function (width) {
  var min_column = 300;
  var columns = Math.min(parseInt(width / 200), $('tabpanel').size());
  var current_columns_size = $('#timeline browser').size();

  if (current_columns_size < columns) {
    for (column=1; column < columns; column++) {
      var browser = $('browser', $('tabpanel').get(column)).get(0);
      $('tabpanel').get(0).appendChild(browser);
      $($('tab').get(column)).hide();
    }

    $('tab[selected=true]:not(:visible)').each(function () {
      $('tabpanels').attr('selectedIndex', 0);
      $('tab:first').attr('selected', true);
    });
  }
  else if ( current_columns_size > columns) {
    var join_columns_size = current_columns_size - columns; 
    for (column=0; column < current_columns_size; column++) {
      if (!column < columns) {
        var browser = $('#timeline browser').get(1);
        $('tabpanel').get(column).appendChild(browser);
        $($('tab').get(column)).show();
      }
    }
  }
};

$(window).resize(function () {
  split_columns(window.outerWidth);
});

/*--- counter ---*/
$(window).load(function()
{
    if( prefManager.getCharPref("oauth.token") +
        prefManager.getCharPref("oauth.token_secret") != '')
    {
        oauth.setAccessToken([prefManager.getCharPref("oauth.token"),
                                prefManager.getCharPref("oauth.token_secret")]);

        $('#authorization, #signin-button').hide();
    }

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
         tweet($$.val(), function()
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
