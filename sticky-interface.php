<?php
/**
 * --- THE WHOLE ADMIN SETTINGS PAGE -------------------------------------------------------------------
 */
$sticky_anything_options = get_option('sticky_anything_options');
if (!function_exists('sticky_anything_config_page')) {
	function sticky_anything_config_page() {
	// Retrieve plugin configuration options from database
	global $sticky_anything_options;
	?>

	<div id="sticky-anything-settings-general" class="wrap">
		<h2>Sticky Menu (or Anything!) Settings</h2>
		<p>
			Pick any element on your page, and it will stick when it reaches the top of the page when you scroll down.
			Usually handy for navigation menus, but can be used for any (unique) element on your page.
			If multiple unique elements are specified, they will stack vertically
			(for example, a tabbed page can be made to have sticky tabs immediately below the sticky menu).
		</p>
		<div>
			<?php
				// DISPLAY UPDATE SUCCESS PANEL
				if (isset($_GET['message'])) {
					if ($_GET['message'] == '1') {
						echo '<div id="sticky-settings-updated" class="fade updated" style="width: 650px;"><p><strong>Settings Updated.</strong></p></div>';
					}
				}
				if (isset($_GET['message'])) {
					if ($sticky_anything_options['sa_element'] == '') {
						$warnings = true;
					}
				}
				whsso_tabs_create("stickysettingspage",
					array('Settings', 'Infomation'),
					array(
						"sticky_anything_settings_tab",
						'include assets/faq.php'
					)
				);
				// IF THERE ARE ERRORS, SHOW THEM
				$warnings = false;
				if ((!is_numeric($sticky_anything_options['sa_zindex'])) && ($sticky_anything_options['sa_zindex'] != '')) {
					// Z-index is not empty and has bad value
					$warnings = true;
				}
				if ($warnings == true ) {
					echo '<div id="sticky-settings-error" class="error"><p><strong>Please review the current settings:</strong></p>';
					echo '<ul style="list-style-type:disc; margin:0 0 20px 24px;">';
					if ($sticky_anything_options['sa_element'] == '') {
						echo '<li><b>Sticky Element</b> is a required field. If you do not want anything sticky, consider disabling the plugin.</li>';
					}
					if ((!is_numeric($sticky_anything_options['sa_zindex'])) && ($sticky_anything_options['sa_zindex'] != '')) {
						echo '<li><b>Z-Index</b> has to be a number (do not include any other characters).</li>';
					}
					echo '</ul></div>';
				}
			?>
		</div>
	</div>

	<?php
	}
}

