/*
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