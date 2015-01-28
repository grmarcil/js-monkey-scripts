// ==UserScript==
// @name         Personal Capital Net Cash Calculator
// @namespace    http://home.personalcapital.com/
// @version      0.2
// @description  Calculates and displays net cash in Personal Capital
// @author       Greg Marcil
// @match        https://home.personalcapital.com/*
// @grant        none
// ==/UserScript==

function buildNetCashNode(net_cash) {
  var node = document.createElement("div");
  $(node).addClass("netWorth");

  var pretty_net_cash = net_cash.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  var net_color;
  if(net_cash > 0) {
    net_color = "#40c893";
  } else {
    net_color = "#f03240";
  }

  var node_contents = '<label>Net Cash</label><div class="amount" style="color:';
  node_contents += net_color;
  node_contents += ';">';
  node_contents += pretty_net_cash;
  node_contents += '</div>';
  node.innerHTML = node_contents;

  return node;
}

function addNetCashNode() {
  var cash = parseFloat($('.accountGroup.BANK').find('.accountGroupValue').text().replace("$", "").replace(",", ""));
  var debt = parseFloat($('.accountGroup.CREDIT_CARD').find('.accountGroupValue').text().replace("$", "").replace(",", ""));
  var net_cash = cash + debt;

  var net_cash_node = buildNetCashNode(net_cash);
  var cash_node = $(".accountGroup.BANK").children(".accountGroupHeader");
  $(net_cash_node).insertAfter(cash_node);
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
    addNetCashNode();
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

