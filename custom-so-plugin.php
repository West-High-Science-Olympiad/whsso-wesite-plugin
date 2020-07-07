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

/**
 * === FUNCTIONS ========================================================================================
 */

/**
 * --- LOAD MAIN .JS FILE AND CALL IT WITH PARAMETERS (BASED ON DATABASE VALUES) -----------------------
 */
if (!function_exists('load_sticky_anything')) {
    function load_sticky_anything() {
		$options = get_option('sticky_anything_options');
		$versionNum = $options['sa_version'];
		// Main jQuery plugin file
		if($options['sa_debugmode']==true){
	    	wp_register_script('stickyAnythingLib', plugins_url('/assets/js/jq-sticky-anything.js', __FILE__), array( 'jquery' ), $versionNum);
	    } else {
	    	wp_register_script('stickyAnythingLib', plugins_url('/assets/js/jq-sticky-anything.min.js', __FILE__), array( 'jquery' ), $versionNum);
	    }
	    wp_enqueue_script('stickyAnythingLib');
		// Set defaults for by-default-empty elements (because '' does not work with the JQ plugin)
		if (!$options['sa_topspace']) {
			$options['sa_topspace'] = '0';
		}
		if (!$options['sa_minscreenwidth']) {
			$options['sa_minscreenwidth'] = '0';
		}
		if (!$options['sa_maxscreenwidth']) {
			$options['sa_maxscreenwidth'] = '999999';
		}
		// If empty, set to 1 - not to 0. Also, if set to "0", keep it at 0.
		if (strlen($options['sa_zindex']) == "0") {		// LENGTH is 0 (not the actual value)
			$options['sa_zindex'] = '1';
		}
		$script_vars = array(
		      'element' => $options['sa_element'],
		      'topspace' => $options['sa_topspace'],
		      'minscreenwidth' => $options['sa_minscreenwidth'],
		      'maxscreenwidth' => $options['sa_maxscreenwidth'],
		      'zindex' => $options['sa_zindex'],
		      'legacymode' => $options['sa_legacymode'],
		      'dynamicmode' => $options['sa_dynamicmode'],
		      'debugmode' => $options['sa_debugmode'],
		      'pushup' => $options['sa_pushup'],
		      'adminbar' => $options['sa_adminbar']
		);
		wp_enqueue_script('stickThis', plugins_url('/assets/js/stickThis.js', __FILE__), array( 'jquery' ), $versionNum, true);
		wp_localize_script('stickThis', 'sticky_anything_engage', $script_vars );
    }
}


/**
 * --- ADD LINK TO SETTINGS PAGE TO SIDEBAR ------------------------------------------------------------
 */
if (!function_exists('whsso_plugin_add_to_plugin_list')) {
    function whsso_plugin_add_to_plugin_list() {
		add_options_page( 'WHSSO Website Plugin Configuration', 'WHS Scioly', 'manage_options', 'whsso-plugin', 'whsso_plugin_settings' );
    }
}


/**
 * --- ADD LINK TO SETTINGS PAGE TO PLUGIN ------------------------------------------------------------
 */
if (!function_exists('whsso_plugin_settings_link')) {
	function whsso_plugin_settings_link($links) {
		$settings_link = '<a href="options-general.php?page=whsso-plugin">Settings</a>';
		array_unshift($links, $settings_link);
		return $links;
	}
}

require_once dirname( __FILE__ ) .'/sticky-interface.php';

