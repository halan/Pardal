$(function()
{
  var timeline_stack = [];

  load_timeline = function()
  {
    $.getJSON('http://api.twitter.com/1/statuses/public_timeline.json', function(r)
    {
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
    });
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
  var show_tweets_pulse = setInterval(show_tweet, 1000);
  setInterval(load_timeline, 1000*20);

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
