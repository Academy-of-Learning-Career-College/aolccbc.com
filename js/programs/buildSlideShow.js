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
