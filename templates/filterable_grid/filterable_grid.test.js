// --- Core Logic (copied/adapted from filterable_grid.html) ---
function filterItems(selectedCategory, gridItemsContainerId) {
    const gridContainer = document.getElementById(gridItemsContainerId);
    if (!gridContainer) {
        console.error(`Grid container with id '${gridItemsContainerId}' not found.`);
        return;
    }
    // In the actual implementation, allGridItemsElements is derived more dynamically.
    // For testing, direct children are usually sufficient.
    const items = gridContainer.children;
    for (let item of items) {
        if (!item.classList.contains('grid-item')) continue; // Ensure we only process items

        const itemCategory = item.dataset.category;
        if (selectedCategory === 'all' || itemCategory === selectedCategory) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    }
}

function setActiveButton(activeFilterValue, buttonsContainerId) {
    const buttonsContainer = document.getElementById(buttonsContainerId);
    if (!buttonsContainer) {
        console.error(`Buttons container with id '${buttonsContainerId}' not found.`);
        return;
    }
    const buttons = buttonsContainer.children;
    for (let button of buttons) {
        if (!button.classList.contains('filter-button')) continue; // Ensure we only process buttons

        if (button.dataset.filter === activeFilterValue) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    }
}

// --- Test Utilities ---
function setupTestDOM(categories, itemsConfig, defaultActiveFilter = 'all') {
    // Clear previous DOM from body
    document.body.innerHTML = '';
    // Clear previous styles from head if any test-specific ones were added
    const oldTestStyles = document.getElementById('test-styles');
    if (oldTestStyles) {
        oldTestStyles.remove();
    }

    // Add hidden style
    const style = document.createElement('style');
    style.id = 'test-styles'; // To identify and remove later
    style.textContent = `
        .hidden { display: none !important; }
        .active { font-weight: bold; border: 2px solid blue; } /* Visual cue for active */
        .filter-button { margin: 2px; padding: 5px; border: 1px solid #ccc; }
        .grid-item { border: 1px solid #eee; margin: 2px; padding: 5px; }
    `;
    document.head.appendChild(style);

    const filterButtonsDiv = document.createElement('div');
    filterButtonsDiv.id = 'test-filter-buttons';
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'filter-button';
        btn.dataset.filter = cat;
        btn.textContent = cat.toUpperCase();
        if (cat === defaultActiveFilter) { // Set default active based on argument
            btn.classList.add('active');
        }
        filterButtonsDiv.appendChild(btn);
    });
    document.body.appendChild(filterButtonsDiv);

    const gridContainerDiv = document.createElement('div');
    gridContainerDiv.id = 'test-grid-container';
    itemsConfig.forEach(itemConf => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'grid-item'; // Make sure items have the class
        itemDiv.dataset.category = itemConf.category;
        itemDiv.id = itemConf.id;
        itemDiv.textContent = `${itemConf.id} (Category: ${itemConf.category})`;
        gridContainerDiv.appendChild(itemDiv);
    });
    document.body.appendChild(gridContainerDiv);
}

function assertVisibility(itemId, expectedVisible, message) {
    const item = document.getElementById(itemId);
    if (!item) {
        console.error(`Assertion Failed: ${message}. Item ${itemId} not found.`);
        return;
    }
    const isHidden = item.classList.contains('hidden');
    const actualVisible = !isHidden;
    if (actualVisible === expectedVisible) {
        console.log(`Assertion Passed: ${message}`);
    } else {
        console.error(`Assertion Failed: ${message}. Item '${itemId}' visibility was ${actualVisible}, expected ${expectedVisible}`);
    }
}

function assertActiveClass(buttonFilterValue, expectedActive, message) {
    const buttonsContainer = document.getElementById('test-filter-buttons');
    if (!buttonsContainer) {
        console.error(`Assertion Failed: ${message}. Buttons container 'test-filter-buttons' not found.`);
        return;
    }
    const button = buttonsContainer.querySelector(`button[data-filter="${buttonFilterValue}"]`);
    if (!button) {
        console.error(`Assertion Failed: ${message}. Button with data-filter '${buttonFilterValue}' not found.`);
        return;
    }
    const hasActive = button.classList.contains('active');
    if (hasActive === expectedActive) {
        console.log(`Assertion Passed: ${message}`);
    } else {
        console.error(`Assertion Failed: ${message}. Button '${buttonFilterValue}' active state was ${hasActive}, expected ${expectedActive}`);
    }
}

// --- Test Cases ---
const defaultCategories = ['all', 'cat1', 'cat2', 'cat3'];
const defaultItems = [
    {id: 'itemA', category: 'cat1'},
    {id: 'itemB', category: 'cat2'},
    {id: 'itemC', category: 'cat1'},
    {id: 'itemD', category: 'cat3'}
];

