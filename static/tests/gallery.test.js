window.addEventListener('DOMContentLoaded', () => {
    const testResultsDiv = document.getElementById('test-results');
    const galleryContainer = document.getElementById('test-gallery-container');
    const galleryItemsContainer = galleryContainer.querySelector('.gallery-items');
    const indicatorsContainer = galleryContainer.querySelector('.navigation-indicators');
    let originalGalleryItemsHTML; // To reset items for each test

    let testsRun = 0;
    let testsPassed = 0;

    // --- Test Helper Functions ---
    function logTestResult(testName, condition, details = "") {
        testsRun++;
        const resultDiv = document.createElement('div');
        resultDiv.classList.add('test-case');
        const messageSpan = document.createElement('span');
        messageSpan.classList.add('message');

        if (condition) {
            testsPassed++;
            resultDiv.classList.add('pass');
            messageSpan.textContent = `PASS: ${testName}`;
        } else {
            resultDiv.classList.add('fail');
            messageSpan.textContent = `FAIL: ${testName}`;
        }
        resultDiv.appendChild(messageSpan);
        if (details) {
            const detailsDiv = document.createElement('div');
            detailsDiv.classList.add('details');
            detailsDiv.textContent = details;
            resultDiv.appendChild(detailsDiv);
        }
        testResultsDiv.appendChild(resultDiv);
    }

    function assertEquals(expected, actual, message) {
        const condition = expected === actual;
        logTestResult(message, condition, `Expected: ${expected}, Actual: ${actual}`);
        if (!condition) {
            console.error(`${message} - Expected: ${expected}, Actual: ${actual}`);
        }
    }

    function assertTruthy(actual, message) {
        const condition = !!actual;
        logTestResult(message, condition, `Expected: truthy, Actual: ${actual}`);
         if (!condition) {
            console.error(`${message} - Expected: truthy, Actual: ${actual}`);
        }
    }

    function assertClass(element, className, message) {
        const condition = element && element.classList.contains(className);
        logTestResult(message, condition, `Element ${element ? element.tagName : 'null'} should have class '${className}'. Has: ${element ? element.classList : 'N/A'}`);
        if (!condition) {
            console.error(`${message} - Element ${element ? element.tagName : 'null'} should have class '${className}'. Has: ${element ? element.classList : 'N/A'}`);
        }
    }

    function getActiveItem() {
        return galleryItemsContainer.querySelector('.gallery-item.active');
    }

    function getActiveIndicator() {
        return indicatorsContainer.querySelector('.indicator.active');
    }

    function getGalleryItems() {
        return galleryItemsContainer.querySelectorAll('.gallery-item');
    }

    function setupGallery(itemCount = 4, initialVisibleItems = 1, initialIndicatorPos = 'bottom') {
        // Reset DOM to a clean state for gallery items
        if (!originalGalleryItemsHTML) {
             originalGalleryItemsHTML = galleryItemsContainer.innerHTML;
        } else {
            galleryItemsContainer.innerHTML = originalGalleryItemsHTML;
        }
        // Adjust item count if necessary (basic implementation, could be more robust)
        const currentItems = galleryItemsContainer.querySelectorAll('.gallery-item');
        if (currentItems.length !== itemCount) {
            galleryItemsContainer.innerHTML = ''; // Clear
            for(let i=0; i<itemCount; i++) {
                const item = document.createElement('div');
                item.classList.add('gallery-item');
                item.innerHTML = `<img src="https://via.placeholder.com/100x50?text=Test${i+1}" alt="Test ${i+1}">`;
                galleryItemsContainer.appendChild(item);
            }
        }


        // Reset classes on container
        galleryContainer.className = 'gallery-container'; // Reset to base class
        if (initialVisibleItems === 3) galleryContainer.classList.add('visible-3');
        else if (initialVisibleItems === 5) galleryContainer.classList.add('visible-5');
        // else visible-1 is default by JS logic now

        // Re-query items as they might have been recreated
        // Note: gallery.js has its own `items` querySelectorAll. We need to ensure it re-runs.
        // A more robust way would be to destroy and re-instantiate gallery.js if it had such methods.
        // For now, we rely on refreshGallery or re-running its internal setup.

        // Call gallery's own refresh/init logic
        if (window.refreshGallery) {
            window.refreshGallery(); // This should re-initialize items, indicators, and apply settings
            window.setVisibleItems(initialVisibleItems); // Explicitly set visible items
            window.setIndicatorPosition(initialIndicatorPos); // Explicitly set indicator position
        } else {
            console.error("refreshGallery() function not found. Tests might not run correctly.");
            logTestResult("Setup Error", false, "refreshGallery() function not found.");
        }
        // Ensure gallery.js has finished its DOMContentLoaded setup
        // This is tricky if gallery.js also uses DOMContentLoaded.
        // For this test runner, gallery.js is loaded first, so its DOMContentLoaded should have fired.
    }


    // --- Test Suites ---

    function runInitializationTests() {
        setupGallery(4);
        const items = getGalleryItems();
        const indicators = indicatorsContainer.querySelectorAll('.indicator');
        assertEquals(items.length, indicators.length, "Initialization: Correct number of indicators created");
        assertTruthy(getActiveItem(), "Initialization: An item is active initially");
        if (items.length > 0) {
            assertClass(items[0], 'active', "Initialization: First item is active by default");
        }
        assertTruthy(getActiveIndicator(), "Initialization: An indicator is active initially");
        if (indicators.length > 0) {
            assertClass(indicators[0], 'active', "Initialization: First indicator is active by default");
        }
    }

    function runItemCyclingTests() {
        setupGallery(3); // Use 3 items for simpler cycling tests

        // nextItem()
        window.nextItem(); // 0 -> 1
        assertClass(getGalleryItems()[1], 'active', "nextItem(): Moves to the second item");
        assertClass(indicatorsContainer.querySelectorAll('.indicator')[1], 'active', "nextItem(): Second indicator is active");

        window.nextItem(); // 1 -> 2
        assertClass(getGalleryItems()[2], 'active', "nextItem(): Moves to the third item");
        assertClass(indicatorsContainer.querySelectorAll('.indicator')[2], 'active', "nextItem(): Third indicator is active");

        // Looping forward
        window.nextItem(); // 2 -> 0 (loop)
        assertClass(getGalleryItems()[0], 'active', "nextItem(): Loops to the first item from the last");
        assertClass(indicatorsContainer.querySelectorAll('.indicator')[0], 'active', "nextItem(): First indicator is active after loop");

        // prevItem()
        window.prevItem(); // 0 -> 2 (loop back)
        assertClass(getGalleryItems()[2], 'active', "prevItem(): Loops to the last item from the first");
        assertClass(indicatorsContainer.querySelectorAll('.indicator')[2], 'active', "prevItem(): Last indicator is active after loop back");

        window.prevItem(); // 2 -> 1
        assertClass(getGalleryItems()[1], 'active', "prevItem(): Moves to the second item (from last)");
        assertClass(indicatorsContainer.querySelectorAll('.indicator')[1], 'active', "prevItem(): Second indicator is active");
    }

    function runShowItemTests() {
        setupGallery(4);
        window.showItem(2); // Show 3rd item (index 2)
        assertClass(getGalleryItems()[2], 'active', "showItem(2): Directly navigates to the 3rd item");
        assertClass(indicatorsContainer.querySelectorAll('.indicator')[2], 'active', "showItem(2): 3rd indicator is active");

        window.showItem(0); // Show 1st item (index 0)
        assertClass(getGalleryItems()[0], 'active', "showItem(0): Directly navigates to the 1st item");
        assertClass(indicatorsContainer.querySelectorAll('.indicator')[0], 'active', "showItem(0): 1st indicator is active");
    }

    function runConfigurationTests() {
        setupGallery(5); // Use 5 items for visibility tests

        // Test setVisibleItems
        window.setVisibleItems(1);
        assertEquals(1, window.visibleItemsConfig, "setVisibleItems(1): Config variable updated"); // Assuming visibleItemsConfig is exposed or testable via effect
        assertClass(getGalleryItems()[0], 'active', "setVisibleItems(1): Item 0 is active");
        // Check that no 'prev-1' or 'next-1' classes are applied for visibleItems=1
        logTestResult("setVisibleItems(1): No prev-1 on item 4", !getGalleryItems()[4].classList.contains('prev-1'));
        logTestResult("setVisibleItems(1): No next-1 on item 1", !getGalleryItems()[1].classList.contains('next-1'));


        window.showItem(2); // Move to middle for easier prev/next checking
        window.setVisibleItems(3);
        assertEquals(3, window.visibleItemsConfig, "setVisibleItems(3): Config variable updated");
        assertClass(getGalleryItems()[2], 'active', "setVisibleItems(3): Item 2 (current) is active");
        assertClass(getGalleryItems()[1], 'prev-1', "setVisibleItems(3): Item 1 has class 'prev-1'");
        assertClass(getGalleryItems()[3], 'next-1', "setVisibleItems(3): Item 3 has class 'next-1'");
        logTestResult("setVisibleItems(3): Item 0 not 'prev-2'", !getGalleryItems()[0].classList.contains('prev-2') && !getGalleryItems()[0].classList.contains('prev-1'));
        logTestResult("setVisibleItems(3): Item 4 not 'next-2'", !getGalleryItems()[4].classList.contains('next-2') && !getGalleryItems()[4].classList.contains('next-1'));


        window.showItem(2); // Recenter
        window.setVisibleItems(5);
        assertEquals(5, window.visibleItemsConfig, "setVisibleItems(5): Config variable updated");
        assertClass(getGalleryItems()[2], 'active', "setVisibleItems(5): Item 2 (current) is active");
        assertClass(getGalleryItems()[1], 'prev-1', "setVisibleItems(5): Item 1 has class 'prev-1'");
        assertClass(getGalleryItems()[3], 'next-1', "setVisibleItems(5): Item 3 has class 'next-1'");
        assertClass(getGalleryItems()[0], 'prev-2', "setVisibleItems(5): Item 0 has class 'prev-2'");
        assertClass(getGalleryItems()[4], 'next-2', "setVisibleItems(5): Item 4 has class 'next-2'");

        // Test setIndicatorPosition
        window.setIndicatorPosition('left');
        assertClass(galleryContainer, 'indicators-left', "setIndicatorPosition('left'): Adds 'indicators-left' class to container");
        logTestResult("setIndicatorPosition('left'): Removes 'indicators-right'", !galleryContainer.classList.contains('indicators-right'));

        window.setIndicatorPosition('right');
        assertClass(galleryContainer, 'indicators-right', "setIndicatorPosition('right'): Adds 'indicators-right' class to container");
        logTestResult("setIndicatorPosition('right'): Removes 'indicators-left'", !galleryContainer.classList.contains('indicators-left'));

        window.setIndicatorPosition('bottom'); // 'bottom' is default (no class)
        logTestResult("setIndicatorPosition('bottom'): Removes 'indicators-left'", !galleryContainer.classList.contains('indicators-left'));
        logTestResult("setIndicatorPosition('bottom'): Removes 'indicators-right'", !galleryContainer.classList.contains('indicators-right'));

    }

    function finalizeResults() {
        const summaryDiv = testResultsDiv.querySelector('.test-results-summary');
        summaryDiv.textContent = `Tests Completed: ${testsRun}, Passed: ${testsPassed}, Failed: ${testsRun - testsPassed}`;
        if (testsRun - testsPassed > 0) {
            summaryDiv.style.color = 'red';
        } else {
            summaryDiv.style.color = 'green';
        }
    }

    // --- Run Tests ---
    // Clear initial "Running tests..." message or keep it as a header
    const oldSummary = testResultsDiv.querySelector('.test-results-summary');
    if (oldSummary) oldSummary.remove(); // Remove initial static message

    runInitializationTests();
    runItemCyclingTests();
    runShowItemTests();
    runConfigurationTests();

    finalizeResults();
});
