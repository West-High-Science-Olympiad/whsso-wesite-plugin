/**
* @preserve Sticky Anything 2.1.1 | @senff | GPL2 Licensed
*/

console.error('PLEASE NOTE: this is just a notification that the Sticky Menu (or Anything!) plugin is now working in Debug Mode.');
console.error('Even though this mode will not impact any functionality, do NOT use this mode in production environments!');

(function ($) {

  $.fn.stickThis = function(options) {

    var settings = $.extend({
    	// Default
	    top: 0,
	    minscreenwidth: 0, 
	    maxscreenwidth: 99999, 
	    zindex: 99999, 
	    legacymode: true,
	    dynamicmode: true,
	    debugmode: true,
	    pushup: '',
      	adminbar: false,
		heightfunc: () => 0,
		index: ""
      }, options );

    var numElements = $(this).length;
    var numPushElements = $(settings.pushup).length;
	  
    if (numPushElements < 1) {
      // There are no elements on the page with the called selector for the Push-up Element.
      if((settings.debugmode == true) && (settings.pushup)) {
        console.error('STICKY ANYTHING DEBUG: There are no elements with the selector/class/ID you selected for the Push-up element ("'+settings.pushup+'").');
      }
      // Resetting it to NOTHING.
      settings.pushup = '';
    } else if (numPushElements > 1) {
      // You can't use more than one element to push up the sticky element.
      // Make sure that you use a selector that applies to only ONE SINGLE element on the page.
      // Want to find out quickly where all the elements are that you targeted? Uncomment the next line to debug.
      // $(settings.pushup).css('border','solid 3px #ff0000');
      if(settings.debugmode == true) {
        console.error('STICKY ANYTHING DEBUG: There are '+numPushElements+' elements on the page with the selector/class/ID you selected for the push-up element ("'+settings.pushup+'"). You can select only ONE element to push the sticky element up.');
      }  
      // Resetting it to NOTHING.
      settings.pushup = '';
    } 
	
    if (numElements < 1) {
      // There are no elements on the page with the called selector.
      if(settings.debugmode == true) {
        console.error('STICKY ANYTHING DEBUG: There are no elements with the selector/class/ID you selected for the sticky element ("'+this.selector+'").');
      }
    } else if (numElements > 1) {
      // This is not going to work either. You can't make more than one element sticky. They will only get in eachother's way.
      // Make sure that you use a selector that applies to only ONE SINGLE element on the page.
      // Want to find out quickly where all the elements are that you targeted? Uncomment the next line to debug.
      // $(this).css('border','solid 3px #00ff00');
      if(settings.debugmode == true) {
        console.error('STICKY ANYTHING DEBUG: There are '+numPushElements+' elements with the selector/class/ID you selected for the sticky element ("'+this.selector+'"). You can only make ONE element sticky.');
      }  
    } else {
		
        // LEGACY MODE
        $(this).addClass('sticky-element-original'+settings.index).addClass('element-is-not-sticky');
        
		if(settings.dynamicmode != true) {
          // Create a clone of the menu, right next to original (in the DOM) on initial page load
          createClone(settings.top,settings.zindex,settings.index);
        }
		
        checkElement = setInterval(
			function() { 
// 				console.log("start");
				stickItLegacy(
					settings.top,
					settings.minscreenwidth,
					settings.maxscreenwidth,
					settings.zindex,
					settings.pushup,
					settings.dynamicmode,
					settings.adminbar,
					settings.heightfunc,
					settings.index
				);
// 				console.log("end");
			}
		,10)
    }
	
    return this;
  };

  // The old StickIt function
  function stickItLegacy(stickyTop,minwidth,maxwidth,stickyZindex,pushup,dynamic,adminbar,hfunc,index) {
	  
	stickyTop += hfunc();

    var orgElementPos = $('.sticky-element-original'+index).offset();
    orgElementTop = orgElementPos.top;               

    if(pushup) {
      var pushElementPos = $(pushup).offset();
      pushElementTop = pushElementPos.top;    
    } 

    // Calculating actual viewport width
    var e = window, a = 'inner';
    if (!('innerWidth' in window )) {
      a = 'client';
      e = document.documentElement || document.body;
    }
    viewport = e[ a+'Width' ];

    if ((adminbar) && $('body').hasClass('admin-bar') && (viewport > 600)) {
      adminBarHeight = $('#wpadminbar').height();
    } else {
      adminBarHeight = 0;
    }

    if (($(window).scrollTop() >= (orgElementTop - stickyTop - adminBarHeight)) && (viewport >= minwidth) && (viewport <= maxwidth)) {

      // scrolled past the original position; now only show the cloned, sticky element.

      // Cloned element should always have same left position and width as original element.     
      orgElement = $('.sticky-element-original'+index);
      coordsOrgElement = orgElement.offset();
      leftOrgElement = coordsOrgElement.left;  
      widthOrgElement = orgElement[0].getBoundingClientRect().width;
      if (!widthOrgElement) {
        widthOrgElement = orgElement.css('width');  // FALLBACK for subpixels
      }
      heightOrgElement = orgElement.outerHeight();

      // If padding is percentages, convert to pixels
      paddingOrgElement = [orgElement.css('padding-top'), orgElement.css('padding-right'), orgElement.css('padding-bottom'), orgElement.css('padding-left')];
      paddingCloned = paddingOrgElement[0] + ' ' + paddingOrgElement[1] + ' ' + paddingOrgElement[2] + ' ' + paddingOrgElement[3];

      if( (dynamic == true) && ($('.sticky-element-cloned'+index).length < 1)     ) {
        // DYNAMIC MODE: if there is no clone present, create it right now
        createClone(stickyTop,stickyZindex,index);
      }

      // Fixes bug where height of original element returns zero
      elementHeight = 0;
      if (heightOrgElement < 1) {
        elementHeight = $('.sticky-element-cloned'+index).outerHeight();
      } else {
        elementHeight = $('.sticky-element-original'+index).outerHeight();
      }

      // If scrolled position = pushup-element (top coordinate) - space between top and element - element height - admin bar
      // In other words, if the pushup element hits the bottom of the sticky element
      if (pushup && ($(window).scrollTop() > (pushElementTop-stickyTop-elementHeight-adminBarHeight))) {
        stickyTopMargin = (pushElementTop-stickyTop-elementHeight-$(window).scrollTop());
      } else {
        stickyTopMargin = adminBarHeight;
      }

      $('.sticky-element-cloned'+index)
		  .css('left',leftOrgElement+'px').css('top',stickyTop+'px').css('width',widthOrgElement).css('margin-top',stickyTopMargin).css('padding',paddingCloned).show();
      $('.sticky-element-original'+index).css('visibility','hidden');
    } else {
      // not scrolled past the menu; only show the original menu.
      if(dynamic == true) {
        $('.sticky-element-cloned'+index).remove();
      } else {
        $('.sticky-element-cloned'+index).hide();
      }
      $('.sticky-element-original'+index).css('visibility','visible');
    }
  }

  function createClone(cloneTop,cloneZindex,index) {
    $('.sticky-element-original'+index).clone().insertAfter($('.sticky-element-original'+index)).addClass('sticky-element-cloned'+index).removeClass('element-is-not-sticky').addClass('element-is-sticky').css('position','fixed').css('top',cloneTop+'px').css('margin-left','0').css('z-index',cloneZindex-index).removeClass('sticky-element-original'+index).hide();
  }

}(jQuery));
