const fs = require("fs");
const path = require("path");

// Function to empty a folder
function emptyFolder(folderPath) {
  // Get all the files and sub-folders in the folder
  const files = fs.readdirSync(folderPath);

  // Loop through each file and sub-folder
  for (const file of files) {
    const filePath = path.join(folderPath, file);

    // Check if it is a file or a folder
    const isFile = fs.statSync(filePath).isFile();

    // If it is a file, delete it
    if (isFile) {
      fs.unlinkSync(filePath);
    }
    // If it is a folder, recursively call the function to empty it
    else {
      emptyFolder(filePath);
    }
  }
}

// Specify the folders to be emptied
const foldersToEmpty = ["./.parcel-cache", "./temp", "./www"];

// Empty each folder
for (const folder of foldersToEmpty) {
  emptyFolder(folder);
  console.log(`Emptied folder: ${folder}`);
}
