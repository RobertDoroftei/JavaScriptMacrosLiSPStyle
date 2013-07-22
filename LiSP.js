var functions = {};
function bubble(x){
  return x;

//we can't, yet, really bubble
/*
  The main reason of bubble() is to be able to use Arrays.
  Right now all we can use inside defun or list is anything except Arrays --->
  as arrays are transformed in lists (pretty circular this one)
*/

  return function(to_do){
      if(to_do){
        return to_do(x);
      }
    return x;
  }
}
var notdef = bubble(undefined);
var nil = bubble(null);

function cons(){
  if(arguments.length == 0){
    return [nil, nil];
  }
  if(arguments.length == 1){
    return [bubble(arguments[0]),nil];
  }
  return [bubble(arguments[0]), bubble(arguments[1])];
}
function not(x){
  if(x()){
    return true;
  }
  return false;
}
function atom(x){
  if(Object.prototype.toString.call(x) === "[object Array]"){
      return false;
  }
  return true;
}
function is_array(x){
  if(Object.prototype.toString.call(x) === "[object Array]"){
      return true;
  }
  return false;

}

function car(x){
  if(!atom(x)){
    return x[0];
  }
  return notdef;
}
function vcar(x){
  return car(x)();
}
function cdr(x){
  if(!atom(x)){
    return x[1];
  }
  return notdef;
}


function vcdr(x){
  return cdr(x)();
}
function fif(question, if_true, if_false){
  if(question){
    return if_true();
  }
  return if_false();
}
function lif(x){
  if(car(x)()){
    return car(cdr(x))();
  }
  return car(cdr(cdr(x)))();
}
function is_null(x){
  if(!x){
    return true;
  }
  return false;
}
function concat(){
  var l = arguments[0];
  function run(x){
    return fif(atom(car(x)),function(){
      return fif(cdr(x), function(){
        return ""+car(x)+""+run(cdr(x))+"";
      }, function(){
        return ""+car(x)+"";
      });
    }, function(){
      return fif(cdr(x), function(){
        return ""+concat(car(x))+""+run(cdr(x))+"";
      },function (){
        return ""+concat(car(x))+"";
      });
    });
  }
  return run(l);
}
function not(x){
  if(x(is_null) || x == undefined){

    return true;
  }
  return false;
}
function and(x){
  if(not(cdr(x))){
    return false;
  }
}
function array_length(a){
  return a.length;
}
function is_eq_or_heigher_than(i,j){
  return i>=j;
}
function list(){
  if(arguments.length == 0){
    return cons();
  }
  var a = arguments;
  if(arguments.length == 1 && is_array(arguments[0])){
    a = arguments[0];
  }

  function run(idx){
    return fif(is_eq_or_heigher_than(idx+1,array_length(a)),
              function (){
                  if(atom(a[idx])){
                    return cons(a[idx]);
                  }else{
                    return cons(list(a[idx]));
                  }
              },
              function(){
                if(atom(a[idx])){
                  return cons(a[idx],run(idx+1));
                }else{
                  return cons(list(a[idx]),run(idx+1));
                }
              });
  }
  return run(0);
}
function concat_with(l,separator){
  function run(x){
    return fif(atom(car(x)),function(){
      return fif(cdr(x), function(){
        return ""+car(x)+separator+run(cdr(x))+"";
      }, function(){
        return ""+car(x)+"";
      });
    }, function(){
      return fif(cdr(x), function(){
        return ""+concat_with(car(x),separator)+separator+run(cdr(x))+"";
      },function (){
        return ""+concat_with(car(x),separator)+"";
      });
    });
  }
  return run(l);
}



function func(name){
  return functions[name];
}


function construct_call(x){
  var doing =car(x);
  return fif(doing=="label", function(){
    //list(label,name, parameters, body);
    var function_name = car(cdr(x));
    var function_parameters = car(cdr(cdr(x)))
    var function_body = car(cdr(cdr(cdr(x))));
    return "function "+function_name+"("+expand_parameters(function_parameters)+"){"+expand(function_body)+"}";
  }, function(){

    return fif(func(doing), function(){
      return "("+fun(doing).toString().replace(/\n/g," ")+")("+expand_parameters(car(cdr(x)))+")";
    }, function(){

      return doing+"("+expand_parameters(car(cdr(x)))+")";
    });
  });
}
function expand(x){
  return fif(atom(car(x)), function(){
    return fif(cdr(x), function(){
      return concat(list(car(x),";",expand(cdr(x))))
    }, function(){
      return concat(list("return ",car(x),";"));
    });
  },
  //if not an atom -> means it must be a call of some sort, let's check it out
  function(){
    return fif(cdr(x), function(){
      return concat(list(construct_call(car(x)),";",expand(cdr(x))));
    }, function(){
      return concat(list("return ",construct_call(car(x))));
    });
  });
}
function expand_parameters(x){
  return fif(atom(car(x)),function(){
    return fif(cdr(x), function(){
      return concat_with(list(car(x),expand_parameters(cdr(x))),",");
    }, function(){
      return car(x)+"";
    });
  }, function(){
    return fif(cdr(x), function(){
      return concat_with(list(construct_call(car(x)),expand_parameters(cdr(x))),",");
    }, function(){
      return construct_call(car(x));
    });
  });
}
function fun(func_name){
  var the_func = func(func_name);
  var parameters = car(the_func);
  var body = cdr(the_func);
  return Function(expand_parameters(parameters),expand(body));
}

function defun(x){
  var name = car(x);
  var parameters = car(cdr(x));
  var body = car(cdr(cdr(x)));

  functions[name] = cons(parameters, body);
}
function char_at(idx, str){
  return str.charAt(idx);
}
function rand_number(top){
  return Math.floor(Math.random()*top);
}
function str_lenght(str){
  return str.length;
}
function is_equal(x,y){
  return x==y;
}
