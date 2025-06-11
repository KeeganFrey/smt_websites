# Simple JavaScript Image/Content Gallery

## Description

This template provides a responsive and configurable JavaScript-powered gallery for displaying images or other HTML content. It features horizontal scrolling, customizable display options, and automatic cycling.

## Features

- **Horizontal Scrolling:** Items are displayed in a horizontal row.
- **Configurable Item Display:** Show 1, 3, or 5 items prominently at a time.
    - Central item(s) are highlighted ('active').
    - Adjacent items can be styled differently (e.g., faded/scaled).
- **Navigation Indicators:** Circular indicators allow direct navigation to specific items.
    - Position of indicators can be configured ('above' or 'below' the gallery).
- **Automatic Cycling:** Gallery can automatically cycle through items at a configurable speed.
    - Cycling pauses on manual interaction (e.g., indicator click) and can be configured to restart.
- **Customizable Content:** Easily define gallery items using a JavaScript array (`itemsData`). Items can contain simple text or more complex HTML.
- **Basic Styling Included:** Comes with CSS for layout, transitions, and appearance.
- **Testable:** Includes a `test_runner.html` to verify functionality.

## How to Use

### 1. HTML Structure

Include the following basic HTML structure in your page. The gallery JavaScript will populate the `.gallery-items` and `.indicator-container` based on your configuration.

```html
<div id="gallery-wrapper">
    <div class="gallery-container">
        <ul class="gallery-items">
            <!-- Gallery items will be dynamically populated here -->
        </ul>
    </div>
    <div class="indicator-container">
        <!-- Indicator circles will be dynamically populated here -->
    </div>
</div>

<!-- Include the gallery script -->
<!-- Option 1: If script is in index.html -->
<!-- <script> ... gallery JavaScript code ... </script> -->

<!-- Option 2: If you extract it to a separate file e.g., gallery.js -->
<!-- <script src="gallery.js"></script> -->
```

### 2. JavaScript Configuration

The gallery is configured using a JavaScript object named `galleryConfig`. You should define this object *before* the main gallery script logic runs or ensure the gallery script can access it.

**Key Configuration Options:**

-   `itemsToShow` (Number): How many items are prominently displayed at once. Recommended: `1`, `3`, or `5`.
    -   Example: `itemsToShow: 3`
-   `indicatorPosition` (String): Position of the navigation indicators.
    -   Options: `'above'`, `'below'`.
    -   Example: `indicatorPosition: 'below'`
-   `cycleSpeed` (Number): Speed of automatic cycling in milliseconds.
    -   Example: `cycleSpeed: 3000` (for 3 seconds)
-   `autoCycle` (Boolean): Enable or disable automatic cycling.
    -   Options: `true` (enable), `false` (disable).
    -   Example: `autoCycle: true`
-   `itemsData` (Array of Objects): The content for your gallery. Each object in the array represents an item.
    -   Each object should have at least an `id` and `content` property. The `content` can be simple text or HTML.
    -   Example:
        ```javascript
        itemsData: [
            { id: 1, content: "<h3>Item 1</h3><p>Description for item 1.</p>" },
            { id: 2, content: "<img src='path/to/image2.jpg' alt='Image 2'>" },
            { id: 3, content: "Item 3" }
        ]
        ```

### JavaScript Configuration Example:

Place this script tag before your main gallery script or at the beginning of the gallery script itself if it's embedded.

```javascript
<script>
    const galleryConfig = {
        itemsToShow: 3,
        indicatorPosition: 'below',
        cycleSpeed: 3500,
        autoCycle: true,
        itemsData: [
            { id: 'a', content: "Slide 1 Content" },
            { id: 'b', content: "Slide 2 Content with an <img src='#' alt='placeholder'>" },
            { id: 'c', content: "Slide 3 Content" },
            { id: 'd', content: "Slide 4 Content" },
            { id: 'e', content: "Slide 5 Content" }
        ]
    };

    // If the gallery script is separate and initializes on DOMContentLoaded,
    // ensure `galleryConfig` is defined in the global scope before it runs.
    // If the script is embedded in index.html like in the provided example,
    // define galleryConfig before the rest of the gallery's IIFE or main logic.
</script>

<!-- Then include the main gallery script if it's external -->
<!-- <script src="path/to/your/gallery-script.js"></script> -->
```
If you are using the provided `index.html`, the `galleryConfig` object is already defined at the top of the main script block. You can modify it there directly.

## Running Tests

The gallery comes with a testing utility to help ensure its core functionalities are working as expected.

1.  Navigate to the `templates/gallery/` directory.
2.  Open the `test_runner.html` file in a web browser.
3.  The page will display a list of tests and their results (PASS/FAIL).
4.  Check the browser's JavaScript console for more detailed error messages if any tests fail.

This is a simple way to perform integration checks on the gallery's behavior in a browser environment.
