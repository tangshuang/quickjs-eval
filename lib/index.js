var defer = require('./eval.js')()

function getInstance() {
  return defer.then((Module) => {
    var rawEval = Module.cwrap('eval', 'string', ['string'])

    function wrappedEval(code) {
      var result = rawEval(code)
      try {
        return JSON.parse(result)
      } catch (e) {
        throw result // stacktrace string
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

function evalFn(code) {
  return getInstance().eval(code)
}

module.exports = {
  getInstance: getInstance,
  eval: evalFn,
}
