<p>
    The sticky element module is based on the plugin "Sticky Menu (or Anything)!" 
    <a href="https://wordpress.org/support/plugin/sticky-menu-or-anything-on-scroll" target="_blank">(support forum)</a>. For each selected
    element, it creates a clone of the original when the page loads and then it copies all event listeners from the old element to the
    clone. The original element is hidden while the sticky element (which never changes position on the page) is visible. The module
    is hardcoded to operate as the inspiration plugin does in Legacy (v1.0) Dynamic mode, and incorporates a multi-element sticking
    feature that stacks elements and the major improvement that inspired the move to this module.
</p>
<p>
    Using dynamic mode guarantees that this plugin will copy a completely rendered version of the stick elements, but it precludes
    the application of aftereffects (by other plugins) to the sticky cloned element. If the module instead used the static mode
    it would hinder the responsiveness of the website and potentially miss out on pre-effects applied by other plugins. Although
    neither scenario is perfect, experimentation determined this to be the more successful sticky element algorithm to replicate.
</p>
<p>
    Notes on settings parameters:
    <ul>
        <li>
            The first box is where the sticky elements themselves are specified. First, the input string is split into substrings on
            each ampersand. Then, each substring is passed to jQuery, which provides a response element set. If and only if there is
            exactly one element in that set, the element will be made sticky.
        </li>
        <li>
            The second box specifies screen location of the sticky elements. The distance between the top of the web page and the first
            sticky element is a number of pixels equal to that submitted in the box. Each subsequent sticky element is attached with a
            zero gap to the prior sticky element.
        </li>
        <li>
            The third box specifies z-index, a CSS attribute. A larger number moves an element to a higher layer. So, if two elements both
            occupy a region of your screen, the element you see in that region will be the one with a larger z-index specified in its CSS.
            The number specified here is given to the first element, and each subsequent sticky element will be one layer behind (that is,
            it's z-value will be one lower) than its predecessor.
        </li>
    </ul>
</p>
<p>
    This module is the first frontend website modification module of the plugin. Created by Randall Scharpf, July 2020.
</p>