if (!function_exists('sticky_anything_settings_tab')) {
	function sticky_anything_settings_tab() {
		global $sticky_anything_options;
		?>
	<form method="post" action="admin-post.php">
		<input type="hidden" name="action" value="save_sticky_anything_options"/>
		<!-- Adding security through hidden referrer field -->
		<?php wp_nonce_field( 'sticky_anything' ); ?>
		<table class="form-table">
			<tr>
				<td style="width:100px">
					<label for="sa_element"><b>Sticky Element:</b></label>
				</td>
				<td>
					(required)
				</td>
				<td>
					<span tooltip="The element(s) that need to be sticky once you scroll, separated by ampersands."><span class="dashicons dashicons-editor-help"></span></span>
				</td>
				<td>
					<input type="text" id="sa_element" name="sa_element" value="<?php
						if ($sticky_anything_options['sa_element'] != '#NO-ELEMENT') {
							echo esc_html($sticky_anything_options['sa_element'] );
						}
					?>"/>
				</td>
				<td>
					<em>Choose the unique elements to stick and separate them with <b>&</b> (e.g, <b>#main-navigation&.sub-nav-menu)</b></em>
				</td>
			</tr>
			<tr>
				<td>
					<label for="sa_topspace"><b>Top Gap:</b></label>
				</td>
				<td>
					(optional)
				</td>
				<td>
					<span tooltip="If you don't want the element to be sticky at the very top of the page, but a little lower, add the number of pixels that should be between your element and the 'ceiling' of the page."><span class="dashicons dashicons-editor-help"></span></span>
				</td>
				<td>
					<input type="number" id="sa_topspace" name="sa_topspace" value="<?php
						echo esc_html($sticky_anything_options['sa_topspace'] );
					?>" style="width:80px;"/> pixels
				</td>
				<td>
					<em>Gap between the topmost sticky element and the top of the webpage</em>
				</td>
			</tr>
			<tr>
				<td>
					<label for="sa_zindex"><b>Z-index:</b></label>
				</td>
				<td>
					(optional)
				</td>
				<td>
					<span tooltip="If there are other elements on the page that obscure/overlap the sticky element, adding a Z-index might help. Larger values bring the sticky elements to the front."><span class="dashicons dashicons-editor-help"></span></span>
				</td>
				<td>
					<input type="number" id="sa_zindex" name="sa_zindex" value="<?php
						echo esc_html($sticky_anything_options['sa_zindex'] );
					?>" style="width:80px;"/>
				</td>
				<td>
					<em>Layer index of the top sticky element.</em>
				</td>
			</tr>
		</table>
		<br><input type="submit" value="<?php _e('Save Changes','sticky-menu-or-anything-on-scroll'); ?>" class="button-primary"/>
	</form>
		<?php
	}
}

if (!function_exists('whsso_plugin_admin_init')) {
	function whsso_plugin_admin_init() {
		add_action('admin_post_save_sticky_anything_options', 'process_sticky_anything_options');
	}
}

/**
 * --- PROCESS THE SETTINGS FORM AFTER SUBMITTING ------------------------------------------------------
 */
if (!function_exists('process_sticky_anything_options')) {
	function process_sticky_anything_options() {

		if (!current_user_can( 'manage_options')) {
			wp_die( 'Not allowed');
		}

		check_admin_referer('sticky_anything');
		$options = get_option('sticky_anything_options');

		foreach ( array('sa_element') as $option_name ) {
			if ( isset( $_POST[$option_name] ) ) {
				$options[$option_name] = sanitize_text_field( $_POST[$option_name] );
			}
		}

		foreach ( array('sa_topspace') as $option_name ) {
			if ( isset( $_POST[$option_name] ) ) {
				$options[$option_name] = sanitize_text_field( $_POST[$option_name] );
			}
		}

		foreach ( array('sa_minscreenwidth') as $option_name ) {
			if ( isset( $_POST[$option_name] ) ) {
				$options[$option_name] = sanitize_text_field( $_POST[$option_name] );
			}
		}

		foreach ( array('sa_maxscreenwidth') as $option_name ) {
			if ( isset( $_POST[$option_name] ) ) {
				$options[$option_name] = sanitize_text_field( $_POST[$option_name] );
			}
		}

		foreach ( array('sa_zindex') as $option_name ) {
			if ( isset( $_POST[$option_name] ) ) {
				$options[$option_name] = sanitize_text_field( $_POST[$option_name] );
			}
		}

		foreach ( array('sa_pushup') as $option_name ) {
			if ( isset( $_POST[$option_name] ) ) {
				$options[$option_name] = sanitize_text_field( $_POST[$option_name] );
			}
		}

		foreach ( array('sa_adminbar') as $option_name ) {
			if ( isset( $_POST[$option_name] ) ) {
				$options[$option_name] = true;
			} else {
				$options[$option_name] = false;
			}
		}

		foreach ( array('sa_legacymode') as $option_name ) {
			if ( isset( $_POST[$option_name] ) ) {
				$options[$option_name] = true;
			} else {
				$options[$option_name] = false;
			}
		}

		foreach ( array('sa_dynamicmode') as $option_name ) {
			if ( isset( $_POST[$option_name] ) ) {
				$options[$option_name] = true;
			} else {
				$options[$option_name] = false;
			}
		}

		foreach ( array('sa_debugmode') as $option_name ) {
			if ( isset( $_POST[$option_name] ) ) {
				$options[$option_name] = true;
			} else {
				$options[$option_name] = false;
			}
		}

		update_option('sticky_anything_options', $options );
 		wp_redirect(add_query_arg(
				array(
					'page' => 'whsso-plugin',
					'message' => '1',
					"tab-Main" => "Sticky Element Settings",
					"tab-stickysettingspage" => "Settings"
				),
 				admin_url( 'options-general.php' )
 			)
 		);

		exit;
	}
}