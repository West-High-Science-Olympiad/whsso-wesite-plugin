/**
* @preserve Sticky Anything 2.1.1 | @senff | GPL2 Licensed
*/

(function($) {
	$(document).ready(function($) {
		
		var addElemHeight = function(lastf, elemname) {
			return function () {
				return lastf() + $(elemname).height();
			}
		}

		var thisIsSomeBreakpoint = ''; // solely to use as a debugging breakpoint, if needed.

		var input = sticky_anything_engage.element;
		var elemnames = input.split("&");
		
		var heightf = () => parseInt(sticky_anything_engage.topspace);
		
		for (var i = 0; i < elemnames.length; i++) {
			stickThis($, $(elemnames[i]), {
				top:0,
				minscreenwidth:sticky_anything_engage.minscreenwidth,
				maxscreenwidth:sticky_anything_engage.maxscreenwidth,
				zindex:sticky_anything_engage.zindex,
				legacymode:sticky_anything_engage.legacymode,
				dynamicmode:sticky_anything_engage.dynamicmode,
				debugmode:sticky_anything_engage.debugmode,
				pushup:sticky_anything_engage.pushup,
				adminbar:sticky_anything_engage.adminbar,
				heightfunc:heightf,
				index:i
			});
			heightf = addElemHeight(heightf, elemnames[i]);
		}

	});
}(jQuery));

function stickThis($, obj, options) {
	var settings = $.extend({
		// Default
		top: 0,
		minscreenwidth: 0, 
		maxscreenwidth: 99999, 
		zindex: 99990,
		legacymode: true,
		dynamicmode: true,
		debugmode: true,
		pushup: '',
		adminbar: true,
		heightfunc: () => 0,
		index: ""
	}, options );
	var numElements = $(obj).length;

	if (numElements == 1) {
		$(obj).addClass('sticky-element-original'+settings.index).addClass('element-is-not-sticky');
		checkElement = setInterval(
			function() { 
				stickIt($,
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
			}, 10
		);
	}

	return obj;
};

// The old StickIt function
function stickIt($,stickyTop,minwidth,maxwidth,stickyZindex,pushup,dynamic,adminbar,hfunc,index) {
	stickyTop += hfunc();
	var orgElementPos = $('.sticky-element-original'+index).offset();
	orgElementTop = orgElementPos.top;
	// Calculating actual viewport width
	var e = window, a = 'inner';
	if (!('innerWidth' in window )) {
		a = 'client';
		e = document.documentElement || document.body;
	}
	viewport = e[a+'Width'];
	if ($('body').hasClass('admin-bar') && (viewport > 600)) {
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
			widthOrgElement = orgElement.css('width');	// FALLBACK for subpixels
		}
		heightOrgElement = orgElement.outerHeight();
		// If padding is percentages, convert to pixels
		paddingOrgElement = [orgElement.css('padding-top'), orgElement.css('padding-right'), orgElement.css('padding-bottom'), orgElement.css('padding-left')];
		paddingCloned = paddingOrgElement[0] + ' ' + paddingOrgElement[1] + ' ' + paddingOrgElement[2] + ' ' + paddingOrgElement[3];
		if(($('.sticky-element-cloned'+index).length < 1)) {
			createClone($,stickyTop,stickyZindex,index)
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
		stickyTopMargin = adminBarHeight;
		$('.sticky-element-cloned'+index)
			.css('left',leftOrgElement+'px')
			.css('top',stickyTop+'px')
			.css('width',widthOrgElement)
			.css('margin-top',stickyTopMargin)
			.css('padding',paddingCloned).show();
		$('.sticky-element-original'+index).css('visibility','hidden');
	} else {
		// not scrolled past the menu; only show the original menu.
		$('.sticky-element-cloned'+index).remove();
		$('.sticky-element-original'+index).css('visibility','visible');
	}
}

function createClone($,cloneTop,cloneZindex,index) {
	$('.sticky-element-original'+index).clone().insertAfter($('.sticky-element-original'+index)).addClass('sticky-element-cloned'+index).removeClass('element-is-not-sticky').addClass('element-is-sticky').css('position','fixed').css('top',cloneTop+'px').css('margin-left','0').css('z-index',cloneZindex-index).removeClass('sticky-element-original'+index).hide();
}