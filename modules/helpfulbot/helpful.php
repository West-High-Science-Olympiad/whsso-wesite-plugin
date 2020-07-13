<?php

global $wpdb;
$wpdb->query("CREATE TABLE IF NOT EXISTS `whssopluginhashmap` (`key` TEXT, `value` TEXT);");


$hbotstaterows = $wpdb->get_row( "SELECT * FROM `whssopluginhashmap` WHERE `key` = 'helpfulbotstate';", ARRAY_N);
if ($hbotstaterows == NULL) {
    $wpdb->query("INSERT INTO `whssopluginhashmap` VALUES ('helpfulbotstate', 'Stopped');");
}

if (!function_exists('launch_helpful_bot')) {
    function launch_helpful_bot() {
        global $wpdb;
        $hbotstate = $wpdb->get_row( "SELECT * FROM `whssopluginhashmap` WHERE `key` = 'helpfulbotstate';", ARRAY_N)[1];
        echo $hbotstate . "\n";
        if ($hbotstate === 'Stopped') {
            $hbotstate = 'Launching...';
            $wpdb->query("UPDATE whssopluginhashmap SET `value` = 'Launching...' WHERE `key` = 'helpfulbotstate';");
            // PERFORM THE LAUNCHING
            $hbotstate = 'Running';
            $wpdb->query("UPDATE whssopluginhashmap SET `value` = 'Running' WHERE `key` = 'helpfulbotstate';");
        } else {
            wp_die();
        }
        echo $hbotstate;
    }
}

if (!function_exists('kill_helpful_bot')) {
    function kill_helpful_bot() {
        global $wpdb;
        $hbotstate = $wpdb->get_row( "SELECT * FROM `whssopluginhashmap` WHERE `key` = 'helpfulbotstate';", ARRAY_N)[1];
        echo $hbotstate . "\n";
        if ($hbotstate === 'Running') {
            $hbotstate = 'Terminating...';
            $wpdb->query("UPDATE whssopluginhashmap SET `value` = 'Terminating...' WHERE `key` = 'helpfulbotstate';");
            // PERFORM THE TERMINATING
            $hbotstate = 'Stopped';
            $wpdb->query("UPDATE whssopluginhashmap SET `value` = 'Stopped' WHERE `key` = 'helpfulbotstate';");
        } else {
            wp_die();
        }
        echo $hbotstate;
    }
}

create_whsso_php_button(
    "launch",
    "<button class=\"whsso-hbot-onoff-button\" style=\"width: 150px; background: #7fff3f;\" onclick=\"launchHelpfulBot()\">
        Launch HelpfulBot
    </button>",
    "launch_helpful_bot",
    "finishedLaunchingHelpfulBot"
);

create_whsso_php_button(
    "kill",
    "<button class=\"whsso-hbot-onoff-button\" style=\"width: 150px; background: #ff7f7f;\" onclick=\"killHelpfulBot()\">
        Kill HelpfulBot
    </button>",
    "kill_helpful_bot",
    "finishedKillingHelpfulBot"
);

if (!function_exists('helpful_bot_config_bot')) {
    function helpful_bot_config_page() {
        global $wpdb;
        ?>
<table style="border:0px solid black; border-spacing: 20px; margin-top:-50px; margin-bottom:-50px;">
  <tr>
  	<td>
	    <?php add_whsso_php_button('launch');?><br>
	    <?php add_whsso_php_button('kill');?>
  	</td>
  	<td>
      <p style="font-size:36px;">Status: <b id="hbot-status-text" > <?php
        echo $wpdb->get_row( "SELECT * FROM `whssopluginhashmap` WHERE `key` = 'helpfulbotstate';", ARRAY_N)[1];
        ?></b></p>
  	</td>
  </tr>
</table>
        <?php
    }
}
?>