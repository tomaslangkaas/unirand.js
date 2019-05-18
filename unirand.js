var unirand = (function(){

  unirand.version = 'v0.0.1';
  unirand.extract = extract;
  unirand.expand  = expand;

  function extract(state, range){
    var value = -1,
        largestMultiple = state.range - (state.range % range);
    if(state.value < largestMultiple){
      value = state.value % range;
      state.value = (state.value - value) / range;
      state.range = largestMultiple / range;
    }else{
      state.value = state.value - largestMultiple;
      state.range = state.range - largestMultiple;
    }
    return value;
  }

  function expand(state, value, range){
    state.value = state.value * range + value;
    state.range = state.range * range;
  }

  function process(state){
    var result;
    while(state.requests.length && state.requests[0].range <= state.range){
      result = extract(state, state.requests[0].range);
      if(result > -1){
        state.requests[0].callback(result + state.requests[0].offset);
        state.requests.shift();
      } 
    }
    if(state.requests.length && !state.wait){
      state.wait = true;
      state.getRandom(function(result, min, max){
        if(max - min > 0){
          expand(state, result - min, max - min + 1)
          state.wait = false;
          process(state);
        }
      })
    }   
  }

  function unirand(getRandom){
    var state = {
      value: 0,
      range: 1,
      requests: [],
      wait: false,
      getRandom: getRandom
    };
    return {
      request: function(cb, min, max){
        if(typeof cb === 'function' && max - min > 0){
          state.requests.push({
            callback: cb,
            range: max - min + 1,
            offset: min
          });
          process(state);
        }
      },
      state: function(){
        return {
          value: state.value, 
          range: state.range
        };
      },
      getRandom: getRandom
    }
  }

  return unirand;
})();