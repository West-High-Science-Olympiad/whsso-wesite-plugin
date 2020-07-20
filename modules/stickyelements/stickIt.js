/**
    WHSSO Website Plugin: for custom frontend interface modification and
    educational/competitive projects requiring a home on the website
    Copyright (C) 2020  WHSSO

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(function($) {
	$(document).ready(function($) {

		var input = sticky_anything_engage.element;
        var elemnames = input.split("&");
        
        var topGap = sticky_anything_engage.topspace;
        if (!parseInt(topGap)) {
            topGap = "0";
        }
        
        var elems = Array(elemnames.length);
        for (var i = 0; i < elems.length; i++) {
            elems[i] = $(elemnames[i])[0];
        }
        elems = elems.filter(function (elem) {
            return elem != null;
        });

        console.log(elems);

        var z = sticky_anything_engage.zindex;

        var stuck = Array(elems.length);
        for (var i = 0; i < elems.length; i++) {
        	stuck[i] = false;
            elems[i].style.zIndex = z;
            z--;
        }
        var top = elems.length - 1;

        var poses = Array(elems.length);
        var offset = Array(elems.length);

        var getPose = function(element) {
            var offsetLeftPos = 0;
            var scrollLeftPos = 0;
            var clientLeftPos = 0;
            var widthPos = 0;
            var offsetTopPos = 0;
            var scrollTopPos = 0;
            var clientTopPos = 0;
            var heightPos = 0;
            widthPos = element.offsetWidth;
            heightPos = element.offsetHeight;
            while(element) {
                offsetLeftPos += element.offsetLeft;
                scrollLeftPos += element.scrollLeft;
                clientLeftPos += element.clientLeft;
                offsetTopPos += element.offsetTop;
                scrollTopPos += element.scrollTop;
                clientTopPos += element.clientTop;
                element = element.offsetParent;
            }
            return {
                left: offsetLeftPos - scrollLeftPos + clientLeftPos,
                width: widthPos,
                top: offsetTopPos - scrollTopPos + clientTopPos,
                height: heightPos
            };
        }
        
        var getElementDistance = function(a, b) {
            var div1rect = a.getBoundingClientRect();
            var div2rect = b.getBoundingClientRect();

            var div1y = div1rect.top + div1rect.height;
            var div2y = div2rect.top;

            return div2y- div1y;
        }

        var recalculateStickyOffset = function() {
        	for (var i = top; i >= 0; i--) {
            	if (stuck[i]) {
                    unstick(elems[i]);
                    stuck[i] = false;
                }
            }
            for (var i = 0; i <= top; i++) {
            	poses[i] = getPose(elems[i]);
            }
            reStick();
        }

        var reStick = function() {
            offset[0] = parseInt(topGap);
            var adminbar = 0;
            if ($('body').hasClass('admin-bar')) {
                adminbar = $('#wpadminbar').height();
                offset[0] += adminbar;
            }
        	for (var i = 0; i <= top; i++) {
                var newneedstick;
                var origposeelem = stuck[i] ? document.getElementById("sticky-placeholder-"+i) : elems[i];
                if (i == 0) {
                    var adminbarelem = document.getElementById("wpadminbar");
                    if (adminbarelem) {
                        newneedstick = getElementDistance(adminbarelem, origposeelem) <= parseInt(topGap);
                    } else {
                        newneedstick = window.pageYOffset >= parseInt(topGap);
                    }
                } else {
                    newneedstick = getElementDistance(elems[i-1], origposeelem) <= 0;
                }
            	if (newneedstick) {
        	        if (i < top) {
        	        	offset[i+1] = offset[i] + parseInt(elems[i].clientHeight);
                    }
                    if (!stuck[i]) {
                        stick(elems[i], offset[i], poses[i], i);
                        stuck[i] = true;
                    }
          		} else {
                    if (stuck[i]) {
                        unstick(elems[i]);
                        stuck[i] = false;
                    }
          		}
            }
        }

        var placeholder = function(width, height, i) {
            var out = document.createElement('div');
            out.style.width = width + "px";
            out.style.height = height + "px";
            out.id = "sticky-placeholder-" + i;
            return out;
        }

        var stick = function(element, elemoffset, pose, i) {
            element.parentElement.insertBefore(placeholder(pose.width, pose.height, i), element);
            element.style.position = "fixed";
            element.style.top = elemoffset + "px";
            element.style.width = pose.width + "px";
        }

        var unstick = function(element) {
            var siblings = element.parentElement.childNodes;
            siblings[Array.prototype.indexOf.call(siblings, element)-1].remove();
        	element.style.position = "";
            element.style.top = "";
            element.style.width = "";
        }

        recalculateStickyOffset();

        var rate = parseInt(sticky_anything_engage.rate);
        if (rate == 0) {
            window.addEventListener("scroll", reStick);
        } else {
            setInterval(reStick, rate);
        }
        window.addEventListener("resize", recalculateStickyOffset);
	});
}(jQuery));