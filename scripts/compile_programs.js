const fs = require('fs');
const path = require('path');
require('dotenv').config()

const folderPath = process.env.programsSrc

const programJs = process.env.programJs

// Get all js files in folder
const jsFiles = fs.readdirSync(folderPath).filter(file => path.extname(file) === '.js');

// Concatenate all js files into a single string
const compiledCode = jsFiles.reduce((acc, file) => {
  const filePath = path.join(folderPath, file);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return acc + fileContent;
}, '');

// Write compiled code to output file
fs.writeFileSync(programJs, compiledCode);

console.log(`Successfully compiled ${jsFiles.length} files into ${programJs}`);
