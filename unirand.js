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

  function callback(){
    
  }

  function unirand(getRandom){
    var state = {
      value: 0,
      range: 1,
      requests: [],
      wait: false
    };
    return {
      request: function(cb, max, min){
        if(typeof cb === 'function'){
          state.requests.push([
            cb, max|0, min|0
          ]);
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