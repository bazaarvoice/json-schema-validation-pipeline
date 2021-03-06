/**
 * Created by Andrius Skerla on 12/11/14.
 * mailto: andrius@skerla.com
 */
module.exports = Spec;

function Spec(type) {
  this._type = type;
}

/**
 *
 * @param value
 * @returns {Spec}
 */
Spec.prototype.required = function (value) {
  if (arguments.length === 0) {
    value = true;
  }

  this.required = value;
  return this;
};

/**
*
*
*/
Spec.prototype.cardinalityAgnostic = function (value) {
  if (arguments.length === 0) {
    value = true;
  }
  this.cardinalityAgnostic = value;
  return this;
};

/**
 *
 * @param value
 * @returns {Spec}
 */
Spec.prototype.min = function (value) {
  this.min = value;
  return this;
};

/**
 *
 * @param value
 * @returns {Spec}
 */
Spec.prototype.max = function (value) {
  this.max = value;
  return this;
};

/**
 *
 * @param value
 * @returns {Spec}
 */
Spec.prototype.regexp = function (value) {
  this.regexp = value;
  return this;
};

/**
 *
 * @param value
 * @returns {Spec}
 */
Spec.prototype.oneOf = function (value) {
  this.oneOf = value;
  return this;
};

/**
 *
 * @param value
 * @returns {Spec}
 */
Spec.prototype.len = function (value) {
  this.len = value;
  return this;
};

/**
 *
 * @param value
 * @returns {Spec}
 */
Spec.prototype.fn = function (value) {
  this.fn = value;
  return this;
};

/**
 *
 * @param value
 * @returns {Spec}
 */
Spec.prototype.typeOf = function (value) {
  this.typeOf = value;
  return this;
};

/**
 *
 */
[String, Number, Array, Object, Function, Boolean].forEach(function (object) {

  /**
   *
   */
  Object.keys(Spec.prototype).forEach(function (fnName) {
    object[fnName] = function () {
      var spec = new Spec(object);
      return spec[fnName].apply(spec, arguments);
    };
  });

});