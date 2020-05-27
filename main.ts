/// <reference path="program.ts" />

function initialize(): Program {
  return new Program();
}
function makeCommunications() {
  initialize().main("communication");
}
function makeRosters() {
  initialize().main("rosters");
}