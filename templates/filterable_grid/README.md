# Filterable Grid Template

## Overview

This template provides a responsive, interactive grid of items that can be filtered by category. Users can click on filter buttons to display only the items belonging to a selected category or view all items.

The component is self-contained within `filterable_grid.html`, including HTML structure, CSS styling, and JavaScript logic.

## How to Use

1.  **Include HTML Structure:**
    *   Copy the relevant HTML sections from `filterable_grid.html` into your target web page.
    *   You will primarily need the `<div id="filter-buttons">...</div>` and `<div id="grid-container">...</div>` sections.
    *   Populate these sections with your desired filter buttons and grid items as described below.

2.  **CSS and JavaScript:**
    *   The necessary CSS styles are included within a `<style>` tag in the `<head>` section of `filterable_grid.html`.
    *   The JavaScript logic is included within a `<script>` tag at the end of the `<body>` section of `filterable_grid.html`.
    *   For integration into larger projects, you might consider extracting the CSS into a separate `.css` file and the JavaScript into a separate `.js` file and linking them in your main HTML document.

## HTML Structure Requirements

### Filter Buttons

Filter buttons should be placed within a container element, typically a `div` with the ID `filter-buttons`.

*   **Container:**
    ```html
    <div id="filter-buttons">
        <!-- Filter buttons go here -->
    </div>
    ```

*   **Individual Filter Button:**
    Each button requires the class `filter-button` and a `data-filter` attribute. The value of `data-filter` specifies the category it filters by.
    ```html
    <button class="filter-button" data-filter="categoryName">Category Name</button>
    ```

*   **"All" Button:**
    A special button to show all items should have `data-filter="all"`. It's recommended to make this button active by default by adding the `active` class.
    ```html
    <button class="filter-button active" data-filter="all">All</button>
    ```

### Grid Container

Grid items should be placed within a container element, typically a `div` with the ID `grid-container`.

*   **Container:**
    ```html
    <div id="grid-container">
        <!-- Grid items go here -->
    </div>
    ```

### Grid Items

Each item in the grid must have the class `grid-item` and a `data-category` attribute. The value of `data-category` must correspond to a `data-filter` value on one of your filter buttons.

*   **Structure for a Grid Item:**
    ```html
    <div class="grid-item" data-category="categoryName">
        <img src="path/to/image.jpg" alt="Description" style="max-width: 100%;"> <!-- Optional image -->
        <h3><a href="#">Item Title</a></h3>
        <p>Short description of the item.</p>
    </div>
    ```
*   **Key Attributes:**
    *   `class="grid-item"`: Essential for styling and JavaScript targeting.
    *   `data-category="categoryName"`: Links the item to a filter button.
*   **Image:** The `<img>` tag is optional. If included, ensure responsive styling (e.g., `max-width: 100%; height: auto;`). The provided CSS in `filterable_grid.html` already handles this for images within `.grid-item`.

## Customization

*   **Appearance (CSS):**
    The visual style of the filter buttons, grid layout, and item presentation can be customized by modifying the CSS rules within the `<style>` block in `filterable_grid.html` or by overriding them in your own stylesheets.
*   **Content (HTML):**
    Filter categories (buttons) and the actual grid items are defined directly in your HTML structure. You can add, remove, or modify these elements as needed.

## JavaScript Functionality

The JavaScript included in `filterable_grid.html` handles the filtering logic:
*   It listens for clicks on elements with the `filter-button` class.
*   When a button is clicked, it reads the `data-filter` value.
*   It then iterates through all elements with the `grid-item` class.
*   Items are shown or hidden based on whether their `data-category` attribute matches the selected `data-filter`.
*   If `data-filter="all"` is selected, all grid items are shown.
*   The script manages an `active` class on the currently selected filter button and applies a `hidden` class (which sets `display: none;`) to items that do not match the filter.

## Example

Here's a concise example demonstrating the structure:

```html
<!-- Filter Buttons -->
<div id="filter-buttons">
    <button class="filter-button active" data-filter="all">All</button>
    <button class="filter-button" data-filter="fruit">Fruits</button>
    <button class="filter-button" data-filter="vegetable">Vegetables</button>
</div>

<!-- Grid Container -->
<div id="grid-container">
    <div class="grid-item" data-category="fruit">
        <img src="apple.jpg" alt="Apple" style="max-width: 100%;">
        <h3><a href="#">Apple</a></h3>
        <p>A crisp red apple.</p>
    </div>
    <div class="grid-item" data-category="vegetable">
        <!-- No image for this item -->
        <h3><a href="#">Carrot</a></h3>
        <p>A crunchy orange carrot.</p>
    </div>
    <div class="grid-item" data-category="fruit">
        <h3><a href="#">Banana</a></h3>
        <p>A ripe yellow banana.</p>
    </div>
</div>

<!--
Note: This example assumes that the CSS styles from the <style> block
and the JavaScript from the <script> block in filterable_grid.html
are included on the page where this HTML is used.
-->
```

For testing the JavaScript logic independently, see `filterable_grid.test.js`.
