#!/bin/bash

# Mac-specific Image Optimization Script using sips
# This script doesn't require any additional installations on macOS

# Create output directories
mkdir -p images/optimized/thumbnail
mkdir -p images/optimized/medium

echo "Optimizing images using macOS sips command..."

# Process all JPG images
for img in images/*.jpg; do
    # Get filename without extension
    filename=$(basename -- "$img")
    name="${filename%.*}"
    
    echo "Processing $filename..."
    
    # Create medium size image (600px max dimension)
    sips -Z 600 "$img" --out "images/optimized/medium/${name}.jpg"
    
    # Create thumbnail (300px max dimension) with increased compression
    sips -Z 300 "$img" --setProperty formatOptions 30 --out "images/optimized/thumbnail/${name}.jpg"
    
    # Report file size reduction
    original_size=$(stat -f %z "$img")
    medium_size=$(stat -f %z "images/optimized/medium/${name}.jpg")
    thumbnail_size=$(stat -f %z "images/optimized/thumbnail/${name}.jpg")
    
    original_kb=$(echo "scale=1; $original_size/1024" | bc)
    medium_kb=$(echo "scale=1; $medium_size/1024" | bc)
    thumbnail_kb=$(echo "scale=1; $thumbnail_size/1024" | bc)
    
    medium_reduction=$(echo "scale=1; (1-($medium_size/$original_size))*100" | bc)
    thumbnail_reduction=$(echo "scale=1; (1-($thumbnail_size/$original_size))*100" | bc)
    
    echo "  Original: ${original_kb}KB"
    echo "  Medium: ${medium_kb}KB (${medium_reduction}% smaller)"
    echo "  Thumbnail: ${thumbnail_kb}KB (${thumbnail_reduction}% smaller)"
done

echo "All images optimized successfully!"
echo ""
echo "Next step: Update your HTML by replacing the cat gallery section with the content from optimized-cat-gallery.html" 