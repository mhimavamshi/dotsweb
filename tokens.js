class Token {
    constructor(startpos, endpos, value) {
        this.start = startpos;
        this.end = endpos;
        this.value = value;
        this.type = this.setType();
    }

    setType() {
        return null;
    }
}

// i know the subclasses are pointless, but it is what it is
class ActionToken extends Token {
    setType() {
        return "ACTION";
    }
}

class IfToken extends Token {
    setType() {
        return "IF";
    }
}

class ElseToken extends Token {
    setType() {
        return "ELSE";
    }
}

class RBraceToken extends Token {
    setType() {
        return "RBRACE";
    }
}

class LBraceToken extends Token {
    setType() {
        return "LBRACE";
    }
}

class SenseToken extends Token {
    setType() {
        return "SENSE";
    }
}

class MemoryToken extends Token {
    setType() {
        return "MEMORY";
    }
}

class AssignmentToken extends Token {
    setType() {
        return "ASSIGNMENT";
    }
}

class MathOpToken extends Token {
    setType() {
        return "MATHOP";
    }
}

class LiteralToken extends Token {
    constructor(start, end, value) {

        if (
            typeof value === "string" &&
            value.startsWith('"') &&
            value.endsWith('"')
        ) {
            value = value.slice(1, -1);
        }
        else if (!isNaN(value)) {
            value = Number(value);
        }

        super(start, end, value);
    }

    setType() {
        return "LITERAL";
    }
}

const fixed = {                                                                                                                                                                         
    "if": IfToken,
    "else": ElseToken,
    "{": LBraceToken,
    "}": RBraceToken,
    "=": AssignmentToken,
    "memory": MemoryToken,
    "sense": SenseToken,
}

// it'd be cool if we encode number of arguments ACTION token requires, so we can enforce during parsing
const actions = new Set([
    "move", "color"
]);

const isNumber = (str) => !isNaN(str) && !isNaN(parseFloat(str));
const isMathOp = (str) => ["+", "-", "*", "/", "%", ">", "<", "<=", ">=", "==", "!="].includes(str);
const isStringLiteral = (str) => str.startsWith('"') && str.endsWith('"');
const isIdentifier = (str) => actions.has(str); 

const multiple = [
    { check: isMathOp, target: MathOpToken },
    { check: isNumber, target: LiteralToken }, // i guess we can have NumberLiteral and StringLiteral instead of generic as we don't have many types anyway
    { check: isStringLiteral, target: LiteralToken },
    { check: isIdentifier, target: ActionToken }
];



function match(string) {
    if(string in fixed) {
        return { match: true, tokenclass: fixed[string] };
    }

    const rule = multiple.find(item => item.check(string));
    
    if (rule) {
        return { match: true, tokenclass: rule.target };
    }

    return { match: false, tokenclass: null };

}

export { ActionToken, IfToken, ElseToken, RBraceToken, LBraceToken, SenseToken, MemoryToken, AssignmentToken, MathOpToken, LiteralToken, match };
