var unirand = (function(){

  unirand.version = 'v0.0.1';

  function extract(state, range){

  }

  function expand(state, value, range){

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