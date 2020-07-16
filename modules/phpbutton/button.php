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

$whsso_php_button_id = 0;
$whsso_php_buttons_saved_ids = array();
$whsso_php_buttons_saved_buttonhtmls = array();
$whsso_php_buttons_saved_callbacks = array();
$tmpname = "";

if (!function_exists("create_whsso_php_button")) {
    function create_whsso_php_button($name, $buttonhtml, $onclick, $callback = NULL) {
        global $whsso_php_button_id;
        global $whsso_php_buttons_saved_ids;
        global $whsso_php_buttons_saved_buttonhtmls;
        global $whsso_php_buttons_saved_callbacks;
        add_action('wp_ajax_php_button_id_'.$whsso_php_button_id.'_'.$name, function() use($onclick, $name) {
	        if (!current_user_can('manage_options')) {
                wp_die('Not allowed');
            }
            $nonce = $_POST['nonce'];
            if(!wp_verify_nonce($nonce, 'whsso_php_button_press_'.$name)) {
                wp_nonce_ays('whsso_php_button_press_'.$name);
            }
            if (function_exists($onclick)) {
                call_user_func($onclick);
            }
            wp_die();
        });
        $buttontokens = explode("button", $buttonhtml);
        if (!count($buttontokens)>1) {
            wp_die("Cannot generate a button without a valid HTML button (must contain <button></button>");
        }
        $buttoninputhtml = $buttontokens[0] . "button id=\"whsso-php-button-" . $whsso_php_button_id . "\"";
        for ($i = 1; $i < count($buttontokens); $i++) {
            $buttoninputhtml .= (($i == 1) ? "" : "button") . $buttontokens[$i];
        }
        $whsso_php_buttons_saved_buttonhtmls[$name] = $buttoninputhtml;
        $whsso_php_buttons_saved_ids[$name] = $whsso_php_button_id;
        $whsso_php_buttons_saved_callbacks[$name] = $callback;
        $whsso_php_button_id++;
    }
}

if (!function_exists("add_whsso_php_button")) {
    function add_whsso_php_button($name) {
        global $whsso_php_buttons_saved_ids;
        global $whsso_php_buttons_saved_buttonhtmls;
        global $whsso_php_buttons_saved_callbacks;
        echo $whsso_php_buttons_saved_buttonhtmls[$name];
        $callback = $whsso_php_buttons_saved_callbacks[$name];
        add_action('admin_footer', function() use($name, $callback) {
            global $whsso_php_buttons_saved_ids;
            $mybtnid = $whsso_php_buttons_saved_ids[$name];
            ?>
    	    <script type="text/javascript" >
    	    jQuery('#<?php echo "whsso-php-button-".$mybtnid; ?>').click(function($) {
        		var data = {
                    'action': 'php_button_id_<?php echo $whsso_php_buttons_saved_ids[$name].'_'.$name; ?>',
                    'nonce': '<?php echo wp_create_nonce('whsso_php_button_press_'.$name); ?>'
		        };
		        jQuery.post(ajaxurl, data, function(response) {
                    <?php
                    if ($callback != NULL) {
                        echo $callback . "(response);";
                    }// else {
                        ?>
                        if (response.length > 0) {
                            console.log("PHP button gave response:");
                            console.log(response);
                        }
                        <?php
                    //}
                    ?>
                });
    	    });
            </script> <?php
        });
    }
}
?>