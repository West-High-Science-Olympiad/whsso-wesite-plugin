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

global $wpdb;
$wpdb->query("CREATE TABLE IF NOT EXISTS `whssopluginhashmap` (`key` TEXT, `value` TEXT);");

$hbotstaterows = $wpdb->get_row( "SELECT * FROM `whssopluginhashmap` WHERE `key` = 'helpfulbotstate';", ARRAY_N);
if ($hbotstaterows == NULL) {
    $wpdb->query("INSERT INTO `whssopluginhashmap` VALUES ('helpfulbotstate', 'Stopped');");
    $initialhbotstate = "Stopped";
} else {
    $initialhbotstate = $hbotstaterows[1];
}

$hbotpidrows = $wpdb->get_row( "SELECT * FROM `whssopluginhashmap` WHERE `key` = 'helpfulbotpid';", ARRAY_N);
if ($hbotpidrows == NULL) {
    $wpdb->query("INSERT INTO `whssopluginhashmap` VALUES ('helpfulbotpid', '-1');");
}

if(!function_exists('get_active_node_pids')) {
    function get_active_node_pids() {
        $nodeprocesslist = array();
        if (substr(strtoupper(PHP_OS), 0, 3) === "WIN") {
            $tasklist = `tasklist`;
            $arr = explode("node.exe", $tasklist);
            foreach ($arr as $line) {
                $words = explode(" ", $line);
                $word0 = NULL;
                for ($i = 0; $i < count($words); $i++) {
                    if (strlen($words[$i]) > 0) {
                        $word0 = $words[$i];
                        break;
                    }
                }
                if (is_numeric($word0)) {
                    $nodeprocesslist[$i] = $word0;
                    $i++;
                }
            }
        } else {
            $tasklist = `ps -C node`;
            $arr = explode("\n", $tasklist);
            $i = 0;
            foreach ($arr as $line) {
                $words = explode(" ", $line);
                $word0 = NULL;
                for ($i = 0; $i < count($words); $i++) {
                    if (strlen($words[$i]) > 0) {
                        $word0 = $words[$i];
                        break;
                    }
                }
                if (is_numeric($word0)) {
                    $nodeprocesslist[$i] = $word0;
                    $i++;
                }
            }
        }
        return $nodeprocesslist;
    }
}

if (!function_exists('launch_helpful_bot')) {
    function launch_helpful_bot() {
        global $wpdb;
        global $CUSTOM_SO_PLUGIN_SECRETS;
        set_time_limit(0);
        $hbotstate = $wpdb->get_row( "SELECT * FROM `whssopluginhashmap` WHERE `key` = 'helpfulbotstate';", ARRAY_N)[1];
        if ($hbotstate === 'Stopped') {
            $hbotstate = 'Launching...';
            $wpdb->query("UPDATE whssopluginhashmap SET `value` = 'Launching...' WHERE `key` = 'helpfulbotstate';");
            $initdir = getcwd();
            chdir("../wp-content/plugins/custom-so-plugin/modules/helpfulbot/");
            `npm ci express`;
            `npm ci body-parser`;
            `npm ci http`;
            `npm ci node-fetch`;
            `npm ci fs`;
            `npm ci sqlite3`; 
            `npm ci discord.js`;
            `npm ci moment`;
            `npm ci moment-timezone`;
            $descriptorspec = [
                0 => ['pipe', 'r'],
                1 => ['pipe', 'w'],
                2 => ['pipe', 'w']
            ];
            $command = "node bot.js ".$CUSTOM_SO_PLUGIN_SECRETS["HELPFUL_BOT_TOKEN"];
            if (substr(strtoupper(PHP_OS), 0, 3) === "WIN") {
                $command = "start ". $command;
            } else {
                $command = $command . " $";
            }
            $prenodes = get_active_node_pids();
            $proc = proc_open($command, $descriptorspec, $pipes);
            $postnodes = get_active_node_pids();
            $pid = implode(",", array_diff($postnodes, $prenodes));
            $wpdb->query("UPDATE whssopluginhashmap SET `value` = '$pid' WHERE `key` = 'helpfulbotpid';");
            $hbotstate = 'Running';
            $wpdb->query("UPDATE whssopluginhashmap SET `value` = 'Running' WHERE `key` = 'helpfulbotstate';");
            chdir($initdir);
        } else {
            wp_die();
        }
    }
}

if (!function_exists('kill_helpful_bot')) {
    function kill_helpful_bot() {
        global $wpdb;
        $hbotstate = $wpdb->get_row( "SELECT * FROM `whssopluginhashmap` WHERE `key` = 'helpfulbotstate';", ARRAY_N)[1];
        if ($hbotstate === 'Running') {
            $hbotstate = 'Terminating...';
            $wpdb->query("UPDATE whssopluginhashmap SET `value` = 'Terminating...' WHERE `key` = 'helpfulbotstate';");
            $pid = $wpdb->get_row( "SELECT * FROM `whssopluginhashmap` WHERE `key` = 'helpfulbotpid';", ARRAY_N)[1];
            foreach (explode(",", $pid) as $number) {
                if (substr(strtoupper(PHP_OS), 0, 3) === "WIN") {
                    `taskkill /f /pid $number`;
                } else {
                    `kill -9 $number`;
                }
            }
            $hbotstate = 'Stopped';
            $wpdb->query("UPDATE whssopluginhashmap SET `value` = 'Stopped' WHERE `key` = 'helpfulbotstate';");
        } else {
            wp_die();
        }
    }
}

create_whsso_php_button(
    "launch",
    "<button class=\"whsso-hbot-on-button\" onclick=\"launchHelpfulBot()\"".($initialhbotstate !== "Stopped" ? " disabled" : "").">
        Launch HelpfulBot
    </button>",
    "launch_helpful_bot",
    "finishedLaunchingHelpfulBot"
);

create_whsso_php_button(
    "kill",
    "<button class=\"whsso-hbot-off-button\" onclick=\"killHelpfulBot()\"".($initialhbotstate !== "Running" ? " disabled" : "").">
        Kill HelpfulBot
    </button>",
    "kill_helpful_bot",
    "finishedKillingHelpfulBot"
);

if (!function_exists('helpful_bot_config_bot')) {
    function helpful_bot_config_page() {
        global $wpdb;
        global $initialhbotstate;
        ?>
<br>
<table style="border:0px solid black; border-collapse: collapse;">
  <tr>
  	<td>
        <table style="border-spacing: 4px;">
            <tr><td>
                <?php add_whsso_php_button('launch');?>
            </td></tr>
            <tr><td>
                <?php add_whsso_php_button('kill');?>
            </td></tr>
        </table>
  	</td>
    <td>
        &nbsp;&nbsp;&nbsp;
    </td>
    <td>
        <p style="font-size:30px; line-height:0">Status: <b id="hbot-status-text" style="color:<?php
            if ($initialhbotstate == "Stopped") {
                echo "#ff0000";
            }
            if ($initialhbotstate == "Running") {
                echo "#1fbf00";
            }
            ?>;"><?php
            echo $wpdb->get_row( "SELECT * FROM `whssopluginhashmap` WHERE `key` = 'helpfulbotstate';", ARRAY_N)[1];
        ?></b></p>
  	</td>
  </tr>
</table>
        <?php
    }
}
?>