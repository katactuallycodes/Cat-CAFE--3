/**
 * Enhanced Image Optimization Script
 * 
 * This script optimizes image loading for better performance:
 * 1. Lazy loads images with IntersectionObserver
 * 2. Uses optimized JPG versions that are available
 * 3. Loads images efficiently to prevent layout shifts
 * 4. Prevents layout shifts with proper dimension attributes
 * 5. Optimizes background images loading
 */

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get all images on the page
    const allImages = document.querySelectorAll('img');
    
    // Basic image optimization - add width/height attributes
    allImages.forEach(img => {
        // Skip images that already have loading attributes
        if (!img.hasAttribute('loading')) {
            img.loading = 'lazy';
        }
        
        // Add width and height if not present to prevent layout shifts
        if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
            img.setAttribute('width', '300');
            img.setAttribute('height', '300');
        }
    });
    
    // Process cat gallery images
    const catCards = document.querySelectorAll('.cat-card');
    let loadedCount = 0;
    const totalImages = catCards.length;
    
    // Create an IntersectionObserver for better lazy loading
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const img = card.querySelector('img');
                    
                    if (img && !img.dataset.loaded) {
                        const originalSrc = img.getAttribute('data-src') || img.src;
                        const catNumber = originalSrc.match(/cat(\d+)\.jpg/);
                        
                        if (catNumber && catNumber[1]) {
                            // Use the optimized versions that actually exist
                            const srcList = [
                                // Medium quality optimized version
                                `images/optimized/medium/cat${catNumber[1]}.jpg`,
                                // Original as fallback
                                originalSrc
                            ];
                            
                            // Load image with fallbacks
                            loadImageWithFallback(img, srcList, function() {
                                img.style.opacity = '1';
                                img.dataset.loaded = 'true';
                                loadedCount++;
                                
                                // Load next batch when needed
                                if (loadedCount % 4 === 0 && loadedCount < totalImages) {
                                    // Schedule next batch
                                    setTimeout(() => {
                                        // Nothing to do - observer will handle it
                                    }, 100);
                                }
                            });
                        } else {
                            // For non-cat images
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                img.removeAttribute('data-src');
                            }
                            img.style.opacity = '1';
                        }
                    }
                    
                    // Stop observing this element
                    observer.unobserve(card);
                }
            });
        }, {
            rootMargin: '200px 0px', // Start loading images 200px before they come into view
            threshold: 0.01 // Trigger when at least 1% of the image is visible
        });
        
        // Observe all cat cards
        catCards.forEach(card => {
            imageObserver.observe(card);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        // Load all images immediately
        catCards.forEach(card => {
            const img = card.querySelector('img');
            if (img && img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
        });
    }
    
    // Apply style optimizations
    const style = document.createElement('style');
    style.textContent = `
        /* Prevent layout shifts during image load */
        img {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        /* Give elements a default height before image loads */
        .cat-image {
            min-height: 300px;
            background-color: rgba(0, 0, 0, 0.05);
        }
        
        /* Ensure images don't cause layout shifts */
        .cat-image img {
            object-fit: cover;
            width: 100%;
            height: 100%;
        }
    `;
    document.head.appendChild(style);
    
    // Handle background images
    optimizeBackgroundImages();
});

/**
 * Try to load an image with fallbacks
 * @param {HTMLImageElement} imgElement - The image element to update
 * @param {Array<string>} srcList - List of sources to try, in order of preference
 * @param {Function} onSuccess - Callback when image loads successfully
 */
function loadImageWithFallback(imgElement, srcList, onSuccess) {
    let currentIndex = 0;
    
    function tryNextSource() {
        if (currentIndex >= srcList.length) {
            return; // No more sources to try
        }
        
        const tempImg = new Image();
        tempImg.onload = function() {
            imgElement.src = srcList[currentIndex];
            if (onSuccess) onSuccess();
        };
        
        tempImg.onerror = function() {
            currentIndex++;
            tryNextSource();
        };
        
        tempImg.src = srcList[currentIndex];
    }
    
    tryNextSource();
}

/**
 * Optimize background images
 */
function optimizeBackgroundImages() {
    // Handle the hero background image
    const header = document.querySelector('header');
    if (header) {
        // Use the optimized version of the hero image that actually exists
        const bgUrl = 'images/optimized/medium/hero-bg.jpg';
        
        // Update hero background
        const style = document.createElement('style');
        style.textContent = `
            header::before {
                background-image: url('${bgUrl}');
            }
        `;
        document.head.appendChild(style);
    }
    
    // Get all elements with background images
    const elementsWithBgImage = document.querySelectorAll('[data-bg-src]');
    
    // Use requestIdleCallback to load background images during browser idle time
    if (window.requestIdleCallback) {
        requestIdleCallback(() => {
            loadBackgroundImages(elementsWithBgImage);
        });
    } else {
        // Fallback to setTimeout
        setTimeout(() => {
            loadBackgroundImages(elementsWithBgImage);
        }, 200);
    }
}

/**
 * Load background images for elements
 * @param {NodeList} elements - Elements with data-bg-src attribute
 */
function loadBackgroundImages(elements) {
    elements.forEach(el => {
        const bgSrc = el.getAttribute('data-bg-src');
        if (bgSrc) {
            // Create a new image to preload
            const img = new Image();
            
            img.onload = function() {
                // Once loaded, apply the background image
                el.style.backgroundImage = `url('${bgSrc}')`;
                el.removeAttribute('data-bg-src');
            };
            
            img.src = bgSrc;
        }
    });
} 