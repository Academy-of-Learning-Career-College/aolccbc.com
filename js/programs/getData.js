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
