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
