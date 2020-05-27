/// <reference path="main.ts" />

function onOpen(): void {
    var ui = SpreadsheetApp.getUi();
    // Or DocumentApp or FormApp.
    ui.createMenu("STEAM")
        .addItem('Make Rosters', 'makeRosters')
        .addItem('Make Communications', 'makeCommunications')
        .addToUi();
  }