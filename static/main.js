/* Odds Converter */
function convertOdds(inputField) {
  // set euro odds
  if (inputField.name == "us_odds") {
    document.getElementsByName('euro_odds')[0].value = convert_us_to_euro(inputField.value);
  } else if (inputField.name == "fractional_odds") {
    document.getElementsByName('euro_odds')[0].value = convert_fractional_to_euro(inputField.value)
  } else if (inputField.name == "win_per") {
    document.getElementsByName('euro_odds')[0].value = convert_win_per_to_euro(inputField.value);
  }
  var euro_odds = document.getElementsByName('euro_odds')[0].value;

  // then set all other odds
  document.getElementsByName('us_odds')[0].value = convert_euro_to_us(euro_odds);
  document.getElementsByName('fractional_odds')[0].value = convert_euro_to_fractional(euro_odds);
  document.getElementsByName('win_per')[0].value = convert_euro_to_win_per(euro_odds);

  // fix euro decimals places
  document.getElementsByName('euro_odds')[0].value = parseFloat(document.getElementsByName('euro_odds')[0].value).toFixed(3);

}

function convert_euro_to_us(euro) {
  if(euro > 2)
    us = 100 * (euro - 1);
  else
    us = -100 / (euro - 1);
  us = parseFloat(us).toFixed(0);
  if (us > 0)
    us = "+" + us;
  return us;
}

function convert_us_to_euro(us) {
  if(us > 0)
    euro = ((us / 100) + 1);
  else
    euro = ((-100 / us) + 1);
  return euro;
}

function convert_euro_to_win_per(euro) {
  win_per = 1 / euro * 100.0;
  return parseFloat(win_per).toFixed(2) + "%"
}

function convert_win_per_to_euro(win_per) {
  euro = 1 / (win_per / 100.0);
  return euro;
}

function convert_euro_to_fractional(euro) {
  var f = new Fraction(euro - 1.0);
  return f.n + "/" + f.d;
}

function convert_fractional_to_euro(fractional) {
  var f = new Fraction(fractional);
  return (f.n / f.d + 1)
}
