function openCity(evt, cityName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}
jQuery(function($) {
	$('#whsso-tab-button-wrapper button').on('click',function(t) {
		console.log("Hello");
        var tab_id = $(this).attr('href').replace('#', '.tab-');
        var tab_name = $(this).attr('href').replace('#', '');

        // Set the current tab active
        $(this).parent().children().removeClass('whsso-tab-view-active');
        $(this).addClass('whsso-tab-view-active');

        // Show the active content
        $('.tab-content').addClass('hide');
        $('.tabs-content div' + tab_id).removeClass('hide');

        // Change the URL
        const urlsign = '&tab'
        var currentURL = window.location.href;
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

        switch(tab_name) {
            case 'advanced':
                var tab_title = 'Advanced Settings';
                break;
            case 'faq':
                var tab_title = 'FAQ';
                break;
            default:
                var tab_title = 'Basic Settings';
        }

        window.history.pushState(tab_title, tab_title, newURL);
        t.preventDefault();
    })
})