var prefManager = Components.classes["@mozilla.org/preferences-service;1"]
                                      .getService(Components.interfaces.nsIPrefBranch);
var op = { consumerKey : prefManager.getCharPref("oauth.consumer_key"),
           consumerSecret : prefManager.getCharPref("oauth.consumer_secret"),
           accessTokenKey : prefManager.getCharPref("oauth.token"),
           accessTokenSecret : prefManager.getCharPref("oauth.token_secret")
         };
var oauth = OAuth(op);


$(function()
{

  var timeline_stack = [];

  load_timeline = function()
  {
    oauth.getJSON('http://api.twitter.com/1/statuses/home_timeline.json', function(r)
    {
      dump('hi')
      $.each(r, function()
      {
        var tweet = $('<div class="tweet">'+
                          '<p class="screen_name">'+this['user']['screen_name']+'</p>'+
                          '<p class="image"><img src="'+this['user']['profile_image_url']+'" /></p>'+
                          '<p class="text">'+this['text']+'</p>'+
                          '<hr />'+
                          '</div>');
        tweet.find('img').load(function()
        {
          timeline_stack.push(tweet);
        });
      });
    }, function(d){dump(d)});
  };

  var show_tweet = function()
  {
    if(timeline_stack.length)
    {
      tweet = timeline_stack.pop();
      tweet.hide().prependTo('body');
      tweet.slideDown();
    }
  };

  load_timeline();
  var show_tweets_pulse = setInterval(show_tweet, 1000*3);
  setInterval(load_timeline, 1000*60);

  $('.tweet').live('click', function()
  {
    if($(this).hasClass('stoped')) return;

    $(this).addClass('stoped');
    clearInterval(show_tweets_pulse);
  });

  $('.tweet.stoped').live('click', function()
  {
    $(this).removeClass('stoped');
    show_tweets_pulse = setInterval(show_tweet, 1000);
  });
});