if (!function_exists('whsso_plugin_settings')) {
	function whsso_plugin_settings() {
?>

<?php
				if ( isset( $_GET['tab'] )) {
					$activeTab = $_GET['tab'];
				} else {
					$activeTab = 'home';
				}
        if ($activeTab != 'home' && $activeTab != 'sticky' && $activeTab != 'tab3') {
          $activeTab = 'home';
        }
			?>

			<h2 id="whsso-tab-button-wrapper" class="tab">
				<button class="nav-tab tablinks <?php if ($activeTab == 'home') { echo 'nav-tab-active'; } ?>" href="#home"><?php echo 'Home Page'; ?></button>
				<button class="nav-tab tablinks <?php if ($activeTab == 'sticky') { echo 'nav-tab-active2'; } ?>" href="#sticky"><?php echo 'Sticky Element Settings'; ?></button>
				<button class="nav-tab tablinks <?php if ($activeTab == 'tab3') { echo ' nav-tab-active2'; } ?>" href="#tab3"><?php echo 'Blank Page'; ?></button>
			</h2>

			<br><br>
<div class="tabs-content">
	<div class="tab-content tab-home <?php if ($activeTab != 'home') {echo 'hide';} ?>">
		
  <h3>Home Page</h3>
  <p>I'm supposed to like put info here or something right?</p>
	</div>
	<div class="tab-content tab-sticky <?php if ($activeTab != 'sticky') {echo 'hide';}?>">
		<?php
		echo sticky_anything_config_page();
	?>
	</div>
	<div class="tab-content tab-tab3 <?php if ($activeTab != 'tab3') {echo 'hide';}?>">
		<h3>Blank Page</h3>
  <p>This page intentionally left blank.</p>
	</div>
</div>
<!-- Tab content -->

	<?php
	}
}

if (!function_exists('createTabs')) {
	function createTabs($name, $tab_names, $tab_bodies) {
	}
}

if (!function_exists('generate_tab_test_content_tab2')){
	function generate_tab_test_content_tab2() {
		return "<div><b>Woah</b> <i>Neat</i>!</div>";
	}
}

$test_tab_names = [
	0 => 'tab1',
	1 => 'tab2',
	2 => 'tab3'
];
$test_tab_bodies = [
	0 => '<p>Hello World<p>',
	1 => generate_tab_test_content_tab2(),
	2 => '<i>Goodbye World</i>'
];

createTabs("test", $test_tab_names, $test_tab_bodies);

if (!function_exists('whsso_plugin_admin_init')) {
	function whsso_plugin_admin_init() {
	}
}

// STYLES AND SCRIPTS
if (!function_exists('whsso_plugin_styles')) {
	function whsso_plugin_styles($hook) {
		if ($hook != 'settings_page_whsso-plugin') {
			return;
		}
		wp_register_script('stickyAnythingAdminScript', plugins_url('/assets/js/sticky-anything-admin.js', __FILE__), array( 'jquery' ));
		wp_enqueue_script('stickyAnythingAdminScript');

		wp_register_style('stickyAnythingAdminStyle', plugins_url('/assets/css/sticky-anything-admin.css', __FILE__) );
	    wp_enqueue_style('stickyAnythingAdminStyle');
		
		wp_register_script('whssoPluginMainTabViewerScript', plugins_url('/assets/js/whsso-plugin-main-tab-viewer.js', __FILE__), array( 'jquery' ));
		wp_enqueue_script('whssoPluginMainTabViewerScript');
		
		wp_register_style('whssoPluginMainTabViewerStyle', plugins_url('/assets/css/whsso-plugin-main-tab-viewer.css', __FILE__));
		wp_enqueue_style('whssoPluginMainTabViewerStyle');
	}
}

/**
 * === HOOKS AND ACTIONS AND FILTERS AND SUCH ==========================================================
 */

$plugin = plugin_basename(__FILE__);

add_action('wp_enqueue_scripts', 'load_sticky_anything');
add_action('admin_menu', 'whsso_plugin_add_to_plugin_list');
add_action('admin_init', 'whsso_plugin_admin_init');
add_action('admin_enqueue_scripts', 'whsso_plugin_styles');
add_filter("plugin_action_links_$plugin", 'whsso_plugin_settings_link');

function debug_to_console($data) {
    $output = $data;
    if (is_array($output))
        $output = implode(',', $output);

    echo "<script>console.log('Debug Objects: " . $output . "' );</script>";
}