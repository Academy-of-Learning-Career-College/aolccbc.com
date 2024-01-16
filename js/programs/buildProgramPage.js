function buildProgramPage(
  programnameasurl,
  programname,
  programtype,
  hideDataTable,
) {
  try {
    var overlay = document.getElementById("programoverlay");
    var closebutton =
      '<button class="closebutton" onClick="closeOverlay();">X<br />Close</button>';
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeOverlay();
      }
    });
    var othercontent = "";
    var JSONFile = "data/" + programnameasurl + "_programdata.json";
    var proglistingJSONFile = "data/3500.json";
    var fullImage = "images/full/" + programnameasurl + "_full_size.webp";

    var smorg =
      "smorgs/" + programnameasurl + "_" + programtype.toLowerCase() + ".pdf";
    console.log(
      "I am grabbing " +
        JSONFile +
        ", " +
        proglistingJSONFile +
        ", " +
        smorg +
        " and " +
        fullImage,
    );
    fetch(JSONFile)
      .then(function (response) {
        if (response.status === 404) {
          alert("Error, the " + JSONFile + " cannot be found");
        }
        return response.json();
      })
      .then(function (data) {
        console.log(data);

        var textbooks1 = "";
        var optionalCooperativePlacementHours = "";
        var admitreqArray = createDivfromJSON(data.admitreq, headings[0].a1);
        var admitreq = admitreqArray[0].partcontent;
        var a1 = admitreqArray[0].part_heading;

        var programhighlightsArray = createDivfromJSON(
          data.programhighlights,
          headings[0].a2,
        );
        var programhighlights = programhighlightsArray[0].partcontent;
        var a2 = programhighlightsArray[0].part_heading;

        var careeroppArray = createDivfromJSON(data.careeropp, headings[0].a3);
        var careeropp = careeroppArray[0].partcontent;
        var a3 = careeroppArray[0].part_heading;
        var corecoursesArray = createDivfromJSON(
          data.corecourses,
          headings[0].a4,
        );
        var corecourses = corecoursesArray[0].partcontent;
        var a4 = corecoursesArray[0].part_heading;
        var a5 = headings[0].a5;

        var bcminwage = 15.65;

        var bcminannualsalary = bcminwage * 40 * 52;
        var salarystart = data.salarystart;
        if (salarystart < bcminannualsalary) {
          salarystart = bcminannualsalary;
        }
        salarystart = toCAD(salarystart, "salararystart");
        var salaryend = toCAD(data.salaryend, "salaryend");

        function createDivfromJSON(part, altHeading) {
          var partcontent = "";
          var partAltHeading = "";
          part.paragraphs.forEach((paragraph) => {
            if (paragraph.li_title) {
              partcontent =
                partcontent + "<b>" + paragraph.li_title + "</b><br />";
            }
            if (paragraph.ul_start) {
              partcontent = partcontent + "<ul>";
            } else if (paragraph.ul_end) {
              partcontent = partcontent + "</ul>";
            } else {
              partcontent =
                partcontent +
                "<" +
                paragraph.style +
                ">" +
                paragraph.content +
                "</" +
                paragraph.style +
                ">";
            }
            var altHeadingTemp = part.altHeading;
            console.log(altHeadingTemp);
          });
          if (altHeading === undefined) {
            partAltHeading = altHeading;

            console.log(
              `altHeadingTemp = ${altHeading}\npartAltHeading = ${partAltHeading}\naltHeading = ${altHeading}`,
            );
          } else {
            partAltHeading = altHeading;
            console.log(altHeading);
            console.log(
              `altHeadingTemp = ${altHeading}\npartAltHeading = ${partAltHeading}\naltHeading = ${altHeading}`,
            );
          }
          var partcontentArray = [
            {
              partcontent,
              part_heading: partAltHeading,
            },
          ];
          return partcontentArray;
        }
        console.log("Fetching proglistingJSONFile");
        fetch(proglistingJSONFile)
          .then(function (response) {
            console.log(`Got a response \n${response}`);
            return response.json();
          })
          .then((data) => {
            console.log(data);
            console.log(
              `Now, I need to serach for ${programname} in the proglistingJSONFile`,
            );
            let mainname = programname.replace(/\sCertificate|\sDiploma/g, "");
            mainname = mainname.toLowerCase();

            data.programs.forEach((program) => {
              if (program.name.toLowerCase() === mainname.toLowerCase()) {
                var progtitle = program.name;
                var programtype = program.Credential;
                var programhours = program.Duration[0].hours;
                var programduration = program.Duration[0].weeks;
                let workexphours = program.Duration[0].workexperience;

                if (workexphours === undefined) {
                  workexphours = "";
                }
                var dtuition = toCAD(
                  program.domestic[0].tuition,
                  "domestic tuition",
                );
                var ituition = toCAD(
                  program.domestic[0].tuition * 1.3,
                  "international tuition",
                );
                var appfee = 250;
                var dapp = toCAD(appfee, "domestic app fee");
                var iapp = toCAD(appfee * 2, "domestic app fee");
                var assessfee = toCAD(100, "assess (Domestic and INTL) fee");
                var dassess = assessfee;
                var iassess = assessfee;

                let otherfees = program.domestic[0].other;
                if (otherfees === undefined) {
                  otherfees = 4;
                }

                var dother = toCAD(otherfees, "other fees");
                var textbooks = program.domestic[0].textbooks;

                if (textbooks !== undefined) {
                  var textbookscost = toCAD(textbooks, "textbooks");
                }
                let coursemat = program.domestic[0].coursematerials;
                if (coursemat !== undefined) {
                  coursemat = toCAD(coursemat, "course materials");
                  coursemat = `<tr id="coursemats">
                                        <td class="title">Course Materials:</td>
                                        <td>${coursemat}</td>
                                        <td>${coursemat}</td>
                                    </tr>`;
                }

                if (program.cooperativePlacementHours === undefined) {
                  var optionalCooperativePlacementHours = "";
                } else {
                  var optionalCooperativePlacementHours =
                    program.duration[0].cooperativePlacementHours;
                }

                console.log("Building content now");

                var progInfoArray = [
                  {
                    top: `
                                    <div class="container-flex center">
                                    <h1>
                                        <div id="progtitle" class="progtitle1">${progtitle}</div>
                                    </h1>
                                </div>
                                <div class="container-flex center">
                                    <div id="fullimage"><img src=${fullImage} alt='Program Image'></div>
                                </div>`,
                    left: `
                                <div class="container-flex program-info" id="program-info">
                                    <div class="header lefthr">
                                        <h1>Program Info:</h1>
                                    </div>
                                    <div class="d-md-flex flex-row ">
                                        <div class="p-2 col1">
                                            <div class="container">
                                                <h2>${a1}</h2>
                                                <div id="admitreq">${admitreq}</div>
                                            </div>
                                            <div class="container">
                                                <h2>${a2}</h2>
                                            </div>
                                            <div class="container">
                                                <div id="programhighlights">${programhighlights}</div>
                                            </div>
                                        </div>
                                        <div class="p-2 col2">
                                            <div class="textleft">
                                                <div class="container">
                                                    <h2>${a3}</h2>
                                                </div>`,
                    middle: `
                                                <div class="container">
                                                    <div id="careeropp">${careeropp}</div>
                                                </div>
                                            </div>
                                            <div>
                                                <div class="container">
                                                    <h2>${a4}</h2>
                                                </div>
                                                <div class="container">
                                                    <p>${a5}</p>
                                                    <div id="corecourses">${corecourses}</div>
                                                </div>
                                            </div>
                                        </div>`,
                    right: `
                                        <div class="p-2 programdatacol" id="progdatatable">
                                            <table class="progdata">
                                                <tbody>
                                                    <tr>
                                                        <td class="title title_with_emoji">
                                                        <i class="fas fa-scroll"></i>&nbsp;Program&nbsp;Type:</td>
                                                        <td colspan="2">${programtype}</td>
                                                    </tr>
                                                    <tr>
                                                        <td class="title title_with_emoji"><i class="fas fa-search-dollar"></i>&nbsp;Anticipated&nbsp;Salary:</td>
                                                        <td colspan="2">${salarystart} &ndash; ${salaryend}
                                                        </td>
                                                    </tr>
                                                    <tr class="tr-nobottomborder">
                                                        <td class="title title_with_emoji"><i class="fas fa-calendar"></i>&nbsp;Program&nbsp;Duration:</td>
                                                        <td id="duration"colspan="2">
                                                            Weeks: ${programduration}<br>
                                                            Hours: ${programhours} <br>
                                                            <p id="workexphours">${workexphours}</p>
                                                            
                                                        </td>
                                                    </tr>
                                                    <tr class="tr-notopborder tr-nobottomborder">
                                                        <td colspan="3">
                                                            <h3>Tuition Fees</h3>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="title">Tuition:</td>
                                                        <td>${dtuition}</td>
                                                        <td>${ituition}</td>
                                                    </tr>
                                                    <tr>
                                                        <td class="title">Application:</td>
                                                        <td>${dapp}</td>
                                                        <td>${iapp}</td>
                                                    </tr>
                                                    <tr>
                                                        <td class="title">Assessment:</td>
                                                        <td>${dassess}</td>
                                                        <td>${iassess}</td>
                                                    </tr>
                                                    ${textbooks1}
                                                    ${coursemat}
    
                                                    <tr>
                                                        <td class="title">Other Fees:</td>
                                                        <td>${dother}</td>
                                                        <td>${dother}</td>
                                                    </tr>
                                                    <tr>
                                                        <td class="title">Program Syllabus:</td>
                                                        <td colspan="2"><a href="${smorg}" target="_blank" rel="noopener noreferrer">Click here to Download</a></td>
                                                                                                         
                                                    </tr>
                                                    <tr>
                                                    <td class="title">Program Notes</td>
                                                    
                                                    <td colspan="2" class="breaksallowed">
                                                    Tuition fees include digital course materials. <br> 
                                                    Printed copies may be available for an additional fee.<br>
                                                    Financial Assistance may be available for those who qualify.
                                                    </td></tr>
                                                    <tr><td class="title">Graduation Requirements</td>
                                                    <td colspan="2" class="breaksallowed">
                                                    Students must maintain a 75% program average to obtain a ${programtype}
                                                    </td>
                                                    </tr>
                                                    <tr class="tr-nobottomborder">
                                                    <td class="title">Method of Delivery</td>
                                                    <td colspan="2" class="breaksallowed">
                                                    Onsite, Remote and Blended using our <br>Integrated Learning &reg;System training facilitated by qualified learning coaches.
                                                    </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>`,
                  },
                ];

                if (hideDataTable === true) {
                  progInfoArray[0].right = "";
                }
                overlay.innerHTML = `${closebutton} ${progInfoArray[0].top} ${progInfoArray[0].left} ${progInfoArray[0].middle} ${progInfoArray[0].right}</div> `;

                if (workexphours === undefined) {
                  document.getElementById("workexphours").innerHTML = "";
                }
              }
            });
            return othercontent;
          });

        return othercontent;
      });
  } catch (error) {}
}
