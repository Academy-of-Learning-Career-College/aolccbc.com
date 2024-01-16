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
