class Node {
    constructor(type) {
        this.type = type;
    }
}

class ProgramNode extends Node {
    constructor(body) {
        super("PROGRAM");
        this.body = body;
    }
}

class BlockNode extends Node {
    constructor(statements) {
        super("BLOCK");
        this.statements = statements;
    }
}

class ActionNode extends Node {
    constructor(action, args) {
        super("ACTION");
        this.action = action;
        this.args = args;                                                                                                                                                                           
    }
}

class MemoryAccessNode extends Node {
    constructor(key) {
        super("MEMORY_ACCESS");
        this.key = key;
    }
}

class AssignmentNode extends Node {
    constructor(left, right) {
        super("ASSIGNMENT");
        this.left = left;
        this.right = right;
    }
}

class IfElseNode extends Node {
    constructor(condition, thenBody, elseBody) {
        super("IF_ELSE");
        this.condition = condition;
        this.thenBody = thenBody;
        this.elseBody = elseBody;
    }
}

class LiteralNode extends Node {
    constructor(value) {
        super("LITERAL");
        this.value = value;
    }
}

class SenseNode extends Node {
    constructor(name) {
        super("SENSE");
        this.name = name;
    }
}

class BinaryOpNode extends Node {
    constructor(operator, left, right) {
        super("BINARY_OP");
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
}

export {
    ProgramNode,
    BlockNode,

    ActionNode,

    MemoryAccessNode,
    AssignmentNode,

    IfElseNode,

    LiteralNode,
    SenseNode,
    BinaryOpNode
};