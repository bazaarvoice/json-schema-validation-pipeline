/**
 * Created by Andrius Skerla on 12/11/14.
 * mailto: andrius@skerla.com
 */

var _ = require('lodash');
var Spec = require('./schemaSpec');

module.exports = exports = {};

exports.checkNumber = checkNumber;
exports.checkString = checkString;
exports.checkObject = checkObject;
exports.checkFunction = checkFunction;
exports.checkBoolean = checkBoolean;
exports.checkArray = checkArray;

/**
 *
 * @param key
 * @param value
 * @param spec
 * @returns {*}
 * @param object
 */
function checkNumber(key, value, spec, object) {
  if (isCardinalityAgnostic(spec)) {
    if (!(_.isNumber(value) || _.isArray(value))) {
      return '`' + key + '` must be a number or an array of numbers';
    }
  } else {
    if (!_.isNumber(value)) {
      return '`' + key + '` must be a number';
    }
  }

  var err;
  var nums = _.isArray(value) ? value : [value]
  _.forEach(nums, function (v) {
    if (spec.hasOwnProperty('min')) {
      if (value < spec.min) {
        err = '`' + key + '` should be greater or equal to ' + spec.min;
        return false;
      }
    }

    if (spec.hasOwnProperty('max')) {
      if (value > spec.max) {
        err = '`' + key + '` should be less or equal to ' + spec.min;
        return false;
      }
    }

    if (spec.hasOwnProperty('oneOf')) {
      if (!~spec.oneOf.indexOf(value)) {
        err = '`' + key + '` should be one of ' + spec.oneOf.join(', ');
        return false;
      }
    }
  });
  return err;
}

/**
 *
 * @param key
 * @param value
 * @param spec
 * @returns {*}
 * @param object
 */
function checkString(key, value, spec, object) {
  if (isCardinalityAgnostic(spec)) {
    if (!(_.isString(value) || _.isArray(value))) {
      return '`' + key + '` must be a string or an array of strings';
    }
  } else {
    if (!_.isString(value)) {
      return '`' + key + '` must be a string';
    }
  }

  var err;
  var strings = _.isArray(value) ? value : [value]
  _.forEach(strings, function(v) {
    if (spec.hasOwnProperty('min')) {
      if (v.length < spec.min) {
        err = 'The length of `' + key + '` should be greater or equal to ' + spec.min + '. Got ' + v.length;
        return false;
      }
    }

    if (spec.hasOwnProperty('max')) {
      if (v.length > spec.max) {
        err = 'The length of `' + key + '` should be less or equal to ' + spec.min + '. Got ' + v.length;
        return false;
      }
    }

    if (spec.hasOwnProperty('regexp')) {
      if (!v.match(spec.regexp)) {
        err = '`' + key + '` does not match regexp ' + spec.regexp;
        return false;
      }
    }

    if (spec.hasOwnProperty('oneOf')) {
      if (!~spec.oneOf.indexOf(v)) {
        err = '`' + key + '` should be one of ' + spec.oneOf.join(', ');
        return false;
      }
    }

    if (spec.hasOwnProperty('len')) {
      if (v.length !== spec.len) {
        err = 'The length of `' + key + '` should be ' + spec.len + '. Got ' + v.length;
        return false;
      }
    }
  });
  return err;
}

/**
 *
 * @param key
 * @param value
 * @param spec
 * @returns {*}
 * @param object
 */
function checkObject(key, value, spec, object) {
  if (isCardinalityAgnostic(spec)) {
    if (!(_.isObject(value) || _.isArray(value))) {
      return '`' + key + '` must be an object or an array of objects';
    }
  } else {
    if (!_.isObject(value)) {
      return '`' + key + '` must be an object';
    }
  }
  var objs = _.isArray(value) ? value : [value];
  var notObj = _.find(objs, function (o) { return !_.isObject(o)});
  if (notObj) {
    return '`' + key +'` must all be objects';
  }
}

/**
 *
 * @param key
 * @param value
 * @param spec
 * @returns {boolean}
 * @param object
 */
function checkFunction(key, value, spec, object) {

}

/**
 *
 * @param key
 * @param value
 * @param spec
 * @param object
 */
function checkBoolean(key, value, spec, object) {
  if (!_.isBoolean(value)) {
    return '`' + key + '` must be boolean.';
  }
}

/**
 *
 * @param key
 * @param value
 * @param spec
 * @param object
 */
function checkArray(key, value, spec, object) {
  if (!_.isArray(value)) {
    return '`' + key + '` must be boolean.';
  }


  if (spec.hasOwnProperty('min')) {
    if (value.length < spec.min) {
      return 'The length of array `' + key + '` should be greater or equal to ' + spec.min + '. Got ' + value.length;
    }
  }

  if (spec.hasOwnProperty('max')) {
    if (value.length > spec.max) {
      return 'The length of array `' + key + '` should be less or equal to ' + spec.min + '. Got ' + value.length;
    }
  }

  if (spec.hasOwnProperty('len')) {
    if (value.length !== spec.len) {
      return 'The length of `' + key + '` should be ' + spec.len + '. Got ' + value.length;
    }
  }

  if (spec.hasOwnProperty('oneOf')) {
    for (var x in value) {
      if (!value.hasOwnProperty(x)) { continue; }

      if (!~spec.oneOf.indexOf(value[x])) {
        return '`' + key + '` should contain only ' + spec.oneOf.join(', ') + '. Got ' + value[x];
      }
    }
  }

  if (spec.hasOwnProperty('typeOf')) {
    var result;
    for (var x in value) {
      if (!value.hasOwnProperty(x)) { continue; }

      var itemSpec = spec.typeOf;
      var itemType = spec.typeOf._type || spec.typeOf;

      if (!(itemSpec instanceof Spec)) {
        itemSpec = {};
      }

      if (itemType === Number) {
        if (result = checkNumber.call(this, key + '.' + x, value[x], itemSpec, object)) {
          return result;
        }
      }

      if (itemType === String) {
        if (result = checkString.call(this, key + '.' + x, value[x], itemSpec, object)) {
          return result;
        }
      }

      if (itemType === Object) {
        if (result = checkObject.call(this, key + '.' + x, value[x], itemSpec, object)) {
          return result;
        }
      }

      if (itemType === Boolean) {
        if (result = checkBoolean.call(this, key + '.' + x, value[x], itemSpec, object)) {
          return result;
        }
      }

      if (itemType === Array) {
        if (result = checkArray.call(this, key + '.' + x, value[x], itemSpec, object)) {
          return result;
        }
      }

    }
  }

}

function isCardinalityAgnostic(spec) {
  return spec.hasOwnProperty('cardinalityAgnostic') && spec.cardinalityAgnostic === true
}