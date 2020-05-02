var fs = require("fs");
var sanit = require("sanit");

var payloads = fs.readFileSync("./payloads.txt", "utf-8");

payloads.split("\n").map((data) => {
  var obj;

  try {
    obj = JSON.parse(data.replace("\r", ""));
  } catch (error) {
    obj = data;
  }
  console.log(obj);

  console.log(sanit.MONGO.isProhibited(obj));

  console.log("");
  console.log(
    "======================================================================================"
  );
  console.log(
    "======================================================================================"
  );
  console.log("");
});
