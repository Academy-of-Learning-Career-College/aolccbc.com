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
