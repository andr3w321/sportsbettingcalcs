// collapse navbar after click
$(document).on('click','.navbar-collapse.in',function(e) {
    if( $(e.target).is('a') ) {
        $(this).collapse('hide');
    }
});

var API_URL = "http://andr3w321.pythonanywhere.com";

function isNumeric(num) {
    return !isNaN(num);
}

/* Odds Converter */
function convert_euro_to_us(euro) {
  if(euro > 2)
    var us = 100 * (euro - 1);
  else
    var us = -100 / (euro - 1);
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
  return parseFloat(win_per).toFixed(2) + "%";
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

function prettifyUsOdds(us) {
  us = parseFloat(us).toFixed(2);
  if (us > 0)
    us = "+" + us;
  return us;
}

function prettifyEuroOdds(euro) {
  euro = parseFloat(euro).toFixed(4);
  return euro;
}

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
  document.getElementsByName('us_odds')[0].value = prettifyUsOdds(convert_euro_to_us(euro_odds));
  document.getElementsByName('fractional_odds')[0].value = convert_euro_to_fractional(euro_odds);
  document.getElementsByName('win_per')[0].value = convert_euro_to_win_per(euro_odds);

  // fix euro decimals places
  document.getElementsByName('euro_odds')[0].value = prettifyEuroOdds(document.getElementsByName('euro_odds')[0].value);

}


/* ROI Calculator */
function showUSOdds(inputField, outputField) {
  document.getElementById(outputField).innerHTML = "(" + prettifyUsOdds(convert_euro_to_us(inputField.value)) + ")";
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

/* Kelly Calculator */
function calcKelly() {
  var multiplier = parseFloat(document.getElementsByName('kelly_multiplier')[0].value);
  var euro_odds = parseFloat(document.getElementsByName('kelly_euro_odds')[0].value);
  var win_per = parseFloat(document.getElementsByName('kelly_win_per')[0].value) / 100.0;
  if (isNumeric(multiplier) && isNumeric(euro_odds) && isNumeric(win_per)) {
    var b = euro_odds - 1;
    var p = win_per;
    var q = 1 - win_per;
    var f = (b * p - q ) / b * multiplier;
    document.getElementById('kelly_fraction').innerHTML = parseFloat(f * 100.0).toFixed(2) + "%";
    document.getElementsByName('kelly_win_per')[0].value = parseFloat(win_per * 100.0).toFixed(2) + "%";
  }
}

/* Vig Free Calculator */

function setEuroOdds(inputField, outputField) {
  var euro = convert_us_to_euro(inputField.value);
  document.getElementsByName(outputField)[0].value = parseFloat(euro).toFixed(4);
  inputField.value = prettifyUsOdds(inputField.value);
}

function setUsOdds(inputField, outputField) {
  var us = convert_euro_to_us(inputField.value);
  document.getElementsByName(outputField)[0].value = prettifyUsOdds(us);
  inputField.value = prettifyEuroOdds(inputField.value);
}

function getLaidAmount(us_odds) {
  if (us_odds > 0) {
    return 100.0;
  } else {
    return Math.abs(us_odds);
  }
}

function getPayoutAmount(us_odds) {
  if (us_odds > 0) {
    return Math.abs(us_odds);
  } else {
    return 100.0;
  }
}

function calcVigFree() {
  var euroa = parseFloat(document.getElementsByName('vigfree_teama_euro_odds')[0].value);
  var eurob = parseFloat(document.getElementsByName('vigfree_teamb_euro_odds')[0].value);

  var usa = parseFloat(document.getElementsByName('vigfree_teama_us_odds')[0].value);
  var usb = parseFloat(document.getElementsByName('vigfree_teamb_us_odds')[0].value);

  if (isNumeric(euroa) && isNumeric(eurob) && isNumeric(usa) && isNumeric(usb)) {
    var breakevena = 1.0 / euroa;
    var breakevenb = 1.0 / eurob;
    var total_per = breakevena + breakevenb;
    var true_win_pera = breakevena / total_per;
    var true_win_perb = breakevenb / total_per;
    document.getElementById('vigfree_teama_implied_win_per').innerHTML = parseFloat(true_win_pera * 100.0).toFixed(2) + "%";
    document.getElementById('vigfree_teamb_implied_win_per').innerHTML = parseFloat(true_win_perb * 100.0).toFixed(2) + "%";


    var vigfree_euroa = 1.0 / true_win_pera;
    var vigfree_eurob = 1.0 / true_win_perb;
    document.getElementById('vigfree_teama_euro_odds').innerHTML = prettifyEuroOdds(vigfree_euroa);
    document.getElementById('vigfree_teamb_euro_odds').innerHTML = prettifyEuroOdds(vigfree_eurob);

    var vigfree_usa = convert_euro_to_us(vigfree_euroa);
    var vigfree_usb = convert_euro_to_us(vigfree_eurob);

    document.getElementById('vigfree_teama_us_odds').innerHTML = prettifyUsOdds(vigfree_usa);
    document.getElementById('vigfree_teamb_us_odds').innerHTML = prettifyUsOdds(vigfree_usb);

    // vig calc
    var total_bet = getLaidAmount(usa) + getLaidAmount(usb);
    var viga = total_bet - getPayoutAmount(usa) - getLaidAmount(usa);
    var vigb = total_bet - getPayoutAmount(usb) - getLaidAmount(usb);
    var vig = ( true_win_pera * viga + true_win_perb * vigb ) / total_bet;
    document.getElementById('vigfree_vig').innerHTML = parseFloat(vig * 100.0).toFixed(2) + "%";
  }
}

/* Confidence Interval Calculator */
function setCI(confidence_level, n, proportion) {
  var xhr = new XMLHttpRequest();
  var url = API_URL + "/get_t_value/" + "confidence_level=" + confidence_level.toString() + "&n=" + n.toString();
  xhr.open("GET", url, true);
  xhr.onload = function (e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        // get and set the t_value
        var t_value = parseFloat(xhr.responseText);
        document.getElementById('ci_t_value').innerHTML = t_value.toFixed(2).toString();
        
        // set std dev
        var std_dev = Math.sqrt(proportion * (1 - proportion) / n);
        document.getElementById('ci_std_dev').innerHTML = parseFloat(std_dev * 100.0).toFixed(2) + "%";

        // set the confidence interval
        var range = t_value * std_dev;
        var lower_bound = proportion - range;
        var lower_bound_str = parseFloat(lower_bound * 100.0).toFixed(2).toString() + "%";
        var upper_bound = proportion + range;
        var upper_bound_str = parseFloat(upper_bound * 100.0).toFixed(2).toString() + "%";
        document.getElementById('ci_range').innerHTML = lower_bound_str + " - " + upper_bound_str;
      } else {
        document.getElementById('ci_t_value').innerHTML = xhr.statusText;
      }
    }
  };
  xhr.onerror = function (e) {
    document.getElementById('ci_t_value').innerHTML = "API Error: " + xhr.statusText;
  };
  xhr.send();
}

