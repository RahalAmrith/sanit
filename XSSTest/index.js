var http = require("http");
var fs = require("fs");
var sanit = require("sanit");

function getDoc(url) {
  var doc = url.split("%7C")[1] || "Null";
  var func = url.split("%7C")[0];

  var index_start = fs.readFileSync("./index_start.html");
  var index_end = fs.readFileSync("./index_end.html");
  var block = fs.readFileSync("./block.html").toString();

  var payLoades = doc === "Null" ? "" : fs.readFileSync(`./TestCases/${doc}.txt`, "utf-8");
  var body = "";

  payLoades.split("\n").map((data, i) => {
    var output = "";

    var indexedData = data.replace(/{{{index}}}/g, i + 1);

    switch (func) {
      case "/":
        break;

      // ===============================================
      // ============== without filtering ==============
      // ===============================================

      case "/xinnerhtml":
        output = indexedData;
        break;
      case "/xdoublequotedattribute":
        output = `<img src="${indexedData}"  ></img>`;
        break;
      case "/xsinglequotedattribute":
        output = `<img src='${indexedData}'  ></img>`;
        break;
      case "/xdoublequoteduriattribute":
        output = `<img src="${indexedData}"  ></img>`;
        break;
      case "/xsinglequoteduriattribute":
        output = `<img src='${indexedData}'  ></img>`;
        break;
      case "/xuri":
        output = `<a href='${indexedData}'  >${sanit.XSS.innerHtml(
          indexedData
        )}</a>`;
        break;
      case "/xhtmlcomment":
        output = `<!-- ${indexedData} -->`;
        break;

      //============================================
      //============== with filtering ==============
      //============================================
      case "/innerhtml":
        output = sanit.XSS.innerHtml(indexedData);
        break;
      case "/doublequotedattribute":
        output = `<img src="${sanit.XSS.doubleQuotedAttrib(
          indexedData
        )}"  ></img>`;
        break;
      case "/singlequotedattribute":
        output = `<img src='${sanit.XSS.singleQuotedAttrib(
          indexedData
        )}'  ></img>`;
        break;
      case "/doublequoteduriattribute":
        output = `<img src="${sanit.XSS.doubleQuotedUriAttrib(
          indexedData
        )}"  ></img>`;
        break;
      case "/singlequoteduriattribute":
        output = `<img src='${sanit.XSS.singleQuotedUriAttrib(
          indexedData
        )}'  ></img>`;
        break;
      case "/uri":
        output = `<a href='${sanit.XSS.uri(
          indexedData
        )}'  >${sanit.XSS.innerHtml(indexedData)}</a>`;
        break;
      case "/htmlcomment":
        output = `<!-- ${sanit.XSS.htmlComment(indexedData)} -->`;
        break;

      default:
        output = sanit.XSS.innerHtml(indexedData);
        break;
    }
    body += block
      .replace("{{{number}}}", i + 1)
      .replace("{{{payload}}}", sanit.XSS.innerHtml(indexedData))
      .replace("{{{output}}}", output);
  });

  return index_start + body + index_end;
}

http
  .createServer(async function (req, res) {
    switch (req.url.split("%7C")[0]) {
      case "/":
      // ==========================================
      // =============== inner html ===============
      // ==========================================
      case "/innerhtml":
      case "/xinnerhtml":

      // ==================================================
      // =============== doubleQuotedAttrib ===============
      // ==================================================
      case "/doublequotedattribute":
      case "/xdoublequotedattribute":

      // ==================================================
      // =============== singleeQuotedAttrib ===============
      // ==================================================
      case "/singlequotedattribute":
      case "/xsinglequotedattribute":

      // =====================================================
      // =============== doubleQuotedUriAttrib ===============
      // =====================================================
      case "/doublequoteduriattribute":
      case "/xdoublequoteduriattribute":

      // ======================================================
      // =============== singleeQuotedUriAttrib ===============
      // ======================================================
      case "/singlequoteduriattribute":
      case "/xsinglequoteduriattribute":

      // ===================================
      // =============== Uri ===============
      // ===================================
      case "/uri":
      case "/xuri":

      // ======================================================
      // =============== Html Comment ===============
      // ======================================================
      case "/htmlcomment":
      case "/xhtmlcomment":
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(getDoc(req.url));
        console.log(req.url + " Served successfully");
        break;

      // ===========================================
      // =============== Style sheet ===============
      // ===========================================
      case "/styles.css":
        var payLoades = await fs.readFileSync(`styles.css`, "utf-8");

        res.writeHead(200, { "Content-Type": "text/css" });
        res.end(payLoades);
        console.log(req.url + " Served Webpage successfully");
        break;

      default:
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("notFound");
        console.log(req.url + " not found");
        break;
    }
  })
  .listen(5000);

  console.log("server is listning on localhost:5000");