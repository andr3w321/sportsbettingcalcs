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
  document.getElementsByName('euro_odds')[0].value = parseFloat(document.getElementsByName('euro_odds')[0].value).toFixed(4);

}

function convert_euro_to_us(euro) {
  if(euro > 2)
    var us = 100 * (euro - 1);
  else
    var us = -100 / (euro - 1);
  us = parseFloat(us).toFixed(2);
  if (us > 0)
    us = "+" + us;
  return us;
}

function convert_us_to_euro(us) {
  if(us > 0)
    var euro = ((us / 100) + 1);
  else
    var euro = ((-100 / us) + 1);
  return euro;
}

function convert_euro_to_win_per(euro) {
  var win_per = 1 / euro * 100.0;
  return parseFloat(win_per).toFixed(2) + "%"
}

function convert_win_per_to_euro(win_per) {
  var euro = 1 / (win_per / 100.0);
  return euro;
}

function convert_euro_to_fractional(euro) {
  // convert to rounded us odds then back to decimal to avoid strange fractions on rounding errors
  var us = convert_euro_to_us(euro);
  us = parseFloat(us).toFixed(0);
  euro = convert_us_to_euro(us);
  // now convert to fractional
  var f = new Fraction(euro - 1.0);
  return f.n + "/" + f.d;
}

function convert_fractional_to_euro(fractional) {
  var f = new Fraction(fractional);
  return (f.n / f.d + 1);
}

/* ROI Calculator */
function showUSOdds(inputField) {
  document.getElementById('roi_us_odds').innerHTML = "(" + convert_euro_to_us(inputField.value) + ")";
}

function calcRoiFromWinPer(inputField) {
 var win_per = parseFloat(inputField.value) / 100.0;
 var euro_odds = document.getElementsByName('roi_euro_odds')[0].value;
 var roi = win_per * euro_odds - 1;
 document.getElementsByName('roi_roi')[0].value = parseFloat(roi * 100.0).toFixed(2) + "%";
 inputField.value = parseFloat(win_per * 100.0).toFixed(2) + "%";
}

function calcWinPerFromRoi(inputField) {
  var roi = parseFloat(inputField.value) / 100.0;
  var euro_odds = document.getElementsByName('roi_euro_odds')[0].value;
  var win_per = (roi + 1) / euro_odds;
  document.getElementsByName('roi_win_per')[0].value = parseFloat(win_per * 100.0).toFixed(2) + "%";
  inputField.value = parseFloat(roi * 100.0).toFixed(2) + "%";
}
