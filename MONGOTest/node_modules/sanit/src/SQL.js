var SQL = exports;

var escapeChar = /[\0\b\t\n\r\x1a\"\'\\]/g;
var escapeCharMap = {
  "\0": "\\0",
  "\b": "\\b",
  "\t": "\\t",
  "\n": "\\n",
  "\r": "\\r",
  "\x1a": "\\Z",
  '"': '\\"',
  "'": "\\'",
  "\\": "\\\\",
};
var dateFormat = /[\d]{4}-[\d]{2}-[\d]{2}/g;
var timeFormat = /[\d]{2}:[\d]{2}/g;
var numberFormat = /[-]{0,1}[\d]+\.{0,1}[\d]+/g



// validate strings
SQL.validateInput = function (txt) {
  return txt === undefined ? "" : txt === null ? "" : txt.toString();
};

// ===============================================
// =============== Sanitize string ===============
// ===============================================

SQL.string = function (st) {
  var ut = SQL.validateInput(st);

  var escapeList = [];
  var remainList = [];
  var escapedString = "";
  remainList = ut.split(escapeChar);

  while ((match = escapeChar.exec(ut))) {
    escapeList.push(match[0]);
  }

  for (let i = 0; i < remainList.length; i++) {
    if (i < remainList.length - 1) {
      escapedString += remainList[i] + escapeCharMap[escapeList[i]];
    } else {
      escapedString += remainList[i];
    }
  }
  return "'" + escapedString + "'";
};

// =============================================================
// ==================== Sanitize Date input ====================
// ========== directly get from html input[type=date] ==========
// =============================================================

SQL.dateInput = function (date) {
  var ut = this.validateInput(date);

  var dateString = "";
  dateFormat.lastIndex = 0;
  var fDate = dateFormat.exec(ut);

  if (fDate) {
    dateString = "'" + fDate[0] + "'";
  }

  return dateString;
};

// =============================================================
// ==================== Sanitize Time input ====================
// ========== directly get from html input[type=time] ==========
// =============================================================

SQL.timeInput = function (time) {
  var ut = this.validateInput(time);

  var timeString = "";
  timeFormat.lastIndex = 0;
  var fTime = timeFormat.exec(ut);

  if (fTime) {
    timeString = "'" + fTime[0] + "'";
  }

  return timeString;
};

// ===============================================
// =============== Sanitize number ===============
// ===============================================

SQL.number = function (num) {
  var ut = this.validateInput(num);

  var numberString = "";
  numberFormat.lastIndex = 0;
  var fnumber = numberFormat.exec(ut);

  if (fnumber) {
    numberString = "'" + fnumber[0] + "'";
  }

  return numberString;
  
}