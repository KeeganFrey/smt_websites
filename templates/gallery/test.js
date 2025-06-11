// --- Test Utility Functions ---
const resultsDiv = document.getElementById('test-results');

function logTestResult(testName, passed, message = '') {
    const resultP = document.createElement('p');
    resultP.textContent = `${testName}: ${passed ? 'PASS' : 'FAIL'} ${message ? '- ' + message : ''}`;
    resultP.className = `test-result ${passed ? 'pass' : 'fail'}`;
    resultsDiv.appendChild(resultP);
    if (!passed) {
        console.error(`${testName}: FAIL ${message ? '- ' + message : ''}`);
    }
}

function resetGalleryState(configOverrides = {}) {
    // Reset global state variables
    currentIndex = 0;
    stopCycle(); // Clear any running timers

    // Override default config for specific tests
    Object.assign(galleryConfig, {
        itemsToShow: 3, // Default
        indicatorPosition: 'below', // Default
        autoCycle: false, // Default for tests
        cycleSpeed: 100, // Default for tests
        itemsData: [ // Default dataset
            { id: 1, content: "Item 1" },
            { id: 2, content: "Item 2" },
            { id: 3, content: "Item 3" },
            { id: 4, content: "Item 4" },
            { id: 5, content: "Item 5" }
        ]
    }, configOverrides);

    // Re-initialize gallery (this also re-fetches DOM elements)
    initializeGallery();
}

// --- Test Cases ---

function testGalleryInitialization() {
    const testName = "Test Gallery Initialization";
    resetGalleryState(); // Ensures clean state and calls initializeGallery

    const items = galleryItemsList.querySelectorAll('li');
    const indicators = indicatorContainer.querySelectorAll('.indicator-circle');
    const activeItem = galleryItemsList.querySelector('li.active');
    const activeIndicator = indicatorContainer.querySelector('.indicator-circle.active');

    let pass = true;
    let messages = [];

    if (items.length !== galleryConfig.itemsData.length) {
        pass = false;
        messages.push(`Expected ${galleryConfig.itemsData.length} items, found ${items.length}`);
    }
    if (indicators.length !== galleryConfig.itemsData.length) {
        pass = false;
        messages.push(`Expected ${galleryConfig.itemsData.length} indicators, found ${indicators.length}`);
    }
    // Default currentIndex is 0
    if (!activeItem || parseInt(activeItem.dataset.index) !== 0) {
        pass = false;
        messages.push(`Active item not index 0. Found: ${activeItem ? activeItem.dataset.index : 'null'}`);
    }
    if (!activeIndicator || parseInt(activeIndicator.dataset.index) !== 0) {
        pass = false;
        messages.push(`Active indicator not index 0. Found: ${activeIndicator ? activeIndicator.dataset.index : 'null'}`);
    }
    logTestResult(testName, pass, messages.join('; '));
}

function testShowSpecificItem() {
    const testName = "Test Show Specific Item (via currentIndex and updateGalleryView)";
    resetGalleryState();

    currentIndex = 2; // Target item 3 (index 2)
    updateGalleryView();

    const activeItem = galleryItemsList.querySelector('li.active');
    const activeIndicator = indicatorContainer.querySelector('.indicator-circle.active');
    let pass = true;
    let messages = [];

    if (!activeItem || parseInt(activeItem.dataset.index) !== currentIndex) {
        pass = false;
        messages.push(`Active item not index ${currentIndex}. Found: ${activeItem ? activeItem.dataset.index : 'null'}`);
    }
    if (!activeIndicator || parseInt(activeIndicator.dataset.index) !== currentIndex) {
        pass = false;
        messages.push(`Active indicator not index ${currentIndex}. Found: ${activeIndicator ? activeIndicator.dataset.index : 'null'}`);
    }
    logTestResult(testName, pass, messages.join('; '));
}

function testIndicatorClick() {
    const testName = "Test Indicator Click";
    resetGalleryState();

    const targetIndex = 3;
    const indicatorToClick = indicatorContainer.querySelector(`.indicator-circle[data-index="${targetIndex}"]`);
    let pass = true;
    let messages = [];

    if (!indicatorToClick) {
        logTestResult(testName, false, `Indicator with index ${targetIndex} not found.`);
        return;
    }

    indicatorToClick.click(); // Simulate click

    const activeItem = galleryItemsList.querySelector('li.active');
    const activeIndicator = indicatorContainer.querySelector('.indicator-circle.active');

    if (!activeItem || parseInt(activeItem.dataset.index) !== targetIndex) {
        pass = false;
        messages.push(`Active item after click not index ${targetIndex}. Found: ${activeItem ? activeItem.dataset.index : 'null'}`);
    }
    if (currentIndex !== targetIndex) { // Check internal state variable
        pass = false;
        messages.push(`currentIndex variable not updated to ${targetIndex}. Found: ${currentIndex}`);
    }
    if (!activeIndicator || parseInt(activeIndicator.dataset.index) !== targetIndex) {
         pass = false;
        messages.push(`Active indicator after click not index ${targetIndex}. Found: ${activeIndicator ? activeIndicator.dataset.index : 'null'}`);
    }
    logTestResult(testName, pass, messages.join('; '));
}