function calcCI() {
  var wins = parseInt(document.getElementsByName('ci_wins')[0].value);
  var losses = parseInt(document.getElementsByName('ci_losses')[0].value);
  var total_bets = wins + losses;
  document.getElementById('ci_total_bets').innerHTML = total_bets;
  var win_per = wins * 1.0 / total_bets;
  document.getElementById('ci_win_per').innerHTML = parseFloat(win_per * 100.0).toFixed(2) + "%";
  var confidence_level = parseFloat(document.getElementsByName('ci_level')[0].value) / 100.0;
  document.getElementsByName('ci_level')[0].value = parseFloat(confidence_level * 100.0).toFixed(2).toString() + "%";
  if(isNumeric(total_bets) && confidence_level > 0 && confidence_level < 1 && isNumeric(win_per)) {
    setCI(confidence_level, total_bets, win_per);
  }
}

/* T-Test Calculator */
function setPVal(wins, losses, pop_mean) {
  function setErrorText(error_text) {
    document.getElementById('ttest_results').innerHTML = "API Error: " + error_text;
  }
  function setOutputText(res) {
    if (res.indexOf(',') > -1) { 
      var t_val = res.split(',')[0];
      var p_val = res.split(',')[1];
      document.getElementById('ttest_t_val').innerHTML = t_val;
      document.getElementById('ttest_p_val').innerHTML = p_val;
      var results = "Result is " + t_val + " standard deviations away from the mean with a p-value of " + p_val;
      if (parseFloat(p_val) <= 0.05) {
        results += " and may be statistically significant.";
      } else {
        results += " and is probably not statistically significant.";
      }
      document.getElementById('ttest_results').innerHTML = results;
    } else {
      setErrorText("Error parsing t_val and p_val");
    }
  }

  var xhr = new XMLHttpRequest();
  var url = API_URL + "/t_test/" + "wins=" + wins.toString() + "&losses=" + losses.toString() + "&pop_mean=" + pop_mean.toString();
  xhr.open("GET", url, true);
  xhr.onload = function (e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        setOutputText(xhr.responseText);
      } else {
        setErrorText(xhr.statusText);
      }
    }
  };
  xhr.onerror = function (e) {
    setErrorText(xhr.statusText);
  };
  xhr.send();
}
function calcTTest() {
  var wins = parseInt(document.getElementsByName('ttest_wins')[0].value);
  var losses = parseInt(document.getElementsByName('ttest_losses')[0].value);
  var pop_mean = parseFloat(document.getElementsByName('ttest_pop_mean')[0].value) / 100.0;
  document.getElementsByName('ttest_pop_mean')[0].value = parseFloat(pop_mean * 100.0).toFixed(2) + "%";
  var total_bets = wins + losses;
  document.getElementById('ttest_total_bets').innerHTML = total_bets;
  var win_per = wins * 1.0 / total_bets;
  document.getElementById('ttest_win_per').innerHTML = parseFloat(win_per * 100.0).toFixed(2) + "%";
  if(isNumeric(wins) && isNumeric(losses) && isNumeric(pop_mean)) {
    setPVal(wins, losses, pop_mean);
  }
}


