const XSS = require('./src/XSS.js');
const SQL = require('./src/SQL.js');
const MONGO = require('./src/MONGO.js');

module.exports.XSS = new XSS();
module.exports.SQL = SQL;
module.exports.MONGO = MONGO;
