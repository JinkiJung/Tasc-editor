var innerOffset = 10;
var fieldOffset = 35;
var fieldWidthOffset = innerOffset * 2;
var linkItemSize = 10;
var fieldItemWidth = 160;
var fieldItemHeight = 25;
var tascItemWidth = 180;
var tascItemHeight = 248;
var xOffset= 10;
var yOffset= 10;
var svgURI = 'http://www.w3.org/2000/svg';
var tascItemHeaderOffset = 34;
var tascItemNamelessOffset = -20;
var testIDP = "dmc";

var paths = [];
var pathHeads = [];
var tascItems = [];
var fieldItems = [];
var tascData = [{id:"start"},{id:"end"}];
var actionData = [];
var terminusData = [];
var conditionData = [];
var instructionData = [];
var outputTascData = [{id:"start"},{id:"end"}];

var svgHistory = [];
var svgHistoryIndex = 1;