/**
 * Created by Andrius Skerla on 12/11/14.
 * mailto: andrius@skerla.com
 */
var _ = require('lodash');
var chai = require('chai');
var should = require('should');
var Validator = require('./../');
var expect = chai.expect;


function validate(object, pipeline) {
  var validator = Validator(pipeline);
  var result = validator(object);
  return result.errors;
}

/**
 *
 */
describe('$schema', function () {

  it('should run $schema by default if no pipeline method if defined', function () {
    Validator([
      {$schema: {
        name: String.required()
      }}
    ])({}).isValid.should.be.equal(false);

    validate({
      name: 'Andrius'
    }, [{
      name: String.required()
    }]).should.be.length(0);
  });

  it ('Number.cardinalityAgnostic', function () {
    var testObjs = [{id: [4], name: 'hey'}, {id: 4, name: 'hey'}];
    _.forEach(testObjs, function(o) {
      validate(o, [
          {$schema: {
            id: Number.cardinalityAgnostic()
          }}
      ]).should.be.length(0);

      validate(o, [
        {$schema: {
          id: Number.required().min(4).max(4).cardinalityAgnostic()
        }}
      ]).should.be.length(0);

      validate(o, [
        {$schema: {
          id: Number.required().min(5).cardinalityAgnostic(),
          name: Number
        }}
      ]).should.be.length(2);

      validate({id: 'asd'}, [
        {$schema: {
          id: Number.cardinalityAgnostic()
        }}
      ]).should.be.length(1);

      validate({}, [
        {$schema: {
          id: Number.required().cardinalityAgnostic()
        }}
      ]).should.be.length(1);

      validate({
        type: 'Big'
      }, [
        {$schema: {
          type: String.oneOf(['Big', 'Small', 'Medium'])
        }}
      ]).should.be.length(0);

      validate({
        type: 'Tiny'
      }, [
        {$schema: {
          type: String.oneOf(['Big', 'Small', 'Medium'])
        }}
      ]).should.be.length(1);
    });
  });

  it('Number', function () {
    var o = {
      id: 4,
      name: 'hey'
    };

    validate(o, [
      {$schema: {
        id: Number
      }}
    ]).should.be.length(0);

    validate(o, [
      {$schema: {
        id: Number.required().min(4).max(4)
      }}
    ]).should.be.length(0);

    validate(o, [
      {$schema: {
        id: Number.required().min(5),
        name: Number
      }}
    ]).should.be.length(2);

    validate({id: 'asd'}, [
      {$schema: {
        id: Number
      }}
    ]).should.be.length(1);

    validate({}, [
      {$schema: {
        id: Number.required()
      }}
    ]).should.be.length(1);

    validate({
      type: 'Big'
    }, [
      {$schema: {
        type: String.oneOf(['Big', 'Small', 'Medium'])
      }}
    ]).should.be.length(0);

    validate({
      type: 'Tiny'
    }, [
      {$schema: {
        type: String.oneOf(['Big', 'Small', 'Medium'])
      }}
    ]).should.be.length(1);


  });

  it('String.cardinalityAgnostic', function () {
    testObjs = [{id: 5, name: ['hello world']}, {id: 5, name: 'hello world'}]

    _.forEach(testObjs, function (o) {
      validate(o, [
        {$schema: {
          name: String.cardinalityAgnostic()
        }}
      ]).should.be.length(0);

      validate(o, [
        {$schema: {
          name: String.cardinalityAgnostic()
        }}
      ]).should.be.length(0);

      validate(o, [
        {$schema: {
          name: String.min(20).cardinalityAgnostic()
        }}
      ]).should.be.length(1);

      validate(o, [
        {$schema: {
          name: String.max(1).cardinalityAgnostic()
        }}
      ]).should.be.length(1);

      validate(o, [
        {$schema: {
          name: String.regexp(/hello/).cardinalityAgnostic()
        }}
      ]).should.be.length(0);

      validate(o, [
        {$schema: {
          name: String.regexp(/hello^/).cardinalityAgnostic()
        }}
      ]).should.be.length(1);

      validate(o, [
        {$schema: {
          name: String.len(11).cardinalityAgnostic()
        }}
      ]).should.be.length(0);

      validate(o, [
        {$schema: {
          name: String.len(1).cardinalityAgnostic()
        }}
      ]).should.be.length(1);
    });
  });

  it('String', function () {
    var o = {id: 5, name: 'hello world'};
    validate(o, [
      {$schema: {
        name: String
      }}
    ]).should.be.length(0);

    validate(o, [
      {$schema: {
        name: String.min(20)
      }}
    ]).should.be.length(1);

    validate(o, [
      {$schema: {
        name: String.max(1)
      }}
    ]).should.be.length(1);

    validate(o, [
      {$schema: {
        name: String.regexp(/hello/)
      }}
    ]).should.be.length(0);

    validate(o, [
      {$schema: {
        name: String.regexp(/hello^/)
      }}
    ]).should.be.length(1);

    validate(o, [
      {$schema: {
        name: String.len(11)
      }}
    ]).should.be.length(0);

    validate(o, [
      {$schema: {
        name: String.len(1)
      }}
    ]).should.be.length(1);

  });

  it('Boolean', function () {

    validate({
      yes: true
    }, [
      {$schema: {
        yes: Boolean
      }}
    ]).should.be.length(0);

    validate({
    }, [
      {$schema: {
        yes: Boolean.required()
      }}
    ]).should.be.length(1);

    validate({
      yes: 'true'
    }, [
      {$schema: {
        yes: Boolean
      }}
    ]).should.be.length(1);

  });

  it('Array', function () {

    validate({
      value: []
    }, [
      {$schema: {
        value: Array.min(0)
      }}
    ]).should.be.length(0);

    validate({
      value: [1]
    }, [
      {$schema: {
        value: Array.min(1)
      }}
    ]).should.be.length(0);

    validate({
      value: [1, 2]
    }, [
      {$schema: {
        value: Array.max(1)
      }}
    ]).should.be.length(1);

    validate({
      value: [1, 2, 3]
    }, [
      {$schema: {
        value: Array.len(1)
      }}
    ]).should.be.length(1);

    validate({
      value: [1, 2, 3]
    }, [
      {$schema: {
        value: Array.len(3).oneOf([1, 2])
      }}
    ]).should.be.length(1);

    validate({
      value: [1, 2, 3]
    }, [
      {$schema: {
        value: Array.typeOf(Number)
      }}
    ]).should.be.length(0);

    validate({
      value: ['1', '2', 3]
    }, [
      {$schema: {
        value: Array.typeOf(String)
      }}
    ]).should.be.length(1);


    validate({
      value: [1, 2, 3, 0]
    }, [
      {$schema: {
        value: Array.typeOf(Number.min(1))
      }}
    ]).should.be.length(1);

  });

  it('Function', function () {

    var arr = [1, 2, 3, 4];

    validate({
      custom: arr
    }, [
      {$schema: {
        custom: Function.required().fn(function (item) {
          return item === arr ? undefined : 'Not the same!';
        })
      }}
    ]).should.be.length(0);

    validate({
      custom: [1, 2, 3, 4]
    }, [
      {$schema: {
        custom: Function.required().fn(function () {
          return 'Not valid';
        }),
        custom2: Function.required().fn(function () {
          return 'Not valid2';
        })
      }}
    ]).should.be.length(2);

    var o = {
      custom: [1, 2, 3, 4]
    };
    validate(o, [
      {$schema: {
        custom: Function.fn(function (value, key, object) {
          object.should.be.equal(o);
          value.should.be.equal(o.custom);
          return 'Not valid';
        })
      }}
    ]).should.be.length(1);

  });

  it('Object', function () {

    validate({
      o: {}
    }, {
      o: Object
    }).should.be.length(0);

    validate({
      o: 4
    }, {
      o: Object
    }).should.be.length(1);

    var errors = validate({
      o: {
        a: [],
        b: ['Skerla']
      }
    }, {
      o: Object.required().fn(function (object, keyPath) {
        should(keyPath).match(/^o$/);

        return this.$schema(object, {
          a: Array.required().fn(arrayCheck),
          b: Array.required().typeOf(String).fn(arrayCheck)
        });

        function arrayCheck(array, keyPath) {
          should(keyPath).match(/^o\.(a|b)$/);
          if (~array.indexOf('Skerla')) {
            this.errors.push('Well, array at path `' + keyPath + '` cannot contain string "Skerla".');
          }
        }
      })
    });

    expect(errors).to.contain('Well, array at path `o.b` cannot contain string "Skerla".');
  });

  it('Custom', function () {

    validate({
      custom: [1, 2, 3, 4]
    }, [
      {$schema: {
        custom: function (item) {
          return item === 0 ? undefined : '`custom` should be zero';
        }
      }}
    ]).should.be.length(1);

  });

  it('should work with nested properties', function () {
    validate({
      person: {
        name: 'Andrius'
      }
    }, [
      {$schema: {
        'person.name': String.regexp(/Andrius/)
      }}
    ]).should.be.length(0);

    validate({
      person: {
        name: 'Andrius'
      }
    }, [
      {$schema: {
        'person.name': Number
      }}
    ]).should.be.length(1);
  });

});
