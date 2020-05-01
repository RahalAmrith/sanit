var fs = require("fs");
var sanit = require("sanit");

var payloads = fs.readFileSync("./number.txt", "utf-8");
var output = [];

payloads.split("\n").map((data) => {
  console.log("input    : " + data.replace("\r", ""));

  console.log("output   : " + sanit.SQL.number(data.replace("\r", "")));


  console.log(" ");

  console.log(
    "==============================================================="
  );
  console.log(
    "==============================================================="
  );
  console.log(" ");
});

// console.table(output);
