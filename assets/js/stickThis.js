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

		var thisIsSomeBreakpoint = '' // solely to use as a debugging breakpoint, if needed.

		var input = sticky_anything_engage.element;
		var elemnames = input.split("&");
		
		var heightf = () => 0;
		
		console.log(heightf());
		
		for (var i = 0; i < elemnames.length; i++) {
			$(elemnames[i]).stickThis({
				top:sticky_anything_engage.topspace,
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
			console.log(elemnames[i]);
			console.log(heightf());
		}

	});
}(jQuery));
