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
    if(timeline_stack.length) $('body').prepend(timeline_stack.pop());
  };

  load_timeline();
  setInterval(show_tweet, 1000);
  setInterval(load_timeline, 1000*60);
});
