/**
 * Modern Image Formats Handler
 * This script enhances image loading by using modern formats when supported
 * and dynamically managing image loading for better performance.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if the browser supports AVIF format
    const supportsAvif = detectAvifSupport();
    
    // Process cat gallery images
    const catCards = document.querySelectorAll('.cat-card');
    let loadedCount = 0;
    const totalImages = catCards.length;
    
    // Load images in batches of 4 to reduce memory pressure
    function loadImageBatch(startIndex) {
        const endIndex = Math.min(startIndex + 3, totalImages - 1);
        
        for (let i = startIndex; i <= endIndex; i++) {
            if (i >= totalImages) break;
            
            const card = catCards[i];
            const img = card.querySelector('img');
            
            if (img && !img.dataset.loaded) {
                const originalSrc = img.src;
                const catNumber = originalSrc.match(/cat(\d+)\.jpg/);
                
                if (catNumber && catNumber[1]) {
                    // Set a placeholder first
                    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"%3E%3Crect width="300" height="300" fill="%23f0f0f0"/%3E%3C/svg%3E';
                    
                    if (supportsAvif) {
                        // Try to load AVIF version if available
                        loadImageWithFallback(
                            img,
                            [
                                `images/avif/cat${catNumber[1]}-low.avif`,
                                `images/avif/cat${catNumber[1]}.avif`,
                                originalSrc
                            ],
                            function() {
                                loadedCount++;
                                img.dataset.loaded = 'true';
                                
                                // Load next batch when this one is done
                                if (loadedCount % 4 === 0 && loadedCount < totalImages) {
                                    loadImageBatch(loadedCount);
                                }
                            }
                        );
                    } else {
                        // Fallback to original image with improved loading
                        img.src = originalSrc;
                        img.onload = function() {
                            loadedCount++;
                            img.dataset.loaded = 'true';
                            
                            // Load next batch when this one is done
                            if (loadedCount % 4 === 0 && loadedCount < totalImages) {
                                loadImageBatch(loadedCount);
                            }
                        };
                    }
                }
            }
        }
    }
    
    // Start loading the first batch of images
    if (totalImages > 0) {
        loadImageBatch(0);
    }
    
    // Handle the hero background image
    if (supportsAvif) {
        const header = document.querySelector('header');
        if (header) {
            // Try to load AVIF version for the background
            const heroAvifUrl = 'images/avif/hero-bg.avif';
            
            // Test if the AVIF version exists
            testImageExists(heroAvifUrl, function(exists) {
                if (exists) {
                    const style = document.createElement('style');
                    style.textContent = `
                        header::before {
                            background-image: url('${heroAvifUrl}') !important;
                        }
                    `;
                    document.head.appendChild(style);
                }
            });
        }
    }
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
 * Test if an image exists on the server
 * @param {string} url - URL of the image to test
 * @param {Function} callback - Callback function(exists)
 */
function testImageExists(url, callback) {
    const img = new Image();
    img.onload = function() {
        callback(true);
    };
    img.onerror = function() {
        callback(false);
    };
    img.src = url;
}

/**
 * Detect if the browser supports AVIF format
 * @returns {boolean} True if AVIF is supported
 */
function detectAvifSupport() {
    const canvas = document.createElement('canvas');
    if (!canvas || !canvas.getContext) return false;
    
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
} 