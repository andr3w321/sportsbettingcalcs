// collapse navbar after click
$(document).on('click','.navbar-collapse.in',function(e) {
    if( $(e.target).is('a') ) {
        $(this).collapse('hide');
    }
});

var API_URL = "http://andr3w321.pythonanywhere.com";
//var API_URL = "http://localhost:8080";

function isNumeric(num) {
    return !isNaN(num);
}

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

/* Odds Converter */
function convert_euro_to_us(euro) {
  if(euro >= 2)
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
function showEuroOdds(inputField, outputField) {
  document.getElementById(outputField).innerHTML = "(" + prettifyEuroOdds(convert_us_to_euro(inputField.value)) + ")";
  inputField.value = prettifyUsOdds(inputField.value);
}

function formatPercent(inputField) {
  if(inputField.value) {
    inputField.value = parseFloat(inputField.value).toFixed(2) + "%";
  }
}

function calcRoiFromWinPer(euro_odds, win_per) {
  win_per = win_per / 100.0;
  var roi = win_per * euro_odds - 1;
  document.getElementsByName('roi_roi')[0].value = parseFloat(roi * 100.0).toFixed(2) + "%";
  document.getElementsByName('roi_win_per')[0].value = parseFloat(win_per * 100.0).toFixed(2) + "%";
}

function calcWinPerFromRoi(euro_odds, roi) {
  roi = roi / 100.0;
  var win_per = (roi + 1) / euro_odds;
  document.getElementsByName('roi_win_per')[0].value = parseFloat(win_per * 100.0).toFixed(2) + "%";
  document.getElementsByName('roi_roi')[0].value = parseFloat(roi * 100.0).toFixed(2) + "%";
}

function calcRoi() {
  var us_odds = parseFloat(document.getElementsByName('roi_us_odds')[0].value);
  var roi_win_per = parseFloat(document.getElementsByName('roi_win_per')[0].value);
  var roi_roi = parseFloat(document.getElementsByName('roi_roi')[0].value);
  var euro_odds = convert_us_to_euro(us_odds);

  if(us_odds && roi_win_per && !roi_roi) {
    calcRoiFromWinPer(euro_odds, roi_win_per);
  } else if (us_odds && roi_roi && !roi_win_per) {
    calcWinPerFromRoi(euro_odds, roi_roi);
  }
  // TODO calc us odds from win per and roi
}

/* Kelly Calculator */
function calcKelly() {
  var multiplier = parseFloat(document.getElementsByName('kelly_multiplier')[0].value);
  var us_odds = parseFloat(document.getElementsByName('kelly_us_odds')[0].value);
  var win_per = parseFloat(document.getElementsByName('kelly_win_per')[0].value) / 100.0;
  var euro_odds = convert_us_to_euro(us_odds);
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

/* Hedge Calculator */
function calcHedge() {
  var teama_amount_bet = parseFloat(document.getElementsByName('hedge_teama_amount_bet')[0].value);
  var teamb_amount_bet = parseFloat(document.getElementsByName('hedge_teamb_amount_bet')[0].value);
  var teama_euro_odds = convert_us_to_euro(parseFloat(document.getElementsByName('hedge_teama_us_odds')[0].value));
  var teamb_euro_odds = convert_us_to_euro(parseFloat(document.getElementsByName('hedge_teamb_us_odds')[0].value));

  var teama_to_win = teama_amount_bet * (teama_euro_odds - 1);
  var teamb_to_win = teamb_amount_bet * (teamb_euro_odds - 1);
  document.getElementById('hedge_teama_to_win').innerHTML = numberWithCommas(parseFloat(teama_to_win).toFixed(4));
  document.getElementById('hedge_teamb_to_win').innerHTML = numberWithCommas(parseFloat(teamb_to_win).toFixed(4));

  var teama_net_result = teama_to_win - teamb_amount_bet;
  var teamb_net_result = teamb_to_win - teama_amount_bet;
  document.getElementById('hedge_teama_net_result').innerHTML = numberWithCommas(parseFloat(teama_net_result).toFixed(4));
  document.getElementById('hedge_teamb_net_result').innerHTML = numberWithCommas(parseFloat(teamb_net_result).toFixed(4));

  calcHedgeEV();
  calcHedgeEG();

}

function calcHedgeEV() {
  var teama_true_win_per = parseFloat(document.getElementsByName('hedge_teama_true_win_per')[0].value);
  var teamb_true_win_per = parseFloat(document.getElementsByName('hedge_teamb_true_win_per')[0].value);

  var teama_net_result = parseFloat(document.getElementById('hedge_teama_net_result').innerHTML.replace(',',''));
  var teamb_net_result = parseFloat(document.getElementById('hedge_teamb_net_result').innerHTML.replace(',',''));

  var ev = (teama_true_win_per * teama_net_result + teamb_true_win_per * teamb_net_result) / 100.0;
  document.getElementById('hedge_ev').innerHTML = numberWithCommas(parseFloat(ev).toFixed(4));
}

function setHedgeTrueWinPerFields(inputField, outputField) {
  inputField.value = parseFloat(inputField.value).toFixed(2) + '%';
  document.getElementsByName(outputField)[0].value = (100.0 - parseFloat(inputField.value)).toFixed(2) + '%';
}

function calcHedgeEG() {

  var teama_amount_bet = parseFloat(document.getElementsByName('hedge_teama_amount_bet')[0].value.replace(',',''));
  var teamb_amount_bet = parseFloat(document.getElementsByName('hedge_teamb_amount_bet')[0].value.replace(',',''));
  var teama_euro_odds = convert_us_to_euro(parseFloat(document.getElementsByName('hedge_teama_us_odds')[0].value));
  var teamb_euro_odds = convert_us_to_euro(parseFloat(document.getElementsByName('hedge_teamb_us_odds')[0].value));

  var teama_to_win = teama_amount_bet * (teama_euro_odds - 1);
  var teamb_to_win = teamb_amount_bet * (teamb_euro_odds - 1);

  var teama_true_win_per = parseFloat(document.getElementsByName('hedge_teama_true_win_per')[0].value) / 100.0;
  var teamb_true_win_per = parseFloat(document.getElementsByName('hedge_teamb_true_win_per')[0].value) / 100.0;

  var teama_net_result = parseFloat(document.getElementById('hedge_teama_net_result').innerHTML.replace(',',''));
  var teamb_net_result = parseFloat(document.getElementById('hedge_teamb_net_result').innerHTML.replace(',',''));

  var starting_bankroll = parseFloat(document.getElementsByName('hedge_starting_bankroll')[0].value.replace(",",""));

  var eg = (Math.pow((1 + (teama_net_result / starting_bankroll)), teama_true_win_per) * Math.pow((1 + (teamb_net_result / starting_bankroll)), teamb_true_win_per) - 1.0) * 100.0;

  document.getElementById('hedge_eg').innerHTML = parseFloat(eg).toFixed(4) + "%";

  // solve for optimum team b bet amount lazily by trying every bet amount for br / 10000
  optimum_teamb_bet_amount = 0;
  max_eg = 0;
  for (var tmp_teamb_bet_amount = 0; tmp_teamb_bet_amount <= starting_bankroll; tmp_teamb_bet_amount += starting_bankroll / 10000.0) {
    tmp_teama_net_result = teama_amount_bet * (teama_euro_odds - 1) - tmp_teamb_bet_amount;
    tmp_teamb_net_result = tmp_teamb_bet_amount * (teamb_euro_odds - 1) - teama_amount_bet;

    tmp_eg = (Math.pow((1 + (tmp_teama_net_result / starting_bankroll)), teama_true_win_per) * Math.pow((1 + (tmp_teamb_net_result / starting_bankroll)), teamb_true_win_per) - 1.0) * 100.0;
    if (tmp_eg > max_eg) {
      max_eg = tmp_eg;
      optimum_teamb_bet_amount = tmp_teamb_bet_amount;
    }
  }
  document.getElementById('hedge_optimum_teamb_bet_amount').innerHTML = numberWithCommas(parseFloat(optimum_teamb_bet_amount).toFixed(4));
  

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

/* Bet Simulator */
function updateBetSimInput() {
  var average_us_odds = parseFloat(document.getElementsByName('betsim_average_us_odds')[0].value);
  var roi = parseFloat(document.getElementsByName('betsim_roi')[0].value);
  var to_win = parseFloat(document.getElementsByName('betsim_to_win')[0].value.replace(',',''));
  var betsize_type = document.getElementsByName('betsim_betsize_type')[0].value;
  var average_euro_odds = convert_us_to_euro(average_us_odds);
  // calculate and update winrate
  var win_per = (roi / 100.0 + 1) / average_euro_odds;
  document.getElementById('betsim_winrate').innerHTML = "(" + parseFloat(win_per * 100.0).toFixed(2) + "% winrate)";

  // calculate and update betsize
  if (average_us_odds >= 100) {
    var betsize = to_win * 100.0 / average_us_odds;
  } else {
    var betsize = to_win * -1.0 * average_us_odds / 100.0;
  }
  if (betsize_type == "Variable") {
    formatPercent(document.getElementsByName('betsim_to_win')[0]);
    betsize = parseFloat(betsize).toFixed(2) + "% to win";
  } else {
    document.getElementsByName('betsim_to_win')[0].value = numberWithCommas(to_win.toFixed(2));
    betsize = parseFloat(betsize).toFixed(2) + " to win";
  }
  document.getElementById('betsim_betsize').innerHTML = betsize;
}

function updatePerBRLabel(inputField) {
  if(inputField.value) {
    document.getElementById('betsim_per_br_label').innerHTML = 'Chance of ' + inputField.value + ' loss:';
  }
}

function setDefaultBetSimBetsize() {
  var betsize_type = document.getElementsByName('betsim_betsize_type')[0].value;
  if (betsize_type == "Variable") {
    document.getElementsByName('betsim_to_win')[0].value = "2.00%";
  } else {
    document.getElementsByName('betsim_to_win')[0].value = "200.00";
  }
}

function average( dataArray ) {
    var sum = 0;
    var count = dataArray.length;
    for (i=0; i < count; i++ ) {
        sum += dataArray[i];
    }
    return sum / count;
}

function standardDeviation(values){
  var avg = average(values);
  
  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });
  
  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

// calculate betsize from to_win amount and average_us_odds
function calcBetSize(to_win, average_us_odds) {
  if (average_us_odds >= 100) {
    var betsize = to_win * 100.0 / average_us_odds;
  } else {
    var betsize = to_win * -1.0 * average_us_odds / 100.0;
  }
  return betsize;
}

function betSimulate() {
  var starting_bankroll = parseFloat(document.getElementsByName('betsim_starting_bankroll')[0].value.replace(",",""));
  var average_us_odds = parseFloat(document.getElementsByName('betsim_average_us_odds')[0].value);
  var roi = parseFloat(document.getElementsByName('betsim_roi')[0].value);
  var nbets = parseInt(document.getElementsByName('betsim_nbets')[0].value.replace(",",""));
  var to_win = parseFloat(document.getElementsByName('betsim_to_win')[0].value.replace(',','').replace('%',''));
  var betsize_type = document.getElementsByName('betsim_betsize_type')[0].value;
  var per_br_input = parseFloat(document.getElementsByName('betsim_per_br_input')[0].value.replace(',','').replace('%',''));
  var low_br_cutoff = starting_bankroll - starting_bankroll * per_br_input / 100.0;
  var win_per = (roi / 100.0 + 1) / convert_us_to_euro(average_us_odds);
  var betsize = calcBetSize(to_win, average_us_odds);

  var ntrials = 10000;
  var ending_bankrolls = Array(ntrials);
  var losses = 0;
  var large_drawdowns = 0;
  var chart_data = Array(20);
  for(var i=0; i<20; i++) {
    chart_data[i] = [{x:0,y:starting_bankroll}];
  }
  for(var i=0; i<ntrials; i++) {
    var tmp_bankroll = starting_bankroll;
    var tmp_to_win = to_win;
    var tmp_betsize = betsize;
    var low_bankroll = false;
    for(var j=0; j<nbets; j++) {
      // If betsize is variable, calculate a new betsize before each bet
      if (betsize_type == "Variable") {
        tmp_to_win = to_win / 100.0 * tmp_bankroll;
        tmp_betsize = calcBetSize(tmp_to_win, average_us_odds);
      }
      // Randomly decide if it was a win or not
      if (Math.random() < win_per) {
        // win
        tmp_bankroll += tmp_to_win;
      } else {
        // loss
        tmp_bankroll -= tmp_betsize;
        if (tmp_bankroll < 0) {
          tmp_bankroll = 0;
        }
      }
      if(i<20) {
        chart_data[i].push({x:j+1,y:tmp_bankroll});
      }
      if(tmp_bankroll <= low_br_cutoff) {
        low_bankroll = true;
      }
    }
    ending_bankrolls[i] = tmp_bankroll;
    if (tmp_bankroll < starting_bankroll) {
      losses += 1;
    }
    if (low_bankroll == true) {
      large_drawdowns += 1;
    }
  }

  var average_ending_bankroll = average(ending_bankrolls);
  document.getElementById("betsim_avg_ending_bankroll").innerHTML = numberWithCommas(parseFloat(average_ending_bankroll).toFixed(2));
  document.getElementById("betsim_chance_of_loss").innerHTML = parseFloat(losses * 100.0 / ntrials).toFixed(2) + "%";
  document.getElementById("betsim_chance_of_large_drawdown").innerHTML = parseFloat(large_drawdowns * 100.0 / ntrials).toFixed(2) + "%";
  // javascript sort sorts array in place
  ending_bankrolls.sort(function(a, b){return a - b});
  document.getElementById("betsim_std_dev").innerHTML = numberWithCommas(parseFloat(standardDeviation(ending_bankrolls)).toFixed(2));
  var seventy_ci_low = ending_bankrolls[parseInt(ntrials * 0.3 - 1)]
  var seventy_ci_high = ending_bankrolls[parseInt(ntrials * 0.7 - 1)]
  var ninetyfive_ci_low = ending_bankrolls[parseInt(ntrials * 0.05 - 1)]
  var ninetyfive_ci_high = ending_bankrolls[parseInt(ntrials * 0.95 - 1)]
  document.getElementById("betsim_seventy_ci").innerHTML = numberWithCommas(seventy_ci_low.toFixed(2)) + "-" + numberWithCommas(seventy_ci_high.toFixed(2));
  document.getElementById("betsim_ninetyfive_ci").innerHTML = numberWithCommas(ninetyfive_ci_low.toFixed(2)) + "-" + numberWithCommas(ninetyfive_ci_high.toFixed(2));
  /*
  output
  20 sample graph
  Could also look at downswings
  */
  var default_colors = ['#3366CC','#DC3912','#FF9900','#109618','#990099','#3B3EAC','#0099C6','#DD4477','#66AA00','#B82E2E','#316395','#994499','#22AA99','#AAAA11','#6633CC','#E67300','#8B0707','#329262','#5574A6','#3B3EAC']
  // Add samples lines
  for(var i=0; i<20; i++) {
    betsimChart.data.datasets[i] = {
                label: (i + 1).toString(),
                fill: false,
                borderColor: default_colors[i],
                pointRadius: 0,
                lineTension: 0,
                borderWidth: 1,
                data: chart_data[i]};
  }
  // Add average ending bankroll
  betsimChart.data.datasets[20] = {
                label: 'Average Ending Bankroll',
                fill: false,
                borderColor: '#000000',
                pointRadius: 0,
                lineTension: 0,
                borderWidth: 1,
                data: [{x:0,y:starting_bankroll},{x:nbets,y:average_ending_bankroll}]};
  betsimChart.data.datasets[21] = {
                label: '70% CI Low',
                fill: false,
                borderColor: '#708090',
                pointRadius: 0,
                lineTension: 0,
                borderWidth: 1,
                data: [{x:0,y:starting_bankroll},{x:nbets,y:seventy_ci_low}]};
  betsimChart.data.datasets[22] = {
                label: '70% CI High',
                fill: false,
                borderColor: '#708090',
                pointRadius: 0,
                lineTension: 0,
                borderWidth: 1,
                data: [{x:0,y:starting_bankroll},{x:nbets,y:seventy_ci_high}]};
  betsimChart.data.datasets[23] = {
                label: '95% CI Low',
                fill: false,
                borderColor: '#D3D3D3',
                pointRadius: 0,
                lineTension: 0,
                borderWidth: 1,
                data: [{x:0,y:starting_bankroll},{x:nbets,y:ninetyfive_ci_low}]};
  betsimChart.data.datasets[24] = {
                label: '95% CI High',
                fill: false,
                borderColor: '#D3D3D3',
                pointRadius: 0,
                lineTension: 0,
                borderWidth: 1,
                data: [{x:0,y:starting_bankroll},{x:nbets,y:ninetyfive_ci_high}]};

  betsimChart.update();
}

