function passage(name, param) {

  var oldError,
      params = param || {},
      lib = passage,
      tests = [],
      results = [],
      timers = [],
      passed = 0,
      speed = params.speed || 1,
      index = -1,
      i,
      suite = {
        name: name,
        run: run,
        add: add,
        stop: stop,
        start: start,
        results: results,
        tests: tests,
        total: 0,
        onprogress: function() {},
        progress: function(onprogress){
          suite.onprogress = onprogress;
          return this;
        }
      };

  function add(name, test) {
    var index = tests.length;
    if(typeof name === 'function'){
      test = name;
      name = '#' + index;
    }
    tests[index++] = [name, test];
    suite.total = index;
    return suite;
  }

  function run(param) {
    params = param || params;
    (lib.queue = lib.queue || []).push(suite);
    suite.queued = true;
    if (lib.queue.length === 1) {
      this.start();
    }
  }

  function start(param) {
    params = param || params;
    oldError = window.onerror;
    window.onerror = function(msg) {
      results[index] = msg;
      return !params.error;
    };
    passed = 0;
    index = -1;
    results.length = 0;
    timers.length = 0;
    for (i = 0; i < speed; i++) {
      timers[i] = setInterval(next, 0);
    }
  }

  function report(state) {
    suite.passed = passed;
    suite.failed = index - passed;
    suite.running = !state;
    suite.aborted = state && index < tests.length;
    suite.onprogress(suite);
  }

  function stop() {
    window.onerror = oldError;
    report(true);
    for (i = 0; i < timers.length; i++) {
      clearInterval(timers[i]);
    }
    if(suite.queued){
      lib.queue.shift();
      if (lib.queue.length) {
        lib.queue[0].start();
      }
    }
  }

  function next() {
    if (index === -1 || results[index] !== void 0) {
      suite.index = ++index;
      report();
      if (
        index >= tests.length ||
        (params.abort && index > 0 && results[index - 1] !== true)
      ) {
        stop();
      } else if (typeof tests[index][1] === "function") {
        tests[index][1](function(testResult) {
          results[index] =
            testResult === void 0 || testResult === true ?
            (passed++, true) :
            testResult;
        }, lib.equals);
      } else {
        throw "Missing test function";
      }
    }
  }

  return suite;
}

passage.equals = function (a, b, priorA, priorB) {
  var i = ""; // temp variable, default to empty string
  if (a === b) return true; // true if same type/value or same object reference
  if (typeof a !== typeof b) return false; // false if different types => falsy, 0 === [0], '' === []
  if (typeof a !== "object") return a + i === b + i; // primitive values are compared as strings
  if (a + i !== b + i) return false; // false if string representations of objects differ, [] === {}, {} === null
  //check prior objects for circularity
  if (!priorA) {
    priorA = [];
    priorB = [];
  } else {
    for (i = 0; i < priorA.length; i++) {
      if (priorA[i] === a) return priorB[i] === b;
      if (priorB[i] === b) return false; //priorA[i] !== a;
    }
  }
  priorA.push(a);
  priorB.push(b);
  for (i in a) {
    // check if a and b has same properties with same values, recursively
    if (
      a.hasOwnProperty(i) &&
      (!b.hasOwnProperty(i) || !passage.equals(a[i], b[i], priorA,
        priorB))
    )
      return false;
  }
  for (i in b) {
    // check if b has additional properties
    if (b.hasOwnProperty(i) && !a.hasOwnProperty(i)) return false;
  }
  return true;
}
