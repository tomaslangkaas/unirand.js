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

  function unirand(getRandom){
    var state = {
      value: 0,
      range: 1
    };
    return {
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