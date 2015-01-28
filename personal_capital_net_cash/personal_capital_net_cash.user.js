// ==UserScript==
// @name         Personal Capital Net Cash Calculator
// @namespace    http://home.personalcapital.com/
// @version      0.3
// @description  Calculates and displays net cash in Personal Capital
// @author       Greg Marcil
// @match        https://home.personalcapital.com/*
// @grant        none
// ==/UserScript==

function buildNode(value, label) {
  var node = document.createElement("div");
  $(node).addClass("netWorth");

  var pretty_value = value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  var color;
  if(value > 0) {
    color = "#40c893";
  } else {
    color = "#f03240";
  }

  var contents = '<label>';
  contents += label;
  contents += '</label><div class="amount" style="color:';
  contents += color;
  contents += ';">';
  contents += pretty_value;
  contents += '</div>';

  node.innerHTML = contents;
  return node;
}

function addNodes() {
  var cash = parseFloat($('.accountGroup.BANK').find('.accountGroupValue').text().replace("$", "").replace(",", ""));
  var debt = parseFloat($('.accountGroup.CREDIT_CARD').find('.accountGroupValue').text().replace("$", "").replace(",", ""));
  var net_cash = cash + debt;

  var debt_node = buildNode(debt, "Debt");
  var net_cash_node = buildNode(net_cash, "Net Cash");
  var cash_node = $(".accountGroup.BANK").children(".accountGroupHeader");
  $(debt_node).insertAfter(cash_node);
  $(net_cash_node).insertAfter(debt_node);
}

function pageReady() {
  // Personal Capital loads accounts dynamically on page load
  // Kind of a hack, but it's the best quick solution I could find
  // without digging too deep in their js
  window.PCAPCashRetryCounter += 1;
  if(typeof window.PCAP === 'undefined' || typeof window.PCAP.refreshingAccounts === "undefined" || !($.isEmptyObject(window.PCAP.refreshingAccounts))) {
    // don't allow infinite retries
    if(window.PCAPCashRetryCounter < 5) {
      setTimeout(function() {pageReady();}, 2000);
    }
  } else {
    addNodes();
  }
}

function main() {
  window.PCAPCashRetryCounter = 0;
  if(typeof $ === 'undefined') {
    setTimeout(function() {main();}, 500);
  } else {
    pageReady();
  }
}

main();

