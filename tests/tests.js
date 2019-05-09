var tests = (function(){

  return passage('unirand() tests')

  .add('unirand() is a function', function(done, equals){
    done(typeof unirand === 'function');
  })

  .add('unirand.version is a string', function(done, equals){
    done(typeof unirand.version === 'string');
  })

  .add('unirand().state() defaults to [0,1]', function(done, equals){
    done(equals(unirand().state(), [0,1]));
  })

})();