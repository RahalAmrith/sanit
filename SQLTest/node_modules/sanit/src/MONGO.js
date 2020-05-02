var MONGO = exports;

var specialChars = /^\$|\.|\%24/g;

function validate(obj) {
  return obj === undefined ? {} : obj === null ? {} : obj;
}

MONGO.object = function (obj, replace) {
  obj = validate(obj);
  var _replace = null;

  if (!specialChars.test(replace) && replace) {
    _replace = replace;
  }

  return santize(obj, _replace);
};

function santize(obj, replace) {
  if (Array.isArray(obj)) {
    obj.forEach((e) => santize(e, replace));
  } else if (obj instanceof Object) {
    Object.keys(obj).forEach((key) => {
      specialChars.lastIndex = 0;
      if (specialChars.test(key)) {
        if (replace) {
          var val = obj[key];
          delete obj[key];
          obj[replace] = val;
        } else {
          delete obj[key];
        }
      } else {
        obj[key] = santize(obj[key], replace);
      }
    });
  }

  return obj;
}

MONGO.isProhibited = function (obj) {
  obj = validate(obj);

  var isProhibited = false;

  has(obj, function () {
    isProhibited = true;
  });

  return isProhibited;
};

function has(obj, callback) {
  let _has = false;

  if (Array.isArray(obj)) {
    obj.forEach((obj) => has(obj, callback));
  } else if (obj instanceof Object) {
    Object.keys(obj).forEach((key) => {
      specialChars.lastIndex = 0;

      if (specialChars.test(key)) {
        callback();
      } else {
        has(obj[key], callback);
      }
    });
  }

  return _has;
}
