const OP_PREC = {
    ASSIGNMENT: 1,
    NOT: 2,
    COMPARISON: 3,
    ADDITIVE: 4,
    MULTIPLICATIVE: 5,
    ISVOID: 6,
    COMPLEMENT: 7,
    AT: 8,
    DOT: 9
};


module.exports = grammar({
    name: 'cool',

    extras: $ => [
        /\s/,
        $.comment
    ],

    rules: {
        source_file: $ => repeat(seq($.class, ';')),

        class: $ => seq(
            'class',
            $.type,
            optional(seq('inherits', $.type)),
            '{',
            repeat(seq($.feature, ';')),
            '}'
        ),

        feature: $ => choice(
            $.attribute,
            $.method,
        ),

        attribute: $ => seq(
            field('attribute_name', $.id),
            ':',
            $.type,
            optional(seq('<-', $.expr))
        ),

        method: $ => seq(
            field('method_name', $.id),
            '(',
            optional(
                seq($.formal, repeat(seq(',', $.formal)))
            ),
            ')',
            ':',
            $.type,
            '{',
            $.expr,
            '}'
        ),

        formal: $ => seq(
            $.id,
            ':',
            $.type
        ),

        expr: $ => choice(
            $.assign_expr,
            $.dispatch_expr,
            $.static_dispatch_expr,
            $.self_dispatch_expr,
            $.if_expr,
            $.while_expr,
            $.block_expr,
            $.let_expr,
            $.case_expr,
            $.new_expr,
            $.unary_expr,
            $.binary_expr,
            seq('(', $.expr, ')'),
            $.id,
            $.integer,
            $.string,
            'true',
            'false',
            'self'
        ),

        assign_expr: $ => prec.right(OP_PREC.ASSIGNMENT, seq(
            $.id,
            '<-',
            $.expr
        )),

        dispatch_expr: $ => prec.left(OP_PREC.DOT, seq(
            $.expr,
            '.',
            field('method_name', $.id),
            '(',
            optional($.arg_list),
            ')'
        )),

        static_dispatch_expr: $ => prec.left(OP_PREC.DOT, seq(
            $.at_expr,
            '.',
            field('method_name', $.id),
            '(',
            optional($.arg_list),
            ')'
        )),

        at_expr: $ => prec.left(OP_PREC.AT, seq(
            $.expr,
            '@',
            $.type
        )),

        self_dispatch_expr: $ => seq(
            field('method_name', $.id),
            '(',
            optional($.arg_list),
            ')'
        ),

        if_expr: $ => seq(
            'if',
            $.expr,
            'then',
            $.expr,
            'else',
            $.expr,
            'fi'
        ),

        while_expr: $ => seq(
            'while',
            $.expr,
            'loop',
            $.expr,
            'pool'
        ),

        block_expr: $ => seq(
            '{',
            repeat1(seq($.expr, ';')),
            '}'
        ),

        let_expr: $ => seq(
            'let',
            $.id,
            ':',
            $.type,
            optional(seq('<-', $.expr)),
            repeat(seq(',', $.id, ':', $.type, optional(seq('<-', $.expr)))),
            'in',
            $.expr
        ),

        case_expr: $ => seq(
            'case',
            $.expr,
            'of',
            repeat1(seq(
                $.id,
                ':',
                $.type,
                '=>',
                $.expr,
                ';'
            )),
            'esac'
        ),

        new_expr: $ => seq(
            'new',
            $.type
        ),

        unary_expr: $ => choice(
            prec.right(OP_PREC.NOT, seq('not', $.expr)),
            prec.right(OP_PREC.COMPLEMENT, seq('~', $.expr)),
            prec.right(OP_PREC.COMPLEMENT, seq('isvoid', $.expr)),
        ),

        binary_expr: $ => choice(
            prec.left(OP_PREC.COMPARISON, seq($.expr, '<', $.expr)),
            prec.left(OP_PREC.COMPARISON, seq($.expr, '<=', $.expr)),
            prec.left(OP_PREC.COMPARISON, seq($.expr, '=', $.expr)),
            prec.left(OP_PREC.ADDITIVE, seq($.expr, '+', $.expr)),
            prec.left(OP_PREC.ADDITIVE, seq($.expr, '-', $.expr)),
            prec.left(OP_PREC.MULTIPLICATIVE, seq($.expr, '*', $.expr)),
            prec.left(OP_PREC.MULTIPLICATIVE, seq($.expr, '/', $.expr)),
        ),

        arg_list: $ => seq(
            $.expr,
            repeat(seq(',', $.expr))
        ),

        integer: $ => /\d+/,

        string: $ => seq(
            '"',
            repeat(choice(
                token.immediate(prec(1, /[^"\\\n]+/)),
                $.escape_sequence,
            )),
            '"',
        ),

        escape_sequence: $ => token.immediate(seq(
            '\\',
            /./
        )),


        type: $ => /[A-Z][a-zA-Z0-9_]*/,
        id: $ => /[a-z][a-zA-Z0-9_]*/,

        // todo: add (*...*) comments
        comment: $ => choice(
            $.single_line_comment,
        ),

        single_line_comment: $ => /--[^\n]*/,
    }

});

