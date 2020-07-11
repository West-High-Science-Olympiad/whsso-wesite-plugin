<p>
    The sticky element module uses javascript to edit CSS attributes and prevent elements' disappearance on scroll. The plugin detects when
    the distance between the first sticky element and the top of the page is greater than the threshold Top Gap specified in the backend
    interface, and then applies the sticky style to the element. For each element after the first, the sticky style is applied when there
    is no longer a gap between it and the last sticky element. When an element is stuck, a blank placeholder div (which is out of view) is
    placed in the original element position to prevent the page from respacing its elements.
</p>
<p>
    Notes on settings parameters:
    <ul style="list-style: square outside; margin-left: 13px;">
        <li>
            The first box is where the sticky elements themselves are specified. First, the input string is split into substrings on
            each ampersand. Then, each substring is passed to jQuery, which provides a response element set. If and only if there is
            exactly one element in that set, the element will be made sticky. IMPORTANT: the elements must be listed in the order they
            appear on the page, from top to bottom, to guarantee results will be as expected.
        </li>
        <li>
            The second box specifies the screen location of the sticky elements. The distance between the top of the web page and the first
            sticky element is a number of pixels equal to that submitted in the box. Each subsequent sticky element is attached with a
            zero-size gap between it and the prior sticky element.
        </li>
        <li>
            The third box specifies z-index, a CSS attribute. A larger number moves an element to a higher layer. So, if two elements both
            occupy a region of your screen, the element you see in that region will be the one with a larger z-index specified in its CSS.
            The number specified here is given to the first element, and each subsequent sticky element will be one layer behind (that is,
            it's z-value will be one lower) than its predecessor.
        </li>
        <li>
            The last box determines when the sticky CSS update function is scheduled to run. There is a javascript function in the code
            that updates the CSS on the sticky elements to ensure their display is correct. If this number is set to zero, that function
            will be scheduled via a scroll listener. Otherwise, it will be registered with the getInterval function and the delay specified.
            In older browsers, scrolling is synchronous, and using the scroll listener is fine. But newer browsers use asynchronous
            scrolling that creates a lag between the CSS update and the actual scrolling, so to prevent jittering and make a buttery-smooth
            interface, the setInterval method is preferred. A smaller number for Rate gives a smoother display but forces more processing
            to occur and can create lag on less capable systems.
        </li>
    </ul>
</p>
<p>
    This module is the first frontend website modification module of the plugin. Created by Randall Scharpf, July 2020.
</p>