var fs = require("fs");
var sanit = require("sanit");

var payloads = fs.readFileSync("./string.txt", "utf-8");
var output = [];

payloads.split("\n").map((data) => {
  console.log("input    : " + data.replace("\r", ""));

  console.log("output   : " + sanit.SQL.string(data.replace("\r", "")));


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
