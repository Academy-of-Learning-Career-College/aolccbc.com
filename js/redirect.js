var url2Process = window.location.pathname;
var patharray = url2Process.split( '/' );
var urlPT1 = 'https://www5.campuslogin.com/Contacts/admin/ViewContactDetails.aspx?mid=10401002&ContactID='
var urlPT3 = '&ContactType=p'
// remove '.tv' or '.movie' or '.whatever' from the end
var code_id_array = patharray[1].split('.');
var code_id = code_id_array[0];

// redirect

// https://www5.campuslogin.com/Contacts/admin/ViewContactDetails.aspx?mid=10401002&ContactID=383452
window.location = urlPT1 + code_id + urlPT3;
