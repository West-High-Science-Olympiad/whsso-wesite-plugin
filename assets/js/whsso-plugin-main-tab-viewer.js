jQuery(function($) {
  var register = document.getElementsByClassName("whsso-tab-group-register-beacon");
  for (var i = 0; i < register.length; i++) {
    whsso_tab_group_process($, register[i].attributes["group-name"].nodeValue);
  }
});

function whsso_tab_group_process($, name) {
  $(".whsso-tab-group-"+name+" button").on("click", function(t) {
    $(this).parent().children().removeClass('whsso-tab-button-active');
    $(this).addClass('whsso-tab-button-active');
    $('.whsso-tab-content-'+name).addClass('whsso-hide');
    $('#whsso-tab-'+name+'-'+$(this).attr("tab-index")).removeClass('whsso-hide');
    
    const urlsign = '&tab-'+name;
    var currentURL = window.location.href;
    var tab_name = $(this)[0].innerHTML;
    if(currentURL.indexOf(urlsign)>0) {
			var dex = currentURL.indexOf(urlsign);
      var h1 = currentURL.substring(0, dex);
      var h2 = currentURL.substring(dex+1);
      if (h2.indexOf("&") == -1) {
        var newURL = h1 + urlsign + '=' + tab_name;
      } else {
  	    var newURL = h1 + urlsign + '=' + tab_name + h2.substring(h2.indexOf("&"));
      }
    } else {
      var newURL = currentURL + urlsign + '=' + tab_name;
    }
    window.history.pushState(tab_name, tab_name, newURL);
    t.preventDefault();
  });
}