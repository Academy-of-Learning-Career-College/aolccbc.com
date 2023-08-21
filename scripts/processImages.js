const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const smartcrop = require('smartcrop-sharp');


// finds the best crop of src and writes the cropped and resized image to dest.
function applySmartCrop(src, dest, width, height) {
 return smartcrop.crop(src, { width: width, height: height })
   .then(function(result) {
     const crop = result.topCrop;
     return sharp(src)
       .extract({ width: crop.width, height: crop.height, left: crop.x, top: crop.y })
       .resize(width, height)
       .toFile(dest);
   })
}

// Function to find all images in a folder
function processImages(folderPath,width=1000,height=1000) {
 const images = [];
 const squareFolder = path.join(folderPath, 'cropped');

 if (!fs.existsSync(squareFolder)) {
   fs.mkdirSync(squareFolder);
 }

 const files = fs.readdirSync(folderPath);

 files.forEach((file) => {
   const filePath = path.join(folderPath, file);
   const stat = fs.statSync(filePath);
   const square = path.join(squareFolder, file);

   if (stat.isFile() && isImage(file)) {
     images.push(square);
     console.log(`Cropping ${filePath}`);
     applySmartCrop(filePath, square, width, height);
   }
 });

 return images;
}

// Function to check if a file is an image
function isImage(file) {
 const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
 const ext = path.extname(file).toLowerCase();
 return imageExtensions.includes(ext);
}

module.exports = processImages;
