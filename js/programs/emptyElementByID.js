function emptyElementByID(elementID) {
  try {
    document.getElementById(elementID).innerHTML = "";
  } catch (error) {
    console.log(error);
  }
}
