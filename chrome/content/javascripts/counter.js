/*--- counter ---*/
var counter = function (input) {

  var $$ = $(input),
      container = $$.parents('#text-enter'),
      counter = container.find('.word-counter'),
      limit = $$.attr('limit'),
      n = input.value.length;

  if (n > limit) {container.addClass('counter-overflow');}
  else {container.removeClass('counter-overflow');}

  counter.text( parseInt(limit) - parseInt(n) );
};