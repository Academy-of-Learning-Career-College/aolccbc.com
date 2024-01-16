const { log } = require("console");
const csvtojson = require("csvtojson");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// const temp = 'temp'
// const xlsxfile = process.env.XLSXFILE
const csvFilePath = process.env.CSVFILEPATH;
const jsonFile = process.env.JSONFILEPATH;
const smorgsSite = process.env.SMORGSSITE;

log(csvFilePath);

try {
  csvtojson()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
      const convertedData = jsonObj.reduce((acc, item) => {
        if (
          item.Active !== "No" &&
          item.NameofProgram &&
          item.Hours &&
          item.Tuition &&
          item.SMORG
        ) {
          acc.push({
            name: item.NameofProgram,
            weeks: `${Math.ceil(item.Hours / 25)} weeks`,
            cost: `$${parseFloat(item.Tuition).toLocaleString()}`,
            Syllabus: `<a href='${smorgsSite}/${item.SMORG}'>Info Sheet</a>`,
          });
        }
        return acc;
      }, []);

      const jsonData = JSON.stringify(convertedData, "yolo", 2);
      // Write output to JSON file
      fs.writeFileSync(jsonFile, jsonData, "utf8");

      console.log("JSON file created successfully!");
    });
} catch (error) {
  log(error);
}
