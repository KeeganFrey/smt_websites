# Website Feature Templates

This folder contains reusable HTML templates for common website features.

## How to Use

1. Browse the templates in this folder.
2. Open the HTML file for the template you want to use.
3. Copy the relevant HTML code snippet.
4. Paste the snippet into your target webpage's HTML.
5. Modify the template as needed (e.g., change placeholder content, adjust styles).

## Available Templates

- `pdf_viewer.html`: A template for embedding a PDF document into a webpage.
- `gallery/gallery.html`: A responsive image gallery template.
    - **Features:**
        - Vertical layout by default.
        - Configurable number of simultaneously visible items (e.g., 1 main, or 1 main + 2 faded, or 1 main + 4 faded). Controlled by `setVisibleItems(1|3|5)` JavaScript function and CSS classes (`.visible-1`, `.visible-3`, `.visible-5` on the container influence JS logic).
        - Configurable navigation indicator position (left, right, or bottom). Controlled by `setIndicatorPosition('left'|'right'|'bottom')` JavaScript function and CSS classes (`.indicators-left`, `.indicators-right` on the container).
        - Automatic item cycling with pause on hover.
        - Basic responsive design for different screen sizes.
    - **Styling:** `static/css/gallery.css`
    - **Logic:** `static/js/gallery.js`
    - **Tests:** Unit tests can be run using `static/tests/gallery_test_runner.html`. Example control buttons are included in `templates/gallery/gallery.html` for demonstration.
