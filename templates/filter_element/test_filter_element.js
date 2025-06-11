// Test script for filter_element.html

document.addEventListener('DOMContentLoaded', function() {
    console.log("Filter Element Tests Started");

    const results = {
        total: 0,
        passed: 0,
        failed: 0,
        details: []
    };

    function runTest(description, testFn) {
        results.total++;
        try {
            testFn();
            results.passed++;
            results.details.push({ description, status: "PASSED" });
            console.log(`PASSED: ${description}`);
        } catch (e) {
            results.failed++;
            results.details.push({ description, status: "FAILED", error: e.message });
            console.error(`FAILED: ${description}`, e);
        }
    }

    // --- Test Cases ---

    const fruitCategoryTitle = document.querySelector('#myFilterElement .filter-category:nth-child(1) .category-title');
    const fruitOptionsList = document.querySelector('#myFilterElement .filter-category:nth-child(1) .filter-options');

    const vegetableCategoryTitle = document.querySelector('#myFilterElement .filter-category:nth-child(2) .category-title');
    const vegetableOptionsList = document.querySelector('#myFilterElement .filter-category:nth-child(2) .filter-options');

    runTest("Initial state: Fruit options should be hidden", () => {
        if (!fruitOptionsList) throw new Error("Fruit options list not found");
        if (fruitOptionsList.classList.contains('visible')) {
            throw new Error("Fruit options are visible by default.");
        }
        if (fruitCategoryTitle.classList.contains('expanded')) {
            throw new Error("Fruit category title has 'expanded' class by default.");
        }
    });

    runTest("Clicking Fruit category title should show options and add 'expanded' class", () => {
        if (!fruitCategoryTitle) throw new Error("Fruit category title not found");
        fruitCategoryTitle.click();
        if (!fruitOptionsList.classList.contains('visible')) {
            throw new Error("Fruit options did not become visible after click.");
        }
        if (!fruitCategoryTitle.classList.contains('expanded')) {
            throw new Error("Fruit category title did not get 'expanded' class after click.");
        }
    });

    runTest("Clicking Fruit category title again should hide options and remove 'expanded' class", () => {
        fruitCategoryTitle.click(); // Second click
        if (fruitOptionsList.classList.contains('visible')) {
            throw new Error("Fruit options did not hide after second click.");
        }
        if (fruitCategoryTitle.classList.contains('expanded')) {
            throw new Error("Fruit category title did not remove 'expanded' class after second click.");
        }
    });

    runTest("Initial state: Vegetable options should be hidden", () => {
        if (!vegetableOptionsList) throw new Error("Vegetable options list not found");
        if (vegetableOptionsList.classList.contains('visible')) {
            throw new Error("Vegetable options are visible by default.");
        }
        if (vegetableCategoryTitle.classList.contains('expanded')) {
            throw new Error("Vegetable category title has 'expanded' class by default.");
        }
    });

    runTest("Clicking Vegetable category should not affect Fruit category (assuming Fruit is closed)", () => {
        // Ensure fruit is closed first
        if (fruitOptionsList.classList.contains('visible')) {
            fruitCategoryTitle.click();
        }

        if (!vegetableCategoryTitle) throw new Error("Vegetable category title not found");
        vegetableCategoryTitle.click();

        if (!vegetableOptionsList.classList.contains('visible')) {
            throw new Error("Vegetable options did not become visible after click.");
        }
        if (!vegetableCategoryTitle.classList.contains('expanded')) {
            throw new Error("Vegetable category title did not get 'expanded' class after click.");
        }
        // Check fruit category remains closed
        if (fruitOptionsList.classList.contains('visible')) {
            throw new Error("Fruit options became visible when vegetable category was clicked.");
        }
        if (fruitCategoryTitle.classList.contains('expanded')) {
            throw new Error("Fruit category title got 'expanded' class when vegetable category was clicked.");
        }
    });

    runTest("Clicking expanded Vegetable category should close it", () => {
        vegetableCategoryTitle.click(); // Second click on vegetable
        if (vegetableOptionsList.classList.contains('visible')) {
            throw new Error("Vegetable options did not hide after second click.");
        }
        if (vegetableCategoryTitle.classList.contains('expanded')) {
            throw new Error("Vegetable category title did not remove 'expanded' class after second click.");
        }
    });

    // --- Log Summary ---
    console.log("\n--- Test Summary ---");
    console.log(`Total Tests: ${results.total}`);
    console.log(`Passed: ${results.passed}`);
    console.log(`Failed: ${results.failed}`);
    results.details.forEach(detail => {
        if (detail.status === "FAILED") {
            console.error(`Detail - ${detail.status}: ${detail.description} (Error: ${detail.error})`);
        } else {
            console.log(`Detail - ${detail.status}: ${detail.description}`);
        }
    });
    if (results.failed === 0) {
        console.log("All tests passed!");
    } else {
        console.error("Some tests failed.");
    }
    alert(`Tests Complete. Passed: ${results.passed}/${results.total}. Check console for details.`);
});
