const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if imagemagick is installed
try {
    execSync('convert -version', { stdio: 'ignore' });
} catch (error) {
    console.error('Error: ImageMagick is required for this script.');
    console.error('Please install ImageMagick:');
    console.error('  - Mac: brew install imagemagick');
    console.error('  - Ubuntu/Debian: sudo apt-get install imagemagick');
    console.error('  - Windows: https://imagemagick.org/script/download.php');
    process.exit(1);
}

// Define image directory
const imageDir = path.join(__dirname, 'images');
const outputDir = path.join(__dirname, 'images/avif');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Get all image files
const imageFiles = fs.readdirSync(imageDir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png'].includes(ext) && !file.includes('avif');
});

// Convert each image to AVIF with different quality levels
console.log('Converting images to AVIF format...');

imageFiles.forEach(file => {
    const inputPath = path.join(imageDir, file);
    const fileNameWithoutExt = path.basename(file, path.extname(file));
    
    // Different quality levels for different use cases
    const qualities = [
        { suffix: '', quality: 70 },      // Standard quality
        { suffix: '-low', quality: 40 },  // Low quality for thumbnails
    ];
    
    qualities.forEach(({ suffix, quality }) => {
        const outputFileName = `${fileNameWithoutExt}${suffix}.avif`;
        const outputPath = path.join(outputDir, outputFileName);
        
        try {
            // Use ImageMagick to convert to AVIF
            const command = `convert "${inputPath}" -quality ${quality} "${outputPath}"`;
            execSync(command);
            console.log(`✓ Created ${outputFileName} (Quality: ${quality}%)`);
        } catch (error) {
            console.error(`✗ Failed to convert ${file}: ${error.message}`);
        }
    });
});

console.log('Conversion complete!');
console.log('AVIF images are available in the images/avif directory');
console.log('Use them in your HTML with the <picture> element for best browser support.'); 