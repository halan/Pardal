/*--- spliting columns --*/

var split_columns = function(width)
{
  var min_column = 300;
  var columns = Math.min(parseInt(width/200), $('tabpanel').size());
  var current_columns_size = $('#timeline browser').size();

  if(current_columns_size < columns)
  {
    for(column=1; column < columns; column++)
    {
      var browser = $('browser', $('tabpanel').get(column)).get(0);
      $('tabpanel').get(0).appendChild(browser);
      $($('tab').get(column)).hide();
    }

    $('tab[selected=true]:not(:visible)').each(function()
    {
      $('tabpanels').attr('selectedIndex', 0);
      $('tab:first').attr('selected', true);
    });
  }
  else if( current_columns_size > columns)
  {
    var join_columns_size = current_columns_size - columns; 
    for(column=0; column < current_columns_size; column++)
    {
      if(!column < columns)
      {
        var browser = $('#timeline browser').get(1);
        $('tabpanel').get(column).appendChild(browser);
        $($('tab').get(column)).show();
      }
    }
  }
};


$(window).resize(function()
{
  split_columns(window.outerWidth);
});


/*--- counter ---*/
var counter = function(input){

  var $$ = $(input),
      container = $$.parents('#text-enter'),
      counter = container.find('.word-counter'),
      limit = $$.attr('limit'),
      n = input.value.length;

  if (n > limit) container.addClass('counter-overflow');
  else container.removeClass('counter-overflow');

  counter.text( parseInt(limit) - parseInt(n) );
};

var main = function()
{
    $('.word-counter').text('abrindo')
    window.open('chrome://pardal/content/ui/auth.xul', "auth", "chrome")
}
