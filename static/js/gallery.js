document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.querySelector('.gallery-container');
    const galleryItemsContainer = document.querySelector('.gallery-items');
    let items = document.querySelectorAll('.gallery-item'); // Use let as it can change
    const indicatorsContainer = document.querySelector('.navigation-indicators');

    let currentIndex = 0;
    let totalItems = items.length;
    let visibleItemsConfig = 1; // Default: 1 main visible, others faded
    let cycleIntervalId = null;
    const cycleTime = 5000; // 5 seconds

    function generateIndicators() {
        indicatorsContainer.innerHTML = ''; // Clear existing indicators
        if (totalItems === 0) return;
        for (let i = 0; i < totalItems; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            indicator.addEventListener('click', () => {
                stopCycle();
                showItem(i);
                startCycle(); // Restart cycle after manual navigation
            });
            indicatorsContainer.appendChild(indicator);
        }
        updateIndicators();
    }

    function updateIndicators() {
        const indicators = indicatorsContainer.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    function showItem(index) {
        if (totalItems === 0) return;
        currentIndex = (index + totalItems) % totalItems; // Ensure index is within bounds and handles looping

        items.forEach(item => {
            item.classList.remove('active', 'prev-1', 'next-1', 'prev-2', 'next-2');
        });

        items[currentIndex].classList.add('active');

        const halfVisible = Math.floor(visibleItemsConfig / 2);

        for (let i = 1; i <= halfVisible; i++) {
            const prevIndex = (currentIndex - i + totalItems) % totalItems;
            const nextIndex = (currentIndex + i) % totalItems;

            if (items[prevIndex]) {
                items[prevIndex].classList.add(`prev-${i}`);
            }
            if (items[nextIndex]) {
                items[nextIndex].classList.add(`next-${i}`);
            }
        }
        updateIndicators();
        // Note: For a true vertical scroll effect where items move up/down,
        // you would manipulate `scrollTop` of a container or use `transform: translateY`.
        // The current CSS focuses on fading/scaling items in a static vertical stack.
        // If actual scrolling is desired, this function and CSS would need significant changes.
    }

    function nextItem() {
        showItem(currentIndex + 1);
    }

    function prevItem() {
        showItem(currentIndex - 1);
    }

    function startCycle() {
        stopCycle(); // Clear any existing interval
        if (totalItems > 1) { // Only cycle if there's more than one item
            cycleIntervalId = setInterval(nextItem, cycleTime);
        }
    }

    function stopCycle() {
        clearInterval(cycleIntervalId);
    }

    // Configuration functions
    window.setIndicatorPosition = function(position) { // 'left', 'right', or 'bottom' (default)
        galleryContainer.classList.remove('indicators-left', 'indicators-right');
        if (position === 'left') {
            galleryContainer.classList.add('indicators-left');
        } else if (position === 'right') {
            galleryContainer.classList.add('indicators-right');
        }
        // Default (bottom) is when neither class is present
    }

    window.setVisibleItems = function(count) { // 1, 3, 5
        if (![1, 3, 5].includes(count)) {
            console.warn('setVisibleItems: Supported values are 1, 3, or 5.');
            return;
        }
        visibleItemsConfig = count;
        // Remove existing visibility classes from container (if any were planned for it)
        // galleryContainer.classList.remove('visible-1', 'visible-3', 'visible-5');
        // galleryContainer.classList.add(`visible-${count}`);

        // Re-apply classes to items based on new configuration
        showItem(currentIndex);
    }

    // Initial setup
    if (totalItems > 0) {
        generateIndicators();
        setVisibleItems(galleryContainer.classList.contains('visible-3') ? 3 : (galleryContainer.classList.contains('visible-5') ? 5 : 1));
        showItem(0); // Show the first item initially
        startCycle();

        galleryContainer.addEventListener('mouseenter', stopCycle);
        galleryContainer.addEventListener('mouseleave', startCycle);
    } else {
        indicatorsContainer.innerHTML = '<p>No gallery items found.</p>';
    }


    // Dynamic content handling (basic example: re-initialize if items change)
    // This could be tied to a MutationObserver or a custom event if items are added/removed dynamically by other scripts.
    window.refreshGallery = function() {
        items = document.querySelectorAll('.gallery-item');
        totalItems = items.length;
        currentIndex = 0; // Reset index
        stopCycle();
        generateIndicators();
        if (totalItems > 0) {
            setVisibleItems(visibleItemsConfig); // Re-apply current visibility
            showItem(currentIndex);
            startCycle();
        } else {
            indicatorsContainer.innerHTML = '<p>No gallery items found.</p>';
        }
    }
});
