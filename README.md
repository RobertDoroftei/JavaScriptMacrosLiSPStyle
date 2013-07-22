JavaScriptMacrosLiSPStyle
=========================

JavaScript Macros - LiSP style


<pre>
<code>

defun(list("add!", ["x","how_much"],[
  "x+how_much"
]));

defun(list("bla1",["x","y","z"],[
    "y=z+y",
    ["x",[ ["add!", ["y","z"] ] ]],
    ]));
defun(list("addone!", ["the_number"], [
  ["label","an_internal_function",["variable"],[
  ["add!",["variable","1"]]
  ]],
  ["an_internal_function",["the_number"]]
]));

defun(list("generate_any",["how_big"],
          ["var feed=\"0123456789abcdefghijklmnopqrstuvxyz\"",
          ["label","run",["len"],[
                   ["fif",[ ["is_equal",[  ["addone!", ["len"]]   ,"how_big"]],
                                   ["label","yes",[],[
                                            "\"_\""]],
                                    ["label","no",[],[
                                            ["concat",[
                                                    ["list",[
                                                      ["char_at",[ ["rand_number", 
                                                                      [["str_lenght",["feed"]]]],
                                                                   "feed"]],
                                                      ["run",[["addone!", ["len"]]]]
                                                    ]]
                                                    ]]]]]]]],
          ["concat",[["list",[ "\"gen_\"",["run",["0"]]]]]]]));
          
          
fun("generate_any")(15); //this will return a gen_randomstring_

</code>

</pre>
