import("https://cdnjs.cloudflare.com/ajax/libs/currencyformatter.js/2.2.0/currencyFormatter.min.js")
import("//code.jquery.com/jquery-3.5.1.min.js");
var parameters = {
    currency: 'CAD', // If currency is not supplied, defaults to USD
    symbol: '$', // Overrides the currency's default symbol
    locale: 'en', // Overrides the currency's default locale (see supported locales)
    decimal: '.', // Overrides the locale's decimal character
    group: ',', // Overrides the locale's group character (thousand separator)
    pattern: '!#,##0' // Overrides the locale's default display pattern

    // The pattern follows standard unicode currency pattern notation.
    // comma = group separator, dot = decimal separator, exclamation = currency symbol
}


jquery.get('dtuition.html', function(data) {
    document.getElementById('dtuition').innerHTML = OSREC.CurrencyFormatter.format(data, parameters);
    var internationaltuitionpreformatted = (data * 1.30); document.getElementById('ituition').innerHTML = OSREC.CurrencyFormatter.format(internationaltuitionpreformatted, parameters);
});




