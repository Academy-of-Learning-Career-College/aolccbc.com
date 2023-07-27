const csvtojson = require('csvtojson');
const fs = require('fs');
const path = require('path');

// specify your csv file path
const csvFilePath = './static/programlisting.csv';
const outFile = './static/data/programtable.json'

csvtojson()
 .fromFile(csvFilePath)
 .then((jsonObj) => {
   const convertedData = jsonObj.reduce((acc, item) => {
    if(item.Active !=="No" && item.NameofProgram && item.Hours && item.Tuition && item.SMORG) {
     acc.push({
       "name": item.NameofProgram,
       "weeks": `${Math.ceil(item.Hours / 25)} weeks`,
       "cost": `$${parseFloat(item.Tuition).toLocaleString()}`,
       "Syllabus": `<a href='https://smorgs.aolccbc.com/${item.SMORG}'>Info Sheet</a>`,
     });
    }
    return acc;
   }, []);

   const jsonData = JSON.stringify(convertedData, "yolo", 2);
   // Write output to JSON file
   fs.writeFileSync(path.resolve(__dirname, outFile), jsonData, 'utf8');

   console.log("JSON file created successfully!");
 });
