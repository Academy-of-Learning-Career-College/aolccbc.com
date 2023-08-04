function updateExamKits(){
 query = window.location.search
 try {
     kit = query.substring(1).split('&').find(param => param.split('=')[0] === 'kit').split('=')[1].toUpperCase().split("") || ''
     course = kit.splice(0, 3).join("") || ''
     edition = kit.splice(0, 2).join("") || ''
     style = kit.splice(0, 1) || ''
     document.getElementById('instructions').style["display"] = "unset"
     document.getElementById('kits').style["display"] = "unset"

 } catch (error) {
     kit = ''
     course = ''
     edition = ''
     style = ''
 }

 let dlRoot = "https://examkits.aolccbc.com/"
 let suffix = "Practical_Exam_Kit.zip"






let coursesArray = [{"course": "WRD","courseName": "Word","ver": 19,"level": [1, 2, 3]},
    {"course": "EXC","courseName": "Excel","ver": 19,"level": [1, 2, 3]},
    {"course": "PPT","courseName": "PowerPoint","ver": 19,"level": [1, 2]},
    {"course": "ACS","courseName": "Access","ver": 19,"level": [1, 2]},
 ]

 if (typeof kit !== 'undefined' && kit !== '') {
     lol = [coursesArray.find(function (obj) {
         return obj["course"] === course;
     })]
     coursesArray = lol
     coursesArray[0].level = kit
 }

 let contents = "";
 coursesArray.forEach(element => {
     concat = `${element.course}/${element.ver}`;
     download = `${element.course}${element.ver}19`
     coursename1 = `Microsoft ${element.courseName} 2019 Level `
     element.level.forEach(element => {
         concatlevel = `${concat}/${element}`
         link = `${dlRoot}${concatlevel}/${suffix}`
         let levels = concatlevel.replace("/","").replace("/","E")
         console.log(levels)
         var kits = document.getElementById("kit")
         var optText = coursename1 + element
         kits.options[kits.options.length] = new Option(optText, levels);
         download = download + element
         aRef = `<a href="${link}">${coursename1}${element}</a><br>`
         contents += aRef;
         console.log(concatlevel);
     })

 })

 document.getElementById("kits").innerHTML = contents
};

updateExamKits();
