const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Function to convert image to webp
const convertToWebp = async (inputPath, outputPath) => {
 try {
   await sharp(inputPath).toFormat('webp').toFile(outputPath);
   console.log(`Converted ${inputPath} to ${outputPath}`);
 } catch (error) {
   console.error(`Error converting ${inputPath} to ${outputPath}: ${error}`);
 }
};

// Function to convert all images in a folder to webp
const convertFolderToWebp = async (folderPath) => {
 try {
   const files = fs.readdirSync(folderPath);
   const outputFolder = path.join(folderPath, 'webp');

   // Create output folder if it doesn't exist
   if (!fs.existsSync(outputFolder)) {
     fs.mkdirSync(outputFolder);
   }

   // Convert each image in the folder to webp
   for (const file of files) {
     const inputPath = path.join(folderPath, file);
     const outputPath = path.join(outputFolder, `${path.parse(file).name}.webp`);

     // Exclude existing webp files
     if (path.extname(file) !== '.webp') {
       await convertToWebp(inputPath, outputPath);
     }
   }
 } catch (error) {
   console.error(`Error converting folder ${folderPath} to webp: ${error}`);
 }
};

// Usage example
const folderPath = 'images/full';
convertFolderToWebp(folderPath);
