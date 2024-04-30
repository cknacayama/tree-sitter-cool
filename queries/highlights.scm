[
 "class"
 "in"
 "inherits"
 "let"
] @keyword

[
 "while"
 "loop"
 "pool"
] @keyword.repeat

[
 "case"
 "esac"
 "of"
 "if"
 "fi"
 "then"
 "else"
] @keyword.conditional

[
 "isvoid"
 "new"
 "not"
] @keyword.operator

[
 "true"
 "false"
] @boolean

"self" @variable.builtin

[
  "," 
  ":"
  ";"
  "=>"
] @punctuation.delimiter

[
  "(" 
  ")" 
  "{" 
  "}" 
] @punctuation.bracket

[
 "."
 "@"
 "~"
 "*"
 "/"
 "+"
 "-"
 "<"
 "<="
 "="
 "<-"
] @operator

(type) @type
(id) @variable

(integer) @number
(comment) @comment

(escape_sequence) @string.escape
(string) @string

(method 
  method_name: (id) @function)
(dispatch_expr 
  method_name: (id) @function)
(static_dispatch_expr 
  method_name: (id) @function)
(self_dispatch_expr 
  method_name: (id) @function)

(attribute 
  attribute_name: (id) @property)
