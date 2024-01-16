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
