<?php
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
if (!function_exists('whsso_tabs_create')) {
	function whsso_tabs_create($name, $tab_names, $tab_bodies) {
		echo "<div class=\"whsso-tab-group-register-beacon\" group-name=\"".$name."\"></div>";
		$getid = 'tab-' . $name;
		if ( isset( $_GET[$getid] )) {
			$activeTab = $_GET[$getid];
		} else {
			$activeTab = $tab_names[0];
		}
		$valid = false;
		foreach ($tab_names as $tabname) {
			if ($activeTab == $tabname) {
				$valid = true;
			}
		}
        if (!$valid) {
			$activeTab = $tab_names[0];
		}
		echo "<div class=\"whsso-tab-button-wrapper whsso-tab-group-".$name."\">";
		$tabMakerI=0;
		foreach ($tab_names as $tabname) {
			echo "<button class=\"whsso-tab-button";
			if ($activeTab == $tabname) {
				echo ' whsso-tab-button-active';
			}
			echo "\" tab-index=\"".$tabMakerI."\">" . $tabname . "</button>";
			$tabMakerI++;
		}
		echo "</div>";
		for ($tabMakerI=0; $tabMakerI < count($tab_names); $tabMakerI++) { 
			echo "<div class=\"whsso-tab-content whsso-tab-content-".$name;
			if ($activeTab != $tab_names[$tabMakerI]) {
				echo ' whsso-hide';
			}
			echo "\" id=\"whsso-tab-".$name."-".$tabMakerI."\">";
			if (function_exists($tab_bodies[$tabMakerI])) {
				$output = call_user_func($tab_bodies[$tabMakerI]);
				if ($output != null) {
					echo $output;
				}
			} else {
				echo $tab_bodies[$tabMakerI];
			}
			echo "</div>";
		}
	}
}
?>