module.exports = class XSS {
  constructor() {
    this.regEx = {
      lineBreaks: /[\r\n]/g,
      uriColon: /(?::|&#[xX]0*3[aA];?|&#0*58;?|&colon;)/g,
      lessThan: /</g,
      graterThan: />/g,
      // htmlTags : /(?:<[^>]+>|\/>)/g
      htmlTags: /[<>\/]/g,
      doubleQuotation: /"/g,
      singleQuotation: /'/g,
      htmlCommentChars: /(?:\x00|^-*!?>|--!?>|--?!?$|\]>|\]$)/g,
    };

    this.criticalUriTypes = [
      "javascript",
      "data",
      "vbscript",
      "mhtml",
      "x-schema",
    ];

    // funcions
  }

  // Function for validate User input
  // check the passed value is not null an not undefined
  validateText(txt) {
    return txt === undefined
      ? "undefined"
      : txt === null
      ? "null"
      : txt.toString();
  }

  // Rmove all Line breaks in the given input
  //      \n
  //      \r
  removeLineBreaks(txt) {
    return txt.replace(this.regEx.lineBreaks, "");
  }

  // detect and Remove critical url types that can use to inject XSS
  //        'javascript'
  //        'data'
  //        'vbscript'
  //        'mhtml'
  //        'x-schema'
  removeCriticalProtocols(txt) {
    // get the protocol of the input
    var proto_bak = txt.split(this.regEx.uriColon)[0].toLowerCase();
    var proto = txt.split(this.regEx.uriColon)[0].toLowerCase();

    // go through ech protocol
    this.criticalUriTypes.map((data) => {
      // check for critical protocol
      if (proto.includes(data)) {
        // replace the protocol with preceeding x -
        proto = proto.replace(data, "x - " + data);
      }
    });

    return txt.replace(proto_bak, proto);
  }

  // ===========================================================
  // ==================== Filter inner Html ====================
  // ===========================================================

  // filter the values inside html elements
  // (act like html special chars)

  //  <div> [-[[ Untrusted text ]]-] </div>

  innerHtml(text) {
    var ut = this.validateText(text);
    return ut
      .replace(this.regEx.lessThan, "&lt;")
      .replace(this.regEx.graterThan, "&gt;");
  }

  // =====================================================
  // ==================== Remove HTML ====================
  // =====================================================

  // remove all html tags in input

  removeHtml(text) {
    var ut = this.validateText(text);
    return ut.replace(this.regEx.htmlTags, "");
  }

  // ========================================================================
  // ==================== Filter double quoted Attribute ====================
  // ========================================================================

  // Sanitize the values that should place inside single quoted array

  // <input onError=" [-[[ Untrusted text ]]-] " />

  doubleQuotedAttrib(text) {
    var ut = this.validateText(text);
    ut = this.removeLineBreaks(ut);
    ut = this.innerHtml(ut);
    return ut.replace(this.regEx.doubleQuotation, "&quot;");
  }

  // ========================================================================
  // ==================== Filter single quoted Attribute ====================
  // ========================================================================

  // Sanitize the values that should place inside single quoted array

  // <input onError=' [-[[ Untrusted text ]]-] ' />

  singleQuotedAttrib(text) {
    var ut = this.validateText(text);
    ut = this.removeLineBreaks(ut);
    return ut.replace(this.regEx.singleQuotation, "&#39;");
  }

  // ============================================================================
  // ==================== Filter URI double quoted Attribute ====================
  // ============================================================================

  // Sanitize the values that should place inside single quoted array

  // <img src=" [-[[ Untrusted text ]]-] " />

  doubleQuotedUriAttrib(text) {
    var ut = this.validateText(text);
    ut = this.removeLineBreaks(ut);
    ut = this.removeCriticalProtocols(ut);
    return ut.replace(this.regEx.doubleQuotation, "&quot;");
  }

  // ============================================================================
  // ==================== Filter URI single quoted Attribute ====================
  // ============================================================================

  // Sanitize the values that should place inside single quoted array

  // <img src=' [-[[ Untrusted text ]]-] ' />

  singleQuotedUriAttrib(text) {
    var ut = this.validateText(text);
    ut = this.removeLineBreaks(ut);
    ut = this.removeCriticalProtocols(ut);
    return ut.replace(this.regEx.singleQuotation, "&#39;");
  }

  // ====================================================
  // ==================== Filter URi ====================
  // ====================================================

  // Sanitize the values that should place inside single quoted array

  // <img src=' [-[[ Untrusted text ]]-] ' />

  uri(text) {
    var ut = this.validateText(text);
    var ut = this.innerHtml(text);
    ut = ut.replace(this.regEx.doubleQuotation, "&quot;");
    ut = ut.replace(this.regEx.singleQuotation, "&#39;");
    ut = this.removeCriticalProtocols(ut);
    return ut;
  }

  // ==============================================================
  // ==================== Filter HTML Comments ====================
  // ==============================================================

  // Sanitize the values that should place inside single quoted array

  // <img src=' [-[[ Untrusted text ]]-] ' />

  htmlComment(text) {
    var ut = this.validateText(text);
    ut = ut.replace(this.regEx.htmlCommentChars, "");
    return ut;
  }
};
