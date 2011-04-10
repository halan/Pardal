var split_column = function()
{
  if($('#timeline browser').size() < 2 )
  {
    var browser = $('#mentions_browser').get(0);
    $('#timeline').get(0).appendChild(browser);
    $('#mentions_tab').hide();
  }
}

var join_column = function()
{
  if($('#timeline browser').size() >= 2 )
  {
    var browser = $('#mentions_browser').get(0);
    $('#mentions').get(0).appendChild(browser);
    $('#mentions_tab').show();
  }
}


$(window).resize(function()
{
  if(window.outerWidth > 300*2) split_column();
  if(window.outerWidth < 300*2) join_column();
});
