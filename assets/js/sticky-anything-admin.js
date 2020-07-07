/**
* @preserve Sticky Anything 2.1.1 | @senff | GPL2 Licensed
*/

jQuery(function($) {

	// --- HANDLING THE TABS ----------------------------------- 

    $('#nav-tab-wrapper-sticky-anything button').on('click',function(t) {
        var tab_id = $(this).attr('href').replace('#', '.tab-sticky-');
        var tab_name = $(this).attr('href').replace('#', '');

        // Set the current tab active
        $(this).parent().children().removeClass('nav-tab-active2');
        $(this).addClass('nav-tab-active2');

        // Show the active content
        $('.sticky-anything-tab-content').addClass('hide');
        $('.tabs-content div' + tab_id).removeClass('hide');
//         $('input[name="sa_tab"]').val(tab_name);

        // Change the URL
        const urlsign = '&sticky-anything-tab'
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
    });

//     $('a.faq').on('click',function(t) {
//         $('.nav-tab-wrapper a').removeClass('nav-tab-active');
//         $('.nav-tab-wrapper a[href="#faq"]').addClass('nav-tab-active');
//     });


//     $('#sa_legacymode').on('change',function() {
//         if($("#sa_legacymode").is(':checked')) {
//             $("#row-dynamic-mode").removeClass('disabled-feature'); 
//             $("#row-dynamic-mode .showhide").slideDown(); 
//         } else {
//             $("#row-dynamic-mode").addClass('disabled-feature');
//             $("#row-dynamic-mode .showhide").slideUp(); 
//         }
//     });

//     $('.form-table').on('click','.disabled-feature', function(e) {
//         e.preventDefault();
//     });
});
