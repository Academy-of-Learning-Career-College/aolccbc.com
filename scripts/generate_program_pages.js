// Import necessary modules
const fs = require("fs");
const csv = require("csv-parser");
const XLSX = require("xlsx");
require("dotenv").config();

const xlsxfile = process.env.XLSXFILE;
const csvFilePath = process.env.CSVFILEPATH;

//const temp = 'temp'
// const xlsxfile = './src/data/programlisting.xlsx'; // Specify the path to your XLSX file
// const csvFilePath = `${temp}/programlisting.csv`; // Specify the desired path for the output CSV file

// Function to convert XLSX file to CSV file
function xlsxToCsv(xlsxfile, csvFilePath) {
  // Read the XLSX file

  const workbook = XLSX.readFile(xlsxfile);

  // Get the first sheet name
  const sheetName = workbook.SheetNames[0];

  // Get the sheet data
  const worksheet = workbook.Sheets[sheetName];

  // Filter the sheet data based on the value of the Active column
  //  const filteredData = worksheet.filter(row => row.Active === 'Yes');

  // Convert the filtered data to a CSV file
  const csvData = XLSX.utils.sheet_to_csv(worksheet);

  // Write the CSV data to a file
  fs.writeFileSync(csvFilePath, csvData);
}
if (!fs.existsSync("temp")) {
  fs.mkdirSync("temp");
}

xlsxToCsv(xlsxfile, csvFilePath);

// Initialize variables
let usedCategoryShortNames = "_";
let categoryButtons =
  '<button class="slidesbtn active" id="all" onclick="filterSelection(\'all\')">All</button>';
let slidesHTML = "";
let programsCount = 0;

// Create the src/programs directory if it does not exist
if (!fs.existsSync("./src/programs")) {
  fs.mkdirSync("./src/programs");
}

// Clear the slides file
const slidesFilePath = "./src/components/slides.htm";
try {
  fs.writeFileSync(slidesFilePath, "", "utf8", { flag: "w" });
  console.log("Slides file created successfully.");
} catch (err) {
  console.error("Error creating slides file:", err);
}

// Create a write stream for the slides file
const slidesStream = fs.createWriteStream(slidesFilePath, { flags: "a" });
slidesStream.on("error", (err) => {
  console.error(`Error writing to slides file: ${err}`);
});

// Function to convert a string to a usable URL string
function convertToURLString(str) {
  const regex = /\+|\s|certificate|diploma|__|\/|\.|_z|:|-|\(|\)|&plus;/gi;
  const regex2 = /_$|__/gi;
  const regex3 = /_$/gi;
  const regex4 = /^\s+|\s+$|\s+(?=\s)/g;
  const regex5 = /__/gi;
  let result = str.replaceAll(regex, "_");
  result = result.replaceAll(regex2, "_");
  result = result.replace(regex3, " ");
  result = result.replace(regex4, "");
  return result.replace(regex5, "_").toLowerCase();
}

// Read the CSV file
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on("data", (row) => {
    // Set the data for this current row
    if (row.Active === "No") {
      console.log("Program Not Active");
      return;
    } else {
      if (!row.NameofProgram) {
        return;
      } else {
        const jsonFileName = row.JSON;

        // Start category
        const categoryFullName = row.Category;
        const categoryShortName = convertToURLString(categoryFullName);
        if (!usedCategoryShortNames.includes(categoryShortName)) {
          usedCategoryShortNames += categoryShortName;
          categoryButtons += `<button class='slidesbtn active' id="${categoryShortName}" onclick="filterSelection('${categoryShortName}')">${categoryFullName}</button>`;
        }
        // End category

        // Slide
        slidesStream.write(`
                 <div class="column slide ${categoryShortName} show"><a href="~/src/programs/${row.URL}.html">
                 <img alt="Learn more about ${row.NameofProgram}" src="~/images/full/webp/${row.URL}_full_size.webp?width=273">
                 ${row.NameofProgram}</a></div>
             `);

        // Start JSON, make programname.html file
        const jsonFilePath = `./src/data/${jsonFileName}`;
        try {
          console.log(`Writing ${row.NameofProgram}`);
          const jsonData = fs.readFileSync(jsonFilePath, "utf-8");
          row.json_data = JSON.parse(jsonData);
          const newHtmlFile = `./src/programs/${row.URL}.html`;
          const fileContents = `
                     <!DOCTYPE html lang="en">
                     <html lang="en">
                     <head>
                         <meta charset="utf-8">
                         <include src="./src/components/head.htm">
                             {"title" : "${row.NameofProgram}"}
                         </include>
                     </head>
                     <body>
                         <include src="./src/components/navbar.htm"></include>
                         <div class="container-fluid">
                             <include src="./src/components/program_template.htm">
                                 ${JSON.stringify(row)}
                             </include>
                             <include src="./src/components/footer.htm"></include>
                         </div>
                     </body>
                     </html>
                 `;

          fs.writeFileSync(newHtmlFile, fileContents, "utf8");
        } catch (error) {
          console.log(error);
        }
      }
    }
    programsCount++;
    // End JSON
  })
  .on("finish", () => {
    console.log(`${programsCount} program pages written`);
    // Write categories to file after all other operations are completed
    fs.writeFileSync(
      "./src/components/program_cats.htm",
      categoryButtons,
      "utf8",
      { flag: "w" },
    );
  });