function testInitialLoadShowsAll() {
    console.log('\n--- testInitialLoadShowsAll ---');
    setupTestDOM(defaultCategories, defaultItems, 'all'); // 'all' button active by default

    filterItems('all', 'test-grid-container'); // JS should ensure 'all' shows all
    // setActiveButton already called by setupTestDOM for 'all'

    assertVisibility('itemA', true, 'Item A (cat1) should be visible');
    assertVisibility('itemB', true, 'Item B (cat2) should be visible');
    assertVisibility('itemC', true, 'Item C (cat1) should be visible');
    assertVisibility('itemD', true, 'Item D (cat3) should be visible');
    assertActiveClass('all', true, '"all" button should be active');
}

function testFilterCategory1() {
    console.log('\n--- testFilterCategory1 ---');
    setupTestDOM(defaultCategories, defaultItems, 'all'); // Start with 'all' active

    filterItems('cat1', 'test-grid-container');
    setActiveButton('cat1', 'test-filter-buttons');

    assertVisibility('itemA', true, 'Item A (cat1) should be visible');
    assertVisibility('itemB', false, 'Item B (cat2) should be hidden');
    assertVisibility('itemC', true, 'Item C (cat1) should be visible');
    assertVisibility('itemD', false, 'Item D (cat3) should be hidden');
    assertActiveClass('cat1', true, '"cat1" button should be active');
    assertActiveClass('all', false, '"all" button should NOT be active');
}

function testFilterCategory2() {
    console.log('\n--- testFilterCategory2 ---');
    setupTestDOM(defaultCategories, defaultItems, 'all');

    filterItems('cat2', 'test-grid-container');
    setActiveButton('cat2', 'test-filter-buttons');

    assertVisibility('itemA', false, 'Item A (cat1) should be hidden');
    assertVisibility('itemB', true, 'Item B (cat2) should be visible');
    assertVisibility('itemC', false, 'Item C (cat1) should be hidden');
    assertVisibility('itemD', false, 'Item D (cat3) should be hidden');
    assertActiveClass('cat2', true, '"cat2" button should be active');
}

function testSwitchingFilters() {
    console.log('\n--- testSwitchingFilters ---');
    setupTestDOM(defaultCategories, defaultItems, 'all');

    // 1. Filter by cat1
    filterItems('cat1', 'test-grid-container');
    setActiveButton('cat1', 'test-filter-buttons');
    console.log('After filtering by cat1:');
    assertVisibility('itemA', true, 'Item A (cat1) visible after cat1 filter');
    assertVisibility('itemB', false, 'Item B (cat2) hidden after cat1 filter');
    assertActiveClass('cat1', true, '"cat1" button active after cat1 filter');
    assertActiveClass('all', false, '"all" button inactive after cat1 filter');

    // 2. Then filter by cat3
    filterItems('cat3', 'test-grid-container');
    setActiveButton('cat3', 'test-filter-buttons');
    console.log('After switching to cat3:');
    assertVisibility('itemA', false, 'Item A (cat1) hidden after cat3 filter');
    assertVisibility('itemB', false, 'Item B (cat2) hidden after cat3 filter');
    assertVisibility('itemD', true, 'Item D (cat3) visible after cat3 filter');
    assertActiveClass('cat3', true, '"cat3" button active after cat3 filter');
    assertActiveClass('cat1', false, '"cat1" button inactive after cat3 filter');
}

function testFilterNoItemsMatch() {
    console.log('\n--- testFilterNoItemsMatch ---');
    setupTestDOM(['all', 'cat1', 'cat-nomatch'], [{id: 'itemX', category: 'cat1'}]);

    filterItems('cat-nomatch', 'test-grid-container');
    setActiveButton('cat-nomatch', 'test-filter-buttons');

    assertVisibility('itemX', false, 'Item X (cat1) should be hidden when "cat-nomatch" is selected');
    assertActiveClass('cat-nomatch', true, '"cat-nomatch" button should be active');
}


// --- Test Runner ---
function runAllTests() {
    console.log('Starting JavaScript tests for filterable_grid...');
    testInitialLoadShowsAll();
    testFilterCategory1();
    testFilterCategory2();
    testSwitchingFilters();
    testFilterNoItemsMatch();
    console.log('\nAll tests finished. Check console for PASS/FAIL details.');
}

// This allows the tests to be run by loading this file in a browser's developer console
// or by a test runner that executes this script.
// For example, in a browser, you could open an HTML file that includes this script,
// and then open the developer console and type `runAllTests();`.
// For now, we'll call it directly so if this script is executed, tests run.
runAllTests();
