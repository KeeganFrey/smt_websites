// --- Test Utility Functions ---
const resultsDiv = document.getElementById('test-results');
const summaryStatus = document.getElementById('summary-status');
const passCountEl = document.getElementById('pass-count');
const failCountEl = document.getElementById('fail-count');
let totalPass = 0;
let totalFail = 0;

function logTestResult(testName, passed, message = '') {
    const resultP = document.createElement('p');
    resultP.innerHTML = `<b>${testName}</b>: <span class="${passed ? 'pass' : 'fail'}">${passed ? 'PASS' : 'FAIL'}</span> ${message ? '- ' + message : ''}`;
    resultP.className = 'test-result';
    resultsDiv.appendChild(resultP);
    if (!passed) {
        console.error(`${testName}: FAIL ${message ? '- ' + message : ''}`);
        totalFail++;
    } else {
        totalPass++;
    }
    updateSummary();
}

function updateSummary() {
    passCountEl.textContent = totalPass;
    failCountEl.textContent = totalFail;
    if (totalFail > 0) {
        summaryStatus.textContent = 'Failed';
        summaryStatus.style.color = 'red';
    } else if (totalPass > 0 && totalFail === 0) {
        summaryStatus.textContent = 'All Passed';
        summaryStatus.style.color = 'lightgreen';
    } else {
        summaryStatus.textContent = 'Running...';
    }
}

function getButton() {
    return document.getElementById('scrollToTopBtn');
}

function isButtonVisible(button) {
    if (!button) return false;
    const style = window.getComputedStyle(button);
    return style.visibility === 'visible' && style.opacity === '1';
}

// Helper to simulate scrolling and wait for scroll events to process
function simulateScroll(scrollYValue) {
    return new Promise(resolve => {
        window.scrollTo(0, scrollYValue);
        // Allow time for scroll event handlers and CSS transitions
        setTimeout(resolve, 400); // Transition time is 0.3s, add a buffer
    });
}

// Helper to simulate click and wait for potential scroll
function simulateClick(element) {
     return new Promise(resolve => {
        if (element) {
            element.click();
        }
        // Allow time for smooth scroll behavior
        // Smooth scroll can take varying amounts of time.
        // For testing scrollY=0, we might need a longer, more robust check or a different scroll behavior in tests.
        setTimeout(resolve, 500); // Adjust if smooth scroll takes longer
    });
}

// --- Test Cases ---

async function testInitialState() {
    const testName = "Test Initial State (Button Hidden)";
    logTestResult(testName + " - Setup", true, "Scrolling to top (0px)");
    await simulateScroll(0); // Ensure we are at the top

    const button = getButton();
    if (!button) {
        logTestResult(testName, false, "Button element not found in DOM.");
        return;
    }
    logTestResult(testName, !isButtonVisible(button), `Button visibility should be hidden. Visible: ${isButtonVisible(button)}`);
}

async function testButtonVisibilityOnScroll() {
    const testName = "Test Button Visibility on Scroll";
    const button = getButton();
    if (!button) {
        logTestResult(testName, false, "Button element not found in DOM.");
        return;
    }

    // Scroll below threshold (e.g., half of viewport height)
    const scrollDepthSlightlyBelowThreshold = window.innerHeight * 0.5;
    logTestResult(testName + " - Setup", true, `Scrolling to ${scrollDepthSlightlyBelowThreshold}px (below threshold)`);
    await simulateScroll(scrollDepthSlightlyBelowThreshold);
    logTestResult(testName + " - Below Threshold", !isButtonVisible(button), `Button should be hidden. Visible: ${isButtonVisible(button)}`);

    // Scroll past threshold (e.g., 1.5 times viewport height)
    const scrollDepthAboveThreshold = window.innerHeight * 1.5;
    logTestResult(testName + " - Setup", true, `Scrolling to ${scrollDepthAboveThreshold}px (above threshold)`);
    await simulateScroll(scrollDepthAboveThreshold);
    logTestResult(testName + " - Above Threshold", isButtonVisible(button), `Button should be visible. Visible: ${isButtonVisible(button)}`);

    // Scroll back to top
    logTestResult(testName + " - Setup", true, "Scrolling back to top (0px)");
    await simulateScroll(0);
    logTestResult(testName + " - Back to Top", !isButtonVisible(button), `Button should be hidden. Visible: ${isButtonVisible(button)}`);
}

async function testButtonClickScrollsToTop() {
    const testName = "Test Button Click Scrolls to Top";
    const button = getButton();
    if (!button) {
        logTestResult(testName, false, "Button element not found in DOM.");
        return;
    }

    // Scroll down to make button visible
    const scrollDepth = window.innerHeight * 1.5;
    logTestResult(testName + " - Setup", true, `Scrolling to ${scrollDepth}px to show button.`);
    await simulateScroll(scrollDepth);

    if (!isButtonVisible(button)) {
        logTestResult(testName, false, "Button did not become visible after scrolling down.");
        return;
    }

    logTestResult(testName + " - Setup", true, "Simulating button click.");
    await simulateClick(button);

    // Check if scrolled to top (scrollY is 0)
    // Due to smooth scrolling, this might need a slight delay or repeated checks.
    // The timeout in simulateClick should help.
    const scrolledToTop = window.scrollY === 0;
    logTestResult(testName, scrolledToTop, `Page should be scrolled to top (scrollY === 0). Actual: ${window.scrollY}`);

    // Also check if button becomes hidden again after scrolling to top
    // The scroll event that hides the button might fire slightly after the click's scroll action.
    // The simulateScroll within testInitialState/testButtonVisibilityOnScroll already re-checks this,
    // but an explicit check here after click is also good.
    await simulateScroll(0); // Ensure scroll events have fired
    logTestResult(testName + " - Post-Click Visibility", !isButtonVisible(button), `Button should be hidden after scrolling to top. Visible: ${isButtonVisible(button)}`);
}


// --- Run Tests ---
document.addEventListener('DOMContentLoaded', async () => {
    resultsDiv.innerHTML = '<h2>Test Log:</h2>'; // Clear previous results if any
    summaryStatus.textContent = 'Running tests...';
    totalPass = 0;
    totalFail = 0;
    updateSummary();

    const testsTitle1 = document.createElement('p');
    testsTitle1.className = 'test-title';
    testsTitle1.textContent = "Running Initial State Test:";
    resultsDiv.appendChild(testsTitle1);
    await testInitialState();

    const testsTitle2 = document.createElement('p');
    testsTitle2.className = 'test-title';
    testsTitle2.textContent = "Running Visibility Tests:";
    resultsDiv.appendChild(testsTitle2);
    await testButtonVisibilityOnScroll();

    const testsTitle3 = document.createElement('p');
    testsTitle3.className = 'test-title';
    testsTitle3.textContent = "Running Click Action Test:";
    resultsDiv.appendChild(testsTitle3);
    await testButtonClickScrollsToTop();

    // Final summary update
    if (totalFail === 0 && totalPass > 0) {
        summaryStatus.textContent = 'All Tests Completed: PASSED';
        summaryStatus.style.color = 'lightgreen';
    } else if (totalFail > 0) {
        summaryStatus.textContent = `Tests Completed: FAILED (${totalFail} failed)`;
        summaryStatus.style.color = 'red';
    } else {
        summaryStatus.textContent = 'Tests Completed (No failures, but also no passes?)';
        summaryStatus.style.color = 'orange';
    }
    // Log final counts in case summary element is not fully updated
    console.log(`Tests complete. Passed: ${totalPass}, Failed: ${totalFail}`);
});
