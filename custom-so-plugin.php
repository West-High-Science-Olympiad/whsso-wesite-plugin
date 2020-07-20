<?php
/**
* Plugin Name: WHSSO website plugin
* Plugin URI: https://whsscioly.org/
* Description: Plugin for custom code modifications to whsscioly.org and endpoint for online hosting of code projects created by WHS Scioly
* Version: 1.0
* Author: WHS Scioly
* Author URI: https://whsscioly.org/
**/

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

if (!defined('ABSPATH')) exit;

if (!function_exists('whsso_plugin_add_to_plugin_list')) {
    function whsso_plugin_add_to_plugin_list() {
		add_options_page('WHSSO Website Plugin Configuration', 'WHS Scioly', 'manage_options', 'whsso-plugin', 'whsso_plugin_settings');
    }
}

if (!function_exists('whsso_plugin_settings_link')) {
	function whsso_plugin_settings_link($links) {
		$settings_link = '<a href="options-general.php?page=whsso-plugin">Settings</a>';
		array_unshift($links, $settings_link);
		return $links;
	}
}

if (!function_exists('whsso_plugin_settings')) {
	function whsso_plugin_settings() {
		echo "<br>";
		whsso_tabs_create("Main",
			array('Home Page', 'Sticky Element Settings', "Helpful Bot Configuration"),
			array(
				"backend_landing_page",
				"sticky_anything_config_page",
				"helpful_bot_config_page"
			)
		);
	}
}

if (!function_exists("backend_landing_page")) {
	function backend_landing_page() {
		include "backend-home.php";
	}
}

$plugin = plugin_basename(__FILE__);

add_action('admin_menu', 'whsso_plugin_add_to_plugin_list');
add_action('admin_enqueue_scripts', 'whsso_plugin_styles');
add_filter("plugin_action_links_$plugin", 'whsso_plugin_settings_link');
if (isset($_GET['page'])) {
	if ($_GET['page'] === 'whsso-plugin') {
		add_filter('admin_footer_text', "empty_string");
		add_filter('update_footer', 'empty_string', 11);
	}
}

if (!function_exists("empty_string")) {
	function empty_string($default) {
		return "";
	}
}

// REGISTER AND RUN EACH MODULE
require_once dirname( __FILE__ ).'/sekrit.php';
if (!function_exists('whsso_plugin_styles')) {
	function whsso_plugin_styles($hook) {
		if ($hook == 'settings_page_whsso-plugin') {
			whsso_register_module_jscss_tabs();
			whsso_register_module_jscss_stickyelements();
			whsso_register_module_jscss_helpfulbot();
		}
	}
}

// tabs
require_once dirname( __FILE__ ).'/modules/tabs/tabmaker.php';
function whsso_register_module_jscss_tabs() {
	wp_register_script('whssoPluginMainTabViewerScript', plugins_url('/modules/tabs/tabmanager.js', __FILE__), array( 'jquery' ));
	wp_enqueue_script('whssoPluginMainTabViewerScript');
	wp_register_style('whssoPluginMainTabViewerStyle', plugins_url('/modules/tabs/tabstyles.css', __FILE__));
	wp_enqueue_style('whssoPluginMainTabViewerStyle');
}

// phpbutton
require_once dirname( __FILE__ ).'/modules/phpbutton/button.php';

// stickyelements
require_once dirname( __FILE__ ).'/modules/stickyelements/sticky-interface.php';
add_action('wp_enqueue_scripts', 'load_sticky_anything');
add_action('admin_init', 'sticky_anything_admin_init');
function whsso_register_module_jscss_stickyelements() {
	wp_register_style('whssoPluginStickyHoverHintStyle', plugins_url('/modules/stickyelements/hoverhint.css', __FILE__));
	wp_enqueue_style('whssoPluginStickyHoverHintStyle');
}

// helpfulbot
require_once dirname( __FILE__ ).'/modules/helpfulbot/helpful.php';
function whsso_register_module_jscss_helpfulbot() {
	wp_register_script('whssoPlgnHlpflBtSttngsPagScrpt', plugins_url('/modules/helpfulbot/settings.js', __FILE__), array( 'jquery' ));
	wp_enqueue_script('whssoPlgnHlpflBtSttngsPagScrpt');
	wp_register_style('whssoPlgnHlpflBtSttngsPagStyle', plugins_url('/modules/helpfulbot/settings.css', __FILE__));
	wp_enqueue_style('whssoPlgnHlpflBtSttngsPagStyle');
}
register_activation_hook(__FILE__, 'launch_helpful_bot');
register_deactivation_hook(__FILE__, 'kill_helpful_bot');