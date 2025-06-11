# Footer Template

This directory contains an HTML template for a responsive site footer.

## `footer.html`

A self-contained HTML file including:
- HTML structure for a footer with sections for contact information, a sitemap, and a copyright notice.
- CSS styles for full-width display, flexible height, and responsiveness.
- JavaScript to dynamically update the copyright year.

### How to Use:

1.  **Copy HTML**: Open `footer.html` and copy the `<footer>...</footer>` section into your project's HTML file, typically just before the closing `</body>` tag.
2.  **Copy CSS**: Copy the CSS rules from the `<style>` block in `footer.html` into your project's main stylesheet or embed them in a `<style>` tag in your HTML's `<head>`.
3.  **Copy JavaScript (Optional)**: If you want the copyright year to update automatically, copy the JavaScript code from the `<script>` block at the end of `footer.html` and include it in your project (e.g., in a global JS file or in a `<script>` tag before the closing `</body>`).
4.  **Customize**:
    *   Update placeholder text (contact details, sitemap links, company name) directly in the HTML.
    *   Modify CSS variables or rules to match your site's design (colors, fonts, spacing). Refer to the documentation within the CSS block in `footer.html` for guidance on customization.

### Features:

*   **Responsive Design**: Adapts to different screen sizes, stacking content vertically on smaller screens.
*   **Full-width**: Designed to span the entire width of the viewport.
*   **Flexible Height**: Height adjusts based on content, with an optional `min-height`.
*   **Dynamic Year**: Copyright year automatically updates.
*   **Easy to Integrate**: Copy-paste HTML, CSS, and JavaScript.
*   **Documented**: Comments within `footer.html` explain usage and customization.
