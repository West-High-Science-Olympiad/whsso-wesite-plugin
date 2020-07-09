<?php
/**
* Plugin Name: WHSSO website plugin
* Plugin URI: https://whsscioly.org/
* Description: Plugin for custom code modifications to whsscioly.org and endpoint for online hosting of code projects created by WHS Scioly
* Version: 1.0
* Author: WHS Scioly
* Author URI: https://whsscioly.org/
**/

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
			array('Home Page', 'Sticky Element Settings', "Blank Page"),
			array(
				"<h3>Home Page</h3>\n<p>Im supposed to like put info here or something right?</p>",
				"sticky_anything_config_page",
				"<h3>Blank Page</h3>\n<p>This page intentionally left blank.</p>"
			)
		);
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
if (!function_exists('whsso_plugin_styles')) {
	function whsso_plugin_styles($hook) {
		if ($hook == 'settings_page_whsso-plugin') {
			whsso_register_module_jscss_tabs();
			whsso_register_module_jscss_stickyelements();
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

// stickyelements
require_once dirname( __FILE__ ).'/modules/stickyelements/sticky-interface.php';
add_action('wp_enqueue_scripts', 'load_sticky_anything');
function whsso_register_module_jscss_stickyelements() {
	wp_register_style('whssoPluginStickyHoverHintStyle', plugins_url('/modules/stickyelements/hoverhint.css', __FILE__));
	wp_enqueue_style('whssoPluginStickyHoverHintStyle');
}