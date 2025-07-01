#!/bin/bash

# Optimize Images Script
# This script converts all JPG images to AVIF format for better performance
# It requires ImageMagick to be installed

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "Error: ImageMagick is not installed."
    echo "Please install ImageMagick:"
    echo "  - Mac: brew install imagemagick"
    echo "  - Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "  - Windows: https://imagemagick.org/script/download.php"
    exit 1
fi

# Create output directory
mkdir -p images/avif

echo "Converting images to AVIF format..."

# Process all JPG images
for img in images/*.jpg; do
    # Get filename without extension
    filename=$(basename -- "$img")
    name="${filename%.*}"
    
    echo "Processing $filename..."
    
    # Create standard quality AVIF
    convert "$img" -resize 600x -quality 70 "images/avif/${name}.avif"
    
    # Create low quality AVIF for thumbnails
    convert "$img" -resize 300x -quality 40 "images/avif/${name}-low.avif"
    
    echo "✓ Created ${name}.avif and ${name}-low.avif"
done

echo "All images converted successfully!"
echo "To use these images, make sure to include modern-images.js in your HTML." 