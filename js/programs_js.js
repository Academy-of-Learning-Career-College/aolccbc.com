var headings = [
  {
    a1: "Admission Requirements",
    a2: "Program Highlights",
    a3: "Career Opportunities",
    a4: "CORE COURSES",
    a5: "Upon completion of the program the participant must demonstrate the following core competencies:",
  },
];
var programsWithNoDataTable = {
  program: "english_as_a_second_language",
};
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
// eslint-disable-next-line no-unused-vars
function buildSlideShow() {
  fetch("./data/3500.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(data)
      let mycontent = "";

      data.programs.forEach((program) => {
        console.log(program.name);
        let programpath = program.name.replace(/\+| |-/g, "_").toLowerCase();
        programpath = programpath.replace(/__/g, "_");
        const programdata = "data\\" + programpath + "_programdata.json";
        // console.log(programdata);
        const programthumb = "images\\thumbs\\" + programpath + ".webp";
        // console.log(programthumb);
        mycontent =
          mycontent +
          "<div class='container flex-wrap text-wrap slide '><a href='programinfo.html?" +
          programpath +
          "' target='_blank' rel='noopener noreferrer'> <img src='" +
          programthumb +
          "' /><br /><strong> YOLO" +
          program.name +
          "</strong></a></div>";
      });
      document.getElementById("slides").innerHTML = mycontent;
    });
}
function closeOverlay() {
  hideshowElementById("programoverlay", "hide");
  emptyElementByID("programoverlay");
  hideshowElementById("maincontent", "show");
  emptyElementByID("programoverlay");
}
function emptyElementByID(elementID) {
  try {
    document.getElementById(elementID).innerHTML = "";
  } catch (error) {
    console.log(error);
  }
}
function filterSelection(c) {
  var x, i;
  x = document.getElementsByClassName("column");
  let activebtn = document.getElementById(c);
  activebtn.classList.add("active");
  if (c == "all") c = "";
  // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
  for (i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
  }
  let buttons = document.querySelectorAll(".slidesbtn.active");
  buttons.forEach(function (button) {
    button.classList.remove("active");
  });
}
function getData(file) {
  try {
    let mycontent = "";
    let categories;
    categories =
      '<button class="slidesbtn active" onclick="filterSelection(\'all\')">All</button>';
    let usedcats = "_";

    Papa.parse(file, {
      download: true,
      header: true,
      complete: function (results) {
        results.data.forEach((program) => {
          if (program.NameofProgram) {
            if (program.Active === "Yes") {
              const programname = program.NameofProgram.toTitle();
              const programcat = program.Category;
              const programnameasurl = program.URL;
              let programcatShort = programcat.toURL();
              programcatShort = programcatShort.toURL();
              const programType = program.Type;

              if (usedcats.includes(programcatShort)) {
                /// console.log('duplicate cat found')
              } else {
                usedcats = usedcats + programcatShort;
                categories =
                  categories +
                  `<button class='slidesbtn active' onclick="filterSelection('${programcatShort}')">${programcat}</button>`; // console.log('added cat')                                        //console.log(usedcats)
              }

              mycontent = `${mycontent}<div class="column ${programcatShort} slide show"><div class="content"><button onClick="overlayprogram('${programnameasurl}','${programname}','${programType}')"> <img src="images/${programnameasurl}.webp" alt="${programname}" style="width:100%" /><h4>${programname}</h4></div></button></div></div>`;
            }
          }
        });

        document.getElementById("myslidesbtnContainer").innerHTML = categories;
        document.getElementById("slides").innerHTML = mycontent;
      },
    });
  } catch (err) {
    console.log(err);
  }
}
// Toggle element visibility
function hideshowElementById(elementID, action, x, y) {
  const element = document.getElementById(elementID);
  const classes = element.classList;
  console.log(`I have been asked to ${action} the elementID ${elementID}`);
  if (action === "hide") {
    classes.add("closed");
  } else {
    classes.remove("closed");
  }
  if (x) {
    console.log(`x postition requested ${x}`);
    element.style.left = x;
  }
  if (y) {
    console.log(`y postition requested ${y}`);
    element.style.top = y;
  }
}
function overlayprogram(programnameasurl, programname, programtype) {
  // Get Navbar bottom pos
  navbar = document.getElementById("navbar");
  window.scrollTo(0, 0);
  overlaytop = navbar.offsetHeight;
  // Show Overlay
  hideshowElementById("programoverlay", "show", null, overlaytop);

  // Hide Slideshow
  hideshowElementById("maincontent", "hide");
  hide_data_table = programsWithNoDataTable.program.includes(programnameasurl);
  // alert(`I will be sending ${hide_data_table} for hide_data_table because ${programnameasurl} is not in ${programsWithNoDataTable}`)
  othercontent = "";
  // console.log(`I sent ${programnameasurl} ${programname} ${programtype} ${hide_data_table}`);
  buildProgramPage(programnameasurl, programname, programtype, hide_data_table);
}
/* @license
Papa Parse
v5.4.1
https://github.com/mholt/PapaParse
License: MIT
*/
!(function (e, t) {
  "function" == typeof define && define.amd
    ? define([], t)
    : "object" == typeof module && "undefined" != typeof exports
      ? (module.exports = t())
      : (e.Papa = t());
})(this, function s() {
  "use strict";
  var f =
    "undefined" != typeof self
      ? self
      : "undefined" != typeof window
        ? window
        : void 0 !== f
          ? f
          : {};
  var n = !f.document && !!f.postMessage,
    o = f.IS_PAPA_WORKER || !1,
    a = {},
    u = 0,
    b = {
      parse: function (e, t) {
        var r = (t = t || {}).dynamicTyping || !1;
        J(r) && ((t.dynamicTypingFunction = r), (r = {}));
        if (
          ((t.dynamicTyping = r),
          (t.transform = !!J(t.transform) && t.transform),
          t.worker && b.WORKERS_SUPPORTED)
        ) {
          var i = (function () {
            if (!b.WORKERS_SUPPORTED) return !1;
            var e =
                ((r = f.URL || f.webkitURL || null),
                (i = s.toString()),
                b.BLOB_URL ||
                  (b.BLOB_URL = r.createObjectURL(
                    new Blob(
                      [
                        "var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ",
                        "(",
                        i,
                        ")();",
                      ],
                      { type: "text/javascript" },
                    ),
                  ))),
              t = new f.Worker(e);
            var r, i;
            return (t.onmessage = _), (t.id = u++), (a[t.id] = t);
          })();
          return (
            (i.userStep = t.step),
            (i.userChunk = t.chunk),
            (i.userComplete = t.complete),
            (i.userError = t.error),
            (t.step = J(t.step)),
            (t.chunk = J(t.chunk)),
            (t.complete = J(t.complete)),
            (t.error = J(t.error)),
            delete t.worker,
            void i.postMessage({ input: e, config: t, workerId: i.id })
          );
        }
        var n = null;
        b.NODE_STREAM_INPUT,
          "string" == typeof e
            ? ((e = (function (e) {
                if (65279 === e.charCodeAt(0)) return e.slice(1);
                return e;
              })(e)),
              (n = t.download ? new l(t) : new p(t)))
            : !0 === e.readable && J(e.read) && J(e.on)
              ? (n = new g(t))
              : ((f.File && e instanceof File) || e instanceof Object) &&
                (n = new c(t));
        return n.stream(e);
      },
      unparse: function (e, t) {
        var n = !1,
          _ = !0,
          m = ",",
          y = "\r\n",
          s = '"',
          a = s + s,
          r = !1,
          i = null,
          o = !1;
        !(function () {
          if ("object" != typeof t) return;
          "string" != typeof t.delimiter ||
            b.BAD_DELIMITERS.filter(function (e) {
              return -1 !== t.delimiter.indexOf(e);
            }).length ||
            (m = t.delimiter);
          ("boolean" == typeof t.quotes ||
            "function" == typeof t.quotes ||
            Array.isArray(t.quotes)) &&
            (n = t.quotes);
          ("boolean" != typeof t.skipEmptyLines &&
            "string" != typeof t.skipEmptyLines) ||
            (r = t.skipEmptyLines);
          "string" == typeof t.newline && (y = t.newline);
          "string" == typeof t.quoteChar && (s = t.quoteChar);
          "boolean" == typeof t.header && (_ = t.header);
          if (Array.isArray(t.columns)) {
            if (0 === t.columns.length)
              throw new Error("Option columns is empty");
            i = t.columns;
          }
          void 0 !== t.escapeChar && (a = t.escapeChar + s);
          ("boolean" == typeof t.escapeFormulae ||
            t.escapeFormulae instanceof RegExp) &&
            (o =
              t.escapeFormulae instanceof RegExp
                ? t.escapeFormulae
                : /^[=+\-@\t\r].*$/);
        })();
        var u = new RegExp(Q(s), "g");
        "string" == typeof e && (e = JSON.parse(e));
        if (Array.isArray(e)) {
          if (!e.length || Array.isArray(e[0])) return h(null, e, r);
          if ("object" == typeof e[0]) return h(i || Object.keys(e[0]), e, r);
        } else if ("object" == typeof e)
          return (
            "string" == typeof e.data && (e.data = JSON.parse(e.data)),
            Array.isArray(e.data) &&
              (e.fields || (e.fields = (e.meta && e.meta.fields) || i),
              e.fields ||
                (e.fields = Array.isArray(e.data[0])
                  ? e.fields
                  : "object" == typeof e.data[0]
                    ? Object.keys(e.data[0])
                    : []),
              Array.isArray(e.data[0]) ||
                "object" == typeof e.data[0] ||
                (e.data = [e.data])),
            h(e.fields || [], e.data || [], r)
          );
        throw new Error("Unable to serialize unrecognized input");
        function h(e, t, r) {
          var i = "";
          "string" == typeof e && (e = JSON.parse(e)),
            "string" == typeof t && (t = JSON.parse(t));
          var n = Array.isArray(e) && 0 < e.length,
            s = !Array.isArray(t[0]);
          if (n && _) {
            for (var a = 0; a < e.length; a++)
              0 < a && (i += m), (i += v(e[a], a));
            0 < t.length && (i += y);
          }
          for (var o = 0; o < t.length; o++) {
            var u = n ? e.length : t[o].length,
              h = !1,
              f = n ? 0 === Object.keys(t[o]).length : 0 === t[o].length;
            if (
              (r &&
                !n &&
                (h =
                  "greedy" === r
                    ? "" === t[o].join("").trim()
                    : 1 === t[o].length && 0 === t[o][0].length),
              "greedy" === r && n)
            ) {
              for (var d = [], l = 0; l < u; l++) {
                var c = s ? e[l] : l;
                d.push(t[o][c]);
              }
              h = "" === d.join("").trim();
            }
            if (!h) {
              for (var p = 0; p < u; p++) {
                0 < p && !f && (i += m);
                var g = n && s ? e[p] : p;
                i += v(t[o][g], p);
              }
              o < t.length - 1 && (!r || (0 < u && !f)) && (i += y);
            }
          }
          return i;
        }
        function v(e, t) {
          if (null == e) return "";
          if (e.constructor === Date) return JSON.stringify(e).slice(1, 25);
          var r = !1;
          o && "string" == typeof e && o.test(e) && ((e = "'" + e), (r = !0));
          var i = e.toString().replace(u, a);
          return (r =
            r ||
            !0 === n ||
            ("function" == typeof n && n(e, t)) ||
            (Array.isArray(n) && n[t]) ||
            (function (e, t) {
              for (var r = 0; r < t.length; r++)
                if (-1 < e.indexOf(t[r])) return !0;
              return !1;
            })(i, b.BAD_DELIMITERS) ||
            -1 < i.indexOf(m) ||
            " " === i.charAt(0) ||
            " " === i.charAt(i.length - 1))
            ? s + i + s
            : i;
        }
      },
    };
  if (
    ((b.RECORD_SEP = String.fromCharCode(30)),
    (b.UNIT_SEP = String.fromCharCode(31)),
    (b.BYTE_ORDER_MARK = "\ufeff"),
    (b.BAD_DELIMITERS = ["\r", "\n", '"', b.BYTE_ORDER_MARK]),
    (b.WORKERS_SUPPORTED = !n && !!f.Worker),
    (b.NODE_STREAM_INPUT = 1),
    (b.LocalChunkSize = 10485760),
    (b.RemoteChunkSize = 5242880),
    (b.DefaultDelimiter = ","),
    (b.Parser = E),
    (b.ParserHandle = r),
    (b.NetworkStreamer = l),
    (b.FileStreamer = c),
    (b.StringStreamer = p),
    (b.ReadableStreamStreamer = g),
    f.jQuery)
  ) {
    var d = f.jQuery;
    d.fn.parse = function (o) {
      var r = o.config || {},
        u = [];
      return (
        this.each(function (e) {
          if (
            !(
              "INPUT" === d(this).prop("tagName").toUpperCase() &&
              "file" === d(this).attr("type").toLowerCase() &&
              f.FileReader
            ) ||
            !this.files ||
            0 === this.files.length
          )
            return !0;
          for (var t = 0; t < this.files.length; t++)
            u.push({
              file: this.files[t],
              inputElem: this,
              instanceConfig: d.extend({}, r),
            });
        }),
        e(),
        this
      );
      function e() {
        if (0 !== u.length) {
          var e,
            t,
            r,
            i,
            n = u[0];
          if (J(o.before)) {
            var s = o.before(n.file, n.inputElem);
            if ("object" == typeof s) {
              if ("abort" === s.action)
                return (
                  (e = "AbortError"),
                  (t = n.file),
                  (r = n.inputElem),
                  (i = s.reason),
                  void (J(o.error) && o.error({ name: e }, t, r, i))
                );
              if ("skip" === s.action) return void h();
              "object" == typeof s.config &&
                (n.instanceConfig = d.extend(n.instanceConfig, s.config));
            } else if ("skip" === s) return void h();
          }
          var a = n.instanceConfig.complete;
          (n.instanceConfig.complete = function (e) {
            J(a) && a(e, n.file, n.inputElem), h();
          }),
            b.parse(n.file, n.instanceConfig);
        } else J(o.complete) && o.complete();
      }
      function h() {
        u.splice(0, 1), e();
      }
    };
  }
  function h(e) {
    (this._handle = null),
      (this._finished = !1),
      (this._completed = !1),
      (this._halted = !1),
      (this._input = null),
      (this._baseIndex = 0),
      (this._partialLine = ""),
      (this._rowCount = 0),
      (this._start = 0),
      (this._nextChunk = null),
      (this.isFirstChunk = !0),
      (this._completeResults = { data: [], errors: [], meta: {} }),
      function (e) {
        var t = w(e);
        (t.chunkSize = parseInt(t.chunkSize)),
          e.step || e.chunk || (t.chunkSize = null);
        (this._handle = new r(t)), ((this._handle.streamer = this)._config = t);
      }.call(this, e),
      (this.parseChunk = function (e, t) {
        if (this.isFirstChunk && J(this._config.beforeFirstChunk)) {
          var r = this._config.beforeFirstChunk(e);
          void 0 !== r && (e = r);
        }
        (this.isFirstChunk = !1), (this._halted = !1);
        var i = this._partialLine + e;
        this._partialLine = "";
        var n = this._handle.parse(i, this._baseIndex, !this._finished);
        if (!this._handle.paused() && !this._handle.aborted()) {
          var s = n.meta.cursor;
          this._finished ||
            ((this._partialLine = i.substring(s - this._baseIndex)),
            (this._baseIndex = s)),
            n && n.data && (this._rowCount += n.data.length);
          var a =
            this._finished ||
            (this._config.preview && this._rowCount >= this._config.preview);
          if (o)
            f.postMessage({ results: n, workerId: b.WORKER_ID, finished: a });
          else if (J(this._config.chunk) && !t) {
            if (
              (this._config.chunk(n, this._handle),
              this._handle.paused() || this._handle.aborted())
            )
              return void (this._halted = !0);
            (n = void 0), (this._completeResults = void 0);
          }
          return (
            this._config.step ||
              this._config.chunk ||
              ((this._completeResults.data = this._completeResults.data.concat(
                n.data,
              )),
              (this._completeResults.errors =
                this._completeResults.errors.concat(n.errors)),
              (this._completeResults.meta = n.meta)),
            this._completed ||
              !a ||
              !J(this._config.complete) ||
              (n && n.meta.aborted) ||
              (this._config.complete(this._completeResults, this._input),
              (this._completed = !0)),
            a || (n && n.meta.paused) || this._nextChunk(),
            n
          );
        }
        this._halted = !0;
      }),
      (this._sendError = function (e) {
        J(this._config.error)
          ? this._config.error(e)
          : o &&
            this._config.error &&
            f.postMessage({ workerId: b.WORKER_ID, error: e, finished: !1 });
      });
  }
  function l(e) {
    var i;
    (e = e || {}).chunkSize || (e.chunkSize = b.RemoteChunkSize),
      h.call(this, e),
      (this._nextChunk = n
        ? function () {
            this._readChunk(), this._chunkLoaded();
          }
        : function () {
            this._readChunk();
          }),
      (this.stream = function (e) {
        (this._input = e), this._nextChunk();
      }),
      (this._readChunk = function () {
        if (this._finished) this._chunkLoaded();
        else {
          if (
            ((i = new XMLHttpRequest()),
            this._config.withCredentials &&
              (i.withCredentials = this._config.withCredentials),
            n ||
              ((i.onload = v(this._chunkLoaded, this)),
              (i.onerror = v(this._chunkError, this))),
            i.open(
              this._config.downloadRequestBody ? "POST" : "GET",
              this._input,
              !n,
            ),
            this._config.downloadRequestHeaders)
          ) {
            var e = this._config.downloadRequestHeaders;
            for (var t in e) i.setRequestHeader(t, e[t]);
          }
          if (this._config.chunkSize) {
            var r = this._start + this._config.chunkSize - 1;
            i.setRequestHeader("Range", "bytes=" + this._start + "-" + r);
          }
          try {
            i.send(this._config.downloadRequestBody);
          } catch (e) {
            this._chunkError(e.message);
          }
          n && 0 === i.status && this._chunkError();
        }
      }),
      (this._chunkLoaded = function () {
        4 === i.readyState &&
          (i.status < 200 || 400 <= i.status
            ? this._chunkError()
            : ((this._start += this._config.chunkSize
                ? this._config.chunkSize
                : i.responseText.length),
              (this._finished =
                !this._config.chunkSize ||
                this._start >=
                  (function (e) {
                    var t = e.getResponseHeader("Content-Range");
                    if (null === t) return -1;
                    return parseInt(t.substring(t.lastIndexOf("/") + 1));
                  })(i)),
              this.parseChunk(i.responseText)));
      }),
      (this._chunkError = function (e) {
        var t = i.statusText || e;
        this._sendError(new Error(t));
      });
  }
  function c(e) {
    var i, n;
    (e = e || {}).chunkSize || (e.chunkSize = b.LocalChunkSize),
      h.call(this, e);
    var s = "undefined" != typeof FileReader;
    (this.stream = function (e) {
      (this._input = e),
        (n = e.slice || e.webkitSlice || e.mozSlice),
        s
          ? (((i = new FileReader()).onload = v(this._chunkLoaded, this)),
            (i.onerror = v(this._chunkError, this)))
          : (i = new FileReaderSync()),
        this._nextChunk();
    }),
      (this._nextChunk = function () {
        this._finished ||
          (this._config.preview && !(this._rowCount < this._config.preview)) ||
          this._readChunk();
      }),
      (this._readChunk = function () {
        var e = this._input;
        if (this._config.chunkSize) {
          var t = Math.min(
            this._start + this._config.chunkSize,
            this._input.size,
          );
          e = n.call(e, this._start, t);
        }
        var r = i.readAsText(e, this._config.encoding);
        s || this._chunkLoaded({ target: { result: r } });
      }),
      (this._chunkLoaded = function (e) {
        (this._start += this._config.chunkSize),
          (this._finished =
            !this._config.chunkSize || this._start >= this._input.size),
          this.parseChunk(e.target.result);
      }),
      (this._chunkError = function () {
        this._sendError(i.error);
      });
  }
  function p(e) {
    var r;
    h.call(this, (e = e || {})),
      (this.stream = function (e) {
        return (r = e), this._nextChunk();
      }),
      (this._nextChunk = function () {
        if (!this._finished) {
          var e,
            t = this._config.chunkSize;
          return (
            t
              ? ((e = r.substring(0, t)), (r = r.substring(t)))
              : ((e = r), (r = "")),
            (this._finished = !r),
            this.parseChunk(e)
          );
        }
      });
  }
  function g(e) {
    h.call(this, (e = e || {}));
    var t = [],
      r = !0,
      i = !1;
    (this.pause = function () {
      h.prototype.pause.apply(this, arguments), this._input.pause();
    }),
      (this.resume = function () {
        h.prototype.resume.apply(this, arguments), this._input.resume();
      }),
      (this.stream = function (e) {
        (this._input = e),
          this._input.on("data", this._streamData),
          this._input.on("end", this._streamEnd),
          this._input.on("error", this._streamError);
      }),
      (this._checkIsFinished = function () {
        i && 1 === t.length && (this._finished = !0);
      }),
      (this._nextChunk = function () {
        this._checkIsFinished(),
          t.length ? this.parseChunk(t.shift()) : (r = !0);
      }),
      (this._streamData = v(function (e) {
        try {
          t.push("string" == typeof e ? e : e.toString(this._config.encoding)),
            r &&
              ((r = !1), this._checkIsFinished(), this.parseChunk(t.shift()));
        } catch (e) {
          this._streamError(e);
        }
      }, this)),
      (this._streamError = v(function (e) {
        this._streamCleanUp(), this._sendError(e);
      }, this)),
      (this._streamEnd = v(function () {
        this._streamCleanUp(), (i = !0), this._streamData("");
      }, this)),
      (this._streamCleanUp = v(function () {
        this._input.removeListener("data", this._streamData),
          this._input.removeListener("end", this._streamEnd),
          this._input.removeListener("error", this._streamError);
      }, this));
  }
  function r(m) {
    var a,
      o,
      u,
      i = Math.pow(2, 53),
      n = -i,
      s = /^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/,
      h =
        /^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/,
      t = this,
      r = 0,
      f = 0,
      d = !1,
      e = !1,
      l = [],
      c = { data: [], errors: [], meta: {} };
    if (J(m.step)) {
      var p = m.step;
      m.step = function (e) {
        if (((c = e), _())) g();
        else {
          if ((g(), 0 === c.data.length)) return;
          (r += e.data.length),
            m.preview && r > m.preview
              ? o.abort()
              : ((c.data = c.data[0]), p(c, t));
        }
      };
    }
    function y(e) {
      return "greedy" === m.skipEmptyLines
        ? "" === e.join("").trim()
        : 1 === e.length && 0 === e[0].length;
    }
    function g() {
      return (
        c &&
          u &&
          (k(
            "Delimiter",
            "UndetectableDelimiter",
            "Unable to auto-detect delimiting character; defaulted to '" +
              b.DefaultDelimiter +
              "'",
          ),
          (u = !1)),
        m.skipEmptyLines &&
          (c.data = c.data.filter(function (e) {
            return !y(e);
          })),
        _() &&
          (function () {
            if (!c) return;
            function e(e, t) {
              J(m.transformHeader) && (e = m.transformHeader(e, t)), l.push(e);
            }
            if (Array.isArray(c.data[0])) {
              for (var t = 0; _() && t < c.data.length; t++)
                c.data[t].forEach(e);
              c.data.splice(0, 1);
            } else c.data.forEach(e);
          })(),
        (function () {
          if (!c || (!m.header && !m.dynamicTyping && !m.transform)) return c;
          function e(e, t) {
            var r,
              i = m.header ? {} : [];
            for (r = 0; r < e.length; r++) {
              var n = r,
                s = e[r];
              m.header && (n = r >= l.length ? "__parsed_extra" : l[r]),
                m.transform && (s = m.transform(s, n)),
                (s = v(n, s)),
                "__parsed_extra" === n
                  ? ((i[n] = i[n] || []), i[n].push(s))
                  : (i[n] = s);
            }
            return (
              m.header &&
                (r > l.length
                  ? k(
                      "FieldMismatch",
                      "TooManyFields",
                      "Too many fields: expected " +
                        l.length +
                        " fields but parsed " +
                        r,
                      f + t,
                    )
                  : r < l.length &&
                    k(
                      "FieldMismatch",
                      "TooFewFields",
                      "Too few fields: expected " +
                        l.length +
                        " fields but parsed " +
                        r,
                      f + t,
                    )),
              i
            );
          }
          var t = 1;
          !c.data.length || Array.isArray(c.data[0])
            ? ((c.data = c.data.map(e)), (t = c.data.length))
            : (c.data = e(c.data, 0));
          m.header && c.meta && (c.meta.fields = l);
          return (f += t), c;
        })()
      );
    }
    function _() {
      return m.header && 0 === l.length;
    }
    function v(e, t) {
      return (
        (r = e),
        m.dynamicTypingFunction &&
          void 0 === m.dynamicTyping[r] &&
          (m.dynamicTyping[r] = m.dynamicTypingFunction(r)),
        !0 === (m.dynamicTyping[r] || m.dynamicTyping)
          ? "true" === t ||
            "TRUE" === t ||
            ("false" !== t &&
              "FALSE" !== t &&
              ((function (e) {
                if (s.test(e)) {
                  var t = parseFloat(e);
                  if (n < t && t < i) return !0;
                }
                return !1;
              })(t)
                ? parseFloat(t)
                : h.test(t)
                  ? new Date(t)
                  : "" === t
                    ? null
                    : t))
          : t
      );
      var r;
    }
    function k(e, t, r, i) {
      var n = { type: e, code: t, message: r };
      void 0 !== i && (n.row = i), c.errors.push(n);
    }
    (this.parse = function (e, t, r) {
      var i = m.quoteChar || '"';
      if (
        (m.newline ||
          (m.newline = (function (e, t) {
            e = e.substring(0, 1048576);
            var r = new RegExp(Q(t) + "([^]*?)" + Q(t), "gm"),
              i = (e = e.replace(r, "")).split("\r"),
              n = e.split("\n"),
              s = 1 < n.length && n[0].length < i[0].length;
            if (1 === i.length || s) return "\n";
            for (var a = 0, o = 0; o < i.length; o++) "\n" === i[o][0] && a++;
            return a >= i.length / 2 ? "\r\n" : "\r";
          })(e, i)),
        (u = !1),
        m.delimiter)
      )
        J(m.delimiter) &&
          ((m.delimiter = m.delimiter(e)), (c.meta.delimiter = m.delimiter));
      else {
        var n = (function (e, t, r, i, n) {
          var s, a, o, u;
          n = n || [",", "\t", "|", ";", b.RECORD_SEP, b.UNIT_SEP];
          for (var h = 0; h < n.length; h++) {
            var f = n[h],
              d = 0,
              l = 0,
              c = 0;
            o = void 0;
            for (
              var p = new E({
                  comments: i,
                  delimiter: f,
                  newline: t,
                  preview: 10,
                }).parse(e),
                g = 0;
              g < p.data.length;
              g++
            )
              if (r && y(p.data[g])) c++;
              else {
                var _ = p.data[g].length;
                (l += _),
                  void 0 !== o
                    ? 0 < _ && ((d += Math.abs(_ - o)), (o = _))
                    : (o = _);
              }
            0 < p.data.length && (l /= p.data.length - c),
              (void 0 === a || d <= a) &&
                (void 0 === u || u < l) &&
                1.99 < l &&
                ((a = d), (s = f), (u = l));
          }
          return { successful: !!(m.delimiter = s), bestDelimiter: s };
        })(e, m.newline, m.skipEmptyLines, m.comments, m.delimitersToGuess);
        n.successful
          ? (m.delimiter = n.bestDelimiter)
          : ((u = !0), (m.delimiter = b.DefaultDelimiter)),
          (c.meta.delimiter = m.delimiter);
      }
      var s = w(m);
      return (
        m.preview && m.header && s.preview++,
        (a = e),
        (o = new E(s)),
        (c = o.parse(a, t, r)),
        g(),
        d ? { meta: { paused: !0 } } : c || { meta: { paused: !1 } }
      );
    }),
      (this.paused = function () {
        return d;
      }),
      (this.pause = function () {
        (d = !0),
          o.abort(),
          (a = J(m.chunk) ? "" : a.substring(o.getCharIndex()));
      }),
      (this.resume = function () {
        t.streamer._halted
          ? ((d = !1), t.streamer.parseChunk(a, !0))
          : setTimeout(t.resume, 3);
      }),
      (this.aborted = function () {
        return e;
      }),
      (this.abort = function () {
        (e = !0),
          o.abort(),
          (c.meta.aborted = !0),
          J(m.complete) && m.complete(c),
          (a = "");
      });
  }
  function Q(e) {
    return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function E(j) {
    var z,
      M = (j = j || {}).delimiter,
      P = j.newline,
      U = j.comments,
      q = j.step,
      N = j.preview,
      B = j.fastMode,
      K = (z =
        void 0 === j.quoteChar || null === j.quoteChar ? '"' : j.quoteChar);
    if (
      (void 0 !== j.escapeChar && (K = j.escapeChar),
      ("string" != typeof M || -1 < b.BAD_DELIMITERS.indexOf(M)) && (M = ","),
      U === M)
    )
      throw new Error("Comment character same as delimiter");
    !0 === U
      ? (U = "#")
      : ("string" != typeof U || -1 < b.BAD_DELIMITERS.indexOf(U)) && (U = !1),
      "\n" !== P && "\r" !== P && "\r\n" !== P && (P = "\n");
    var W = 0,
      H = !1;
    (this.parse = function (i, t, r) {
      if ("string" != typeof i) throw new Error("Input must be a string");
      var n = i.length,
        e = M.length,
        s = P.length,
        a = U.length,
        o = J(q),
        u = [],
        h = [],
        f = [],
        d = (W = 0);
      if (!i) return L();
      if (j.header && !t) {
        var l = i.split(P)[0].split(M),
          c = [],
          p = {},
          g = !1;
        for (var _ in l) {
          var m = l[_];
          J(j.transformHeader) && (m = j.transformHeader(m, _));
          var y = m,
            v = p[m] || 0;
          for (
            0 < v && ((g = !0), (y = m + "_" + v)), p[m] = v + 1;
            c.includes(y);

          )
            y = y + "_" + v;
          c.push(y);
        }
        if (g) {
          var k = i.split(P);
          (k[0] = c.join(M)), (i = k.join(P));
        }
      }
      if (B || (!1 !== B && -1 === i.indexOf(z))) {
        for (var b = i.split(P), E = 0; E < b.length; E++) {
          if (((f = b[E]), (W += f.length), E !== b.length - 1)) W += P.length;
          else if (r) return L();
          if (!U || f.substring(0, a) !== U) {
            if (o) {
              if (((u = []), I(f.split(M)), F(), H)) return L();
            } else I(f.split(M));
            if (N && N <= E) return (u = u.slice(0, N)), L(!0);
          }
        }
        return L();
      }
      for (
        var w = i.indexOf(M, W),
          R = i.indexOf(P, W),
          C = new RegExp(Q(K) + Q(z), "g"),
          S = i.indexOf(z, W);
        ;

      )
        if (i[W] !== z)
          if (U && 0 === f.length && i.substring(W, W + a) === U) {
            if (-1 === R) return L();
            (W = R + s), (R = i.indexOf(P, W)), (w = i.indexOf(M, W));
          } else if (-1 !== w && (w < R || -1 === R))
            f.push(i.substring(W, w)), (W = w + e), (w = i.indexOf(M, W));
          else {
            if (-1 === R) break;
            if ((f.push(i.substring(W, R)), D(R + s), o && (F(), H)))
              return L();
            if (N && u.length >= N) return L(!0);
          }
        else
          for (S = W, W++; ; ) {
            if (-1 === (S = i.indexOf(z, S + 1)))
              return (
                r ||
                  h.push({
                    type: "Quotes",
                    code: "MissingQuotes",
                    message: "Quoted field unterminated",
                    row: u.length,
                    index: W,
                  }),
                T()
              );
            if (S === n - 1) return T(i.substring(W, S).replace(C, z));
            if (z !== K || i[S + 1] !== K) {
              if (z === K || 0 === S || i[S - 1] !== K) {
                -1 !== w && w < S + 1 && (w = i.indexOf(M, S + 1)),
                  -1 !== R && R < S + 1 && (R = i.indexOf(P, S + 1));
                var O = A(-1 === R ? w : Math.min(w, R));
                if (i.substr(S + 1 + O, e) === M) {
                  f.push(i.substring(W, S).replace(C, z)),
                    i[(W = S + 1 + O + e)] !== z && (S = i.indexOf(z, W)),
                    (w = i.indexOf(M, W)),
                    (R = i.indexOf(P, W));
                  break;
                }
                var x = A(R);
                if (i.substring(S + 1 + x, S + 1 + x + s) === P) {
                  if (
                    (f.push(i.substring(W, S).replace(C, z)),
                    D(S + 1 + x + s),
                    (w = i.indexOf(M, W)),
                    (S = i.indexOf(z, W)),
                    o && (F(), H))
                  )
                    return L();
                  if (N && u.length >= N) return L(!0);
                  break;
                }
                h.push({
                  type: "Quotes",
                  code: "InvalidQuotes",
                  message: "Trailing quote on quoted field is malformed",
                  row: u.length,
                  index: W,
                }),
                  S++;
              }
            } else S++;
          }
      return T();
      function I(e) {
        u.push(e), (d = W);
      }
      function A(e) {
        var t = 0;
        if (-1 !== e) {
          var r = i.substring(S + 1, e);
          r && "" === r.trim() && (t = r.length);
        }
        return t;
      }
      function T(e) {
        return (
          r ||
            (void 0 === e && (e = i.substring(W)),
            f.push(e),
            (W = n),
            I(f),
            o && F()),
          L()
        );
      }
      function D(e) {
        (W = e), I(f), (f = []), (R = i.indexOf(P, W));
      }
      function L(e) {
        return {
          data: u,
          errors: h,
          meta: {
            delimiter: M,
            linebreak: P,
            aborted: H,
            truncated: !!e,
            cursor: d + (t || 0),
          },
        };
      }
      function F() {
        q(L()), (u = []), (h = []);
      }
    }),
      (this.abort = function () {
        H = !0;
      }),
      (this.getCharIndex = function () {
        return W;
      });
  }
  function _(e) {
    var t = e.data,
      r = a[t.workerId],
      i = !1;
    if (t.error) r.userError(t.error, t.file);
    else if (t.results && t.results.data) {
      var n = {
        abort: function () {
          (i = !0),
            m(t.workerId, { data: [], errors: [], meta: { aborted: !0 } });
        },
        pause: y,
        resume: y,
      };
      if (J(r.userStep)) {
        for (
          var s = 0;
          s < t.results.data.length &&
          (r.userStep(
            {
              data: t.results.data[s],
              errors: t.results.errors,
              meta: t.results.meta,
            },
            n,
          ),
          !i);
          s++
        );
        delete t.results;
      } else
        J(r.userChunk) && (r.userChunk(t.results, n, t.file), delete t.results);
    }
    t.finished && !i && m(t.workerId, t.results);
  }
  function m(e, t) {
    var r = a[e];
    J(r.userComplete) && r.userComplete(t), r.terminate(), delete a[e];
  }
  function y() {
    throw new Error("Not implemented.");
  }
  function w(e) {
    if ("object" != typeof e || null === e) return e;
    var t = Array.isArray(e) ? [] : {};
    for (var r in e) t[r] = w(e[r]);
    return t;
  }
  function v(e, t) {
    return function () {
      e.apply(t, arguments);
    };
  }
  function J(e) {
    return "function" == typeof e;
  }
  return (
    o &&
      (f.onmessage = function (e) {
        var t = e.data;
        void 0 === b.WORKER_ID && t && (b.WORKER_ID = t.workerId);
        if ("string" == typeof t.input)
          f.postMessage({
            workerId: b.WORKER_ID,
            results: b.parse(t.input, t.config),
            finished: !0,
          });
        else if (
          (f.File && t.input instanceof File) ||
          t.input instanceof Object
        ) {
          var r = b.parse(t.input, t.config);
          r &&
            f.postMessage({ workerId: b.WORKER_ID, results: r, finished: !0 });
        }
      }),
    ((l.prototype = Object.create(h.prototype)).constructor = l),
    ((c.prototype = Object.create(h.prototype)).constructor = c),
    ((p.prototype = Object.create(p.prototype)).constructor = p),
    ((g.prototype = Object.create(h.prototype)).constructor = g),
    b
  );
});
String.prototype.toTitle = function () {
  let thistoo;
  thistoo = this.replaceAll(/cert\./gi, "Certification");
  thistoo = thistoo.replaceAll(/mcsa/gi, "Microsoft");
  thistoo = thistoo.replaceAll(/addction/gi, "Addictions");
  thistoo = thistoo.replaceAll(/W\//gi, "With");
  return thistoo.replace(/(^|\s)\S/g, function (t) {
    return t.toUpperCase();
  });
};

String.prototype.toURL = function () {
  const regex = /\+|\s|certificate|diploma|__|\/|\.|_z|:|\-|\(|\)|&plus;/gi;
  const regex2 = /_$|__/gi;
  const regex3 = /_$/gi;
  const regex4 = /^\s+|\s+$|\s+(?=\s)/g;
  const regex5 = /__/gi;
  let thistoo;
  thistoo = this.replaceAll(regex, "_");
  thistoo = thistoo.replaceAll(regex2, "_");
  thistoo = thistoo.replace(regex3, " ");
  thistoo = thistoo.replace(regex4, "");
  return thistoo.replace(regex5, "_").toLowerCase();
};

String.prototype.toNumber = function () {
  return this.replace(/\$|\,/gm, "");
};
/* eslint-disable no-unused-vars */
function toCAD(t, e) {
  try {
    return `$${t.toLocaleString("en-US", {
      style: "decimal",
      maximumFractionDigits: 0,
    })}`;
  } catch (t) {
    return " ";
  }
}
function w3AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {
      element.className += " " + arr2[i];
    }
  }
}
function w3RemoveClass(element, name) {
  element.classList.remove(name);
}
