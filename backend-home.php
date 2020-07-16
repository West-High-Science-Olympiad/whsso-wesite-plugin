<!--
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
-->

<h1>WHSSO Custom Website Plugin</h1>
<p>
    This plugin is a set of modules used to make custom code edits to both the public website and the wordpress admin section.
    <br>
    In addition, it provides an endpoint for deployment of WHSSO projects and utilities that require web hosting.
</p>
<p>
    Our code is on GitHub! Go to <a href="https://github.com/West-High-Science-Olympiad/whsso-wesite-plugin">
        https://github.com/West-High-Science-Olympiad/whsso-wesite-plugin
    </a>
    to view our code.
</p>
<p>
    The plugin uses the GNU General Public License, version 3.
</p>
<h2>List of Modules</h2>
<p><b>Tabs</b><br>
    Tabs is a module designed initially for backend operation that creates a php function for extremely simple
    creation of a tabbed interface. It may be restyled universally using a small set of CSS classes. In addition
    to a simple and effective interface, the plugin saves the currently selected tab in the URL to sponsor generation
    of links to specific tabs and to improve the action of redirects.<br>
    The function exported by the tabs module takes three inputs. The first should be a unique identifier for the tab group that
    represents its name. The second is an array of title texts for the tab headers. The final input is an array of equal length
    containing the body of each tab. The first two inputs must contain raw string data. Elements of the body information data array
    may be either names of functions that return strings, names of functions that echo the tab body, or raw string data.<br>
    <i>Since version 1.0</i>
</p>
<p><b>Sticky Elements</b><br>
    Sticky Elements is a module that prevents elements on the frontend interface from disappering when the user
    scrolls down past it. Menus on the frontend are the primary target elements of this plugin. More info may be found
    in the plugin settings page, at <a href="<?php
        echo add_query_arg(
            array(
                'page' => 'whsso-plugin',
                "tab-Main" => "Sticky Element Settings",
                "tab-stickysettingspage" => "Information"
            ),
            admin_url('options-general.php')
        );
    ?>">this link</a>.<br>
    <i>Since version 1.0</i>
</p>
<p><b>PHP Button</b><br>
    PHP Button is a module exclusively for backend operation that calls a php function, instead of a javascript function as
    is typical, when a button is clicked. The plugin includes security wrapping (a unique nonce field for each button and a
    permissions check subsequent to form submission) to ensure that a button is actually pressed by a real user before
    running server-side php code. It makes button creation simple while still allowing versatility in button fashion and function.<br>
    The function exported by the module takes two inputs. The first is the html code to display the button itself (this must be a single
    &lt;button&gt;&lt;/button&gt; element). The second is the name of the php function that is to be called on the button click.
    A unique identifier for the button is created internally for the button form submission and ajax code, so the html button supplied
    should not specify the id attribute. The "manage_options" permissions are required to click a php button and cannot be changed
    by function parameter.<br>
    <i>Since version 2.0</i>
</p>