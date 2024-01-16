var langleyKey = "ENPycLbv18g8";
var abbotsfordKey = "Vsv98l7AxT3o";

function generateLink(query) {
  var link = "https://www.enrichedacademy.com/users/autologin?token=";
  var suffix = "&indicator=0&host=aolccbc.com";

  var params = query.split("&").reduce((result, param) => {
    if (param.indexOf("=") === -1) {
      return result;
    }
    var [key, value] = param.split("=");
    if (result.hasOwnProperty(key)) {
      if (Array.isArray(result[key])) {
        result[key].push(value);
      } else {
        result[key] = [result[key], value];
      }
    } else {
      result[key] = value;
    }
    return result;
  }, {});

  var token = params.campus === "abbotsford" ? abbotsfordKey : langleyKey;

  var finalURL =
    link +
    token +
    "&fname=" +
    params.fname +
    "&lname=" +
    params.lname +
    "&email=" +
    params.email +
    suffix;
  return finalURL;
}

function generateEmail() {
  var fname = document.getElementById("fname").value;
  var lname = document.getElementById("lname").value;
  var email = document.getElementById("email").value;
  var campus = document.getElementById("campus").value;

  var page = window.location.hostname === "aolccbc.com" ? "ea" : "ea.html";
  var genLink =
    window.location.protocol +
    "//" +
    window.location.hostname +
    "/" +
    page +
    "?fname=" +
    fname +
    "&lname=" +
    lname +
    "&email=" +
    email +
    "&campus=" +
    campus;
  var emailBody = `Hello ${fname},\n\nAs part of your Thought Patterns for a Successful career, you have been invited to the Enriched Academy course. Click this link to access the course: <a href="${genLink}">${genLink}</a>\n\nPlease watch the orientation videos and then click the link on the page to start your course.\n\nThis course must be completed as well as the Thought Patterns course in myAOLCC in 20 hours of study.\n\nPlease let us know if you have issues accessing the course.`;
  return (document.getElementById("emailcontent").textContent = emailBody);
}

function copyEmailContentToClipboard() {
  var emailContent = generateEmail();
  navigator.clipboard.writeText(emailContent);
  alert(
    "Copied the code, now compose a message to the student in Campus Login, go into source mode and paste at the top of the email. You can click on source again to see how the email looks",
  );
}
