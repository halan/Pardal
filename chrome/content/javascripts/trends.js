$(function()
{
    $.getJSON('http://api.twitter.com/1/trends.json', function(r)
    {
        $('#trends').append('<a>'+r.trends[0]['name']+'</a> ');
        $('#trends').append('<a>'+r.trends[1]['name']+'</a> ');
    });
 });
