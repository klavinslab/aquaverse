function highlight_code() {
  $('code').each(function(i, block) {
    if ( $(block).attr("class") ) { // inline code has no class
       hljs.highlightBlock(block);
       $(block).addClass("code-block");
    }
  });
  $("#precondition").click(function() {
    if ( $(this).html() == "[show]" ) {
      $(this).html("[hide]");
      $($("pre")[0]).show();
    } else {
      $(this).html("[show]");
      $($("pre")[0]).hide();
    }
  });
  $("#protocol").click(function() {
    if ( $(this).html() == "[show]" ) {
      $(this).html("[hide]");
    $($("pre")[1]).show();
    } else {
      $(this).html("[show]");
      $($("pre")[1]).hide();
    }
  });
}
