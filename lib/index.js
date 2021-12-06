var defer = require('./eval.js')()

function getInstance() {
  return defer.then(function(Module) {
    var rawEval = Module.cwrap('eval', 'string', ['string'])

    function wrappedEval(code) {
      var result = rawEval(code)
      try {
        return JSON.parse(result)
      }
      catch (e) {
        var message = result + ';' + e.message
        throw new Error(message)
      }
    }

    function newFunction(argnames, body) {
      var code = 'function(' + argnames.join(',') + '){' + body + '}'
      return function() {
        var args = []
        for (var i = 0; i < arguments.length; i++) {
          args[i] = JSON.stringify(arguments[i])
        }
        return wrappedEval('(' + code + ')(' + args.join(',') + ')')
      }
    }

    return {
      eval: wrappedEval,
      newFunction: newFunction
    }
  })
}

function evalCode(code) {
  return getInstance().then(function(ins) {
    return ins.eval(code)
  })
}

function newFunction(args, body) {
  return getInstance().then(function(ins) {
    return ins.newFunction(args, body)
  })
}

function fn(fn) {
  var str = fn.trim()
  var begin = str.indexOf('{')
  var end = str.lastIndexOf('}')
  var head = str.substring(0, begin)
  var body = str.substring(begin + 1, end)
  var matched = head.match(/\((.*?)\)/)
  var argsStr = matched[1]
  var args = argsStr.split(',').map(function(item) { return item.trim() })

  return function() {
    var params = Array.prototype.slice.call(arguments, 1, arguments.length)
    return getInstance().then(function(ins) {
      var func = ins.newFunction(args, body)
      return func.apply(null, params)
    })
  }
}

module.exports = {
  getInstance: getInstance,
  eval: evalCode,
  newFunction: newFunction,
  fn: fn,
}
