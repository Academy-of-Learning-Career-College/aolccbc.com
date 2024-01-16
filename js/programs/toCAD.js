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
