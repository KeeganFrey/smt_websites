# Filter Element Template

This template provides a reusable filter element for web pages, allowing users to navigate to different parts of a page or wiki. It features expandable/collapsible categories and is designed to be easily customizable in terms of size and content.

## How to Use

1.  **Copy HTML:**
    *   Open the `../filter_element.html` file.
    *   Copy the entire HTML block starting from `<div class="filter-container">` and ending with its closing `</div>`.
    *   Paste this snippet into the desired location in your target webpage's HTML.

2.  **Copy CSS:**
    *   In `../filter_element.html`, find the `<style>` block within the `<head>` section.
    *   Copy the entire content of this `<style>` block.
    *   You can either:
        *   Paste it into an existing CSS file linked to your webpage.
        *   Enclose it in `<style>` tags and place it in the `<head>` of your target HTML page.
    *   The CSS includes detailed comments on customization options.

3.  **Copy JavaScript (for Expand/Collapse):**
    *   In `../filter_element.html`, find the `<script>` block located just before the closing `</body>` tag.
    *   Copy this entire `<script>` block.
    *   Paste it just before the closing `</body>` tag in your target HTML page, or include it in your site's JavaScript bundle ensuring it runs after the DOM is loaded.

## Features

*   **Configurable Size:** The width and maximum height of the filter element can be easily adjusted via CSS (`.filter-container`). It can be set to a fixed size, a percentage of its parent, or fit within another element.
*   **Scrollable Content:** If the number of filter options exceeds the configured `max-height`, the element becomes scrollable.
*   **Expandable/Collapsible Categories:** Filter categories can be expanded or collapsed by clicking on their titles, showing or hiding the respective filter options.
*   **Easy Content Configuration:** Add new categories or filter options by modifying the HTML structure. Each filter option is a simple hyperlink (`<a>` tag) that can point to page sections (e.g., `#sectionId`).
*   **Visual Cues:** Arrows next to category titles indicate whether a section is expanded or collapsed.

## Customization

Detailed customization instructions for sizing, colors, appearance, and content modification are provided as comments within the `<style>` block of `../filter_element.html`.

Key CSS classes for customization include:
*   `.filter-container`: Overall size, background, border.
*   `.filter-title`: Styling for the main title of the filter block.
*   `.category-title`: Styling for individual category headers, including the arrow.
*   `.filter-options`: Styling for the list of links within a category.
*   `.filter-options li a`: Styling for individual filter links.

## Example Structure

The basic HTML structure for a filter category is as follows:

```html
<li class="filter-category">
    <h4 class="category-title">Your Category Name <span class="arrow"></span></h4>
    <ul class="filter-options">
        <li><a href="#section1">Option 1</a></li>
        <li><a href="#section2">Option 2</a></li>
        <!-- Add more options as needed -->
    </ul>
</li>
```

## Testing

A test page `test_filter_element.html` and an accompanying test script `test_filter_element.js` are provided within this directory. Open `test_filter_element.html` in a browser to see the filter element in action and to run automated tests for the expand/collapse functionality. Test results will be logged to the browser's console.
