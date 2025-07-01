#!/usr/bin/env python3
"""
Image Resizer and Compressor
This script resizes and compresses all JPG images in the images folder
to reduce their file size while maintaining acceptable quality.
"""

import os
import sys
try:
    from PIL import Image
except ImportError:
    print("Error: Pillow library is not installed.")
    print("Please install it with: pip install Pillow")
    sys.exit(1)

# Configuration
INPUT_DIR = 'images'
OUTPUT_DIR = 'images/optimized'
SIZES = [
    {'name': 'thumbnail', 'size': (300, 300), 'quality': 70},
    {'name': 'medium', 'size': (600, 600), 'quality': 80}
]
FORMATS = ['jpg', 'jpeg', 'png']

def create_dir(directory):
    """Create directory if it doesn't exist"""
    if not os.path.exists(directory):
        os.makedirs(directory)

def resize_image(input_path, output_path, size, quality):
    """Resize and compress an image"""
    try:
        with Image.open(input_path) as img:
            # Convert to RGB if needed
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Resize maintaining aspect ratio
            img.thumbnail(size)
            
            # Save with compression
            img.save(output_path, 'JPEG', quality=quality, optimize=True)
            
            return True
    except Exception as e:
        print(f"Error processing {input_path}: {e}")
        return False

def main():
    # Create output directory
    create_dir(OUTPUT_DIR)
    
    # Get all image files
    image_files = []
    for file in os.listdir(INPUT_DIR):
        ext = os.path.splitext(file)[1].lower().replace('.', '')
        if ext in FORMATS and os.path.isfile(os.path.join(INPUT_DIR, file)):
            image_files.append(file)
    
    if not image_files:
        print(f"No images found in {INPUT_DIR}")
        return
    
    print(f"Found {len(image_files)} images to process")
    
    # Process each image
    successful = 0
    for file in image_files:
        input_path = os.path.join(INPUT_DIR, file)
        filename = os.path.splitext(file)[0]
        
        print(f"Processing {file}...")
        
        # Process each size
        for size_config in SIZES:
            size_dir = os.path.join(OUTPUT_DIR, size_config['name'])
            create_dir(size_dir)
            
            output_filename = f"{filename}.jpg"
            output_path = os.path.join(size_dir, output_filename)
            
            if resize_image(input_path, output_path, size_config['size'], size_config['quality']):
                successful += 1
                original_size = os.path.getsize(input_path) / 1024  # KB
                new_size = os.path.getsize(output_path) / 1024  # KB
                reduction = (1 - (new_size / original_size)) * 100
                print(f"  ✓ {size_config['name']}: {original_size:.1f}KB → {new_size:.1f}KB ({reduction:.1f}% reduction)")
    
    print(f"\nProcessed {successful} images")
    print(f"Optimized images saved to {OUTPUT_DIR}/[size]")
    print("\nTo use these optimized images in your website:")
    print("1. Replace the original image paths in your HTML")
    print("2. For example: images/cat1.jpg → images/optimized/medium/cat1.jpg")

if __name__ == "__main__":
    main() 