function testAutomaticCycling(callback) {
    const testName = "Test Automatic Cycling and Loop";
    resetGalleryState({ autoCycle: true, cycleSpeed: 50 }); // Use faster speed, enable autoCycle

    let cyclesDone = 0;
    const totalItems = galleryConfig.itemsData.length;
    const expectedCycles = totalItems + 1; // Go through all items and one more to check loop

    // Temporarily override cycleNext to count cycles and check indices
    const originalCycleNext = window.cycleNext; // Assuming cycleNext is global
    window.cycleNext = function() {
        originalCycleNext(); // Call the real function to update view
        cyclesDone++;
        const expectedIndex = cyclesDone % totalItems;
        if (currentIndex !== expectedIndex) {
            logTestResult(testName, false, `Cycle ${cyclesDone}: currentIndex is ${currentIndex}, expected ${expectedIndex}`);
            stopCycle(); // Stop on error
            window.cycleNext = originalCycleNext; // Restore
            if(callback) callback();
            return;
        }

        if (cyclesDone === expectedCycles) {
            stopCycle();
            window.cycleNext = originalCycleNext; // Restore
            const finalActiveItem = galleryItemsList.querySelector('li.active');
            if (finalActiveItem && parseInt(finalActiveItem.dataset.index) === (expectedCycles % totalItems)) {
                logTestResult(testName, true, `Cycled ${expectedCycles} times and looped correctly.`);
            } else {
                logTestResult(testName, false, `Looping failed or active item mismatch at end. Index: ${finalActiveItem ? finalActiveItem.dataset.index : 'null'}, Expected: ${expectedCycles % totalItems}`);
            }
            if(callback) callback();
        }
    };
    startCycle(); // Manually start cycle for test
}

function testItemsToShowConfiguration() {
    const testName = "Test itemsToShow Configuration";
    let pass = true;
    let messages = [];

    // Test itemsToShow = 1
    resetGalleryState({ itemsToShow: 1 });
    let listItems = galleryItemsList.querySelectorAll('li');
    if (listItems.length > 0 && listItems[0].style.minWidth !== "100%") {
        pass = false;
        messages.push(`itemsToShow=1: Expected minWidth 100%, got ${listItems[0].style.minWidth}`);
    }
    // Check active/adjacent classes (only 'active' should be present in strict 1-item view)
    currentIndex = 0; updateGalleryView(); // Ensure view is updated
    if (galleryItemsList.querySelectorAll('li.adjacent').length > 0) {
         pass = false; messages.push("itemsToShow=1: 'adjacent' class should not be present.");
    }


    // Test itemsToShow = 3
    resetGalleryState({ itemsToShow: 3 });
    listItems = galleryItemsList.querySelectorAll('li');
    if (listItems.length > 0 && parseFloat(listItems[0].style.minWidth).toFixed(2) !== (100/3).toFixed(2) + "%") { // compare string "33.33%"
        pass = false;
        messages.push(`itemsToShow=3: Expected minWidth ${ (100/3).toFixed(2)}%, got ${listItems[0].style.minWidth}`);
    }
     currentIndex = 1; updateGalleryView(); // item at index 1 is active
    if (galleryItemsList.querySelectorAll('li.active').length !== 1 || !galleryItemsList.querySelector('li[data-index="1"].active')) {
        pass = false; messages.push("itemsToShow=3: Incorrect active item for index 1.");
    }
    if (galleryItemsList.querySelectorAll('li.adjacent').length !== 2) { // For 3 items, expect 2 adjacent if not at ends
         pass = false; messages.push("itemsToShow=3: Incorrect number of adjacent items for index 1.");
    }


    // Test itemsToShow = 5
    resetGalleryState({ itemsToShow: 5 });
    listItems = galleryItemsList.querySelectorAll('li');
    if (listItems.length > 0 && listItems[0].style.minWidth !== "20%") {
        pass = false;
        messages.push(`itemsToShow=5: Expected minWidth 20%, got ${listItems[0].style.minWidth}`);
    }
    currentIndex = 2; updateGalleryView(); // item at index 2 is active
    if (galleryItemsList.querySelectorAll('li.active').length !== 1 || !galleryItemsList.querySelector('li[data-index="2"].active')) {
        pass = false; messages.push("itemsToShow=5: Incorrect active item for index 2.");
    }
    if (galleryItemsList.querySelectorAll('li.adjacent').length !== 2) { // For 5 items, expect 2 adjacent
         pass = false; messages.push("itemsToShow=5: Incorrect number of adjacent items for index 2.");
    }

    logTestResult(testName, pass, messages.join('; '));
}

function testIndicatorPositionConfiguration() {
    const testName = "Test Indicator Position Configuration";
    let pass = true;
    let messages = [];

    // Test 'below' (default)
    resetGalleryState({ indicatorPosition: 'below' });
    let galleryChildren = Array.from(galleryWrapper.children);
    if (galleryChildren.indexOf(indicatorContainer) < galleryChildren.indexOf(galleryContainer)) {
        pass = false;
        messages.push("indicatorPosition='below': Indicator container is not after gallery container.");
    }

    // Test 'above'
    resetGalleryState({ indicatorPosition: 'above' });
    galleryChildren = Array.from(galleryWrapper.children);
    if (galleryChildren.indexOf(indicatorContainer) > galleryChildren.indexOf(galleryContainer)) {
        pass = false;
        messages.push("indicatorPosition='above': Indicator container is not before gallery container.");
    }
    logTestResult(testName, pass, messages.join('; '));
}


// --- Run Tests ---
document.addEventListener('DOMContentLoaded', () => {
    // Basic tests first
    testGalleryInitialization();
    testShowSpecificItem();
    testIndicatorClick();
    testItemsToShowConfiguration();
    testIndicatorPositionConfiguration();

    // Async tests / tests that rely on timing
    // Wrap async tests or tests with timeouts in a way they can be run sequentially if needed
    // For simplicity, just calling them. If using a test framework, it would handle this.
    testAutomaticCycling(() => {
        logTestResult("Async Tests", true, "Automatic cycling test completed (check results above). Further async tests could follow.");
        // Add more async tests here if needed, chaining callbacks or using Promises
    });
});
