/**
 * Created by Andrius Skerla on 12/11/14.
 * mailto: andrius@skerla.com
 */
var chai = require('chai');
var should = require('should');
var Validator = require('./../');


function validate(object, pipeline) {
  var validator = Validator(pipeline);
  var result = validator(object);
  return result.errors;
}

/**
 *
 */
describe('$dependency', function () {

  it('should pass', function () {
    var pipeline = [
      {$dependency: {
        surname: 'name'
      }}
    ];

    validate({
      name: 'Andrius'
    }, pipeline).should.be.length(0);

    validate({
      name: 'Andrius',
      surname: 'Skerla'
    }, pipeline).should.be.length(0);

    validate({
      a: {
        b: 4,
        a: 9
      }
    }, [
      {$dependency: {
        'a.b': 'a.a'
      }}
    ]).should.be.length(0);

  });

  it('should fail', function () {

    validate({
      surname: 'Skerla'
    }, [
      {$dependency: {
        surname: 'name'
      }}
    ]).should.be.length(1);

    validate({
      name: 'Andrius',
      surname: 'Skerla'
    }, [
      {$dependency: {
        surname: ['name', 'age']
      }}
    ]).should.be.length(1);

    validate({
      surname: 'Skerla'
    }, [
      {$dependency: {
        surname: ['name', 'age']
      }}
    ]).should.be.length(2);

    validate({
      a: {
        b: 4
      }
    }, [
      {$dependency: {
        'a.b': 'a.a'
      }}
    ]).should.be.length(1);

  });

});