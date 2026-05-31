import * as Tokens from "./tokens.js";
import { ProgramNode, BlockNode, ActionNode, MemoryAccessNode, AssignmentNode, IfElseNode, LiteralNode, SenseNode, BinaryOpNode } from "./ast.js";


function processCode(code) {
    return code.replace(/\s+/g, " ").trim();
}

function scan(code) {
    code = processCode(code);
    let start = 0;
    let len = code.length;
    let tokens = [];

    for (let i = 0; i <= len; i++) {
        const ch = code[i];

        if (i === len || ch == " ") {
            if (i > start) {
                const word = code.slice(start, i);

                const { match, tokenclass } = Tokens.match(word);

                if (match) {
                    tokens.push(
                        new tokenclass(start, i - 1, word)
                    );
                } else {
                    throw new Error(`Unknown token '${word}'`);
                }
            }

            start = i + 1;
        }
    }

    return tokens;
}

class ByteCodeEmitter {

    constructor(ast) {
        this.ast = ast;
        this.code = [];
    }

    emit(instr) {
        this.code.push(instr);
        return this.code.length - 1;
    }

    patch(index, target) {
        this.code[index].target = target;
    }

    address() {
        return this.code.length;
    }

    opcode(op) {
        switch (op) {
            case "+": return "ADD";
            case "-": return "SUB";
            case "*": return "MUL";
            case "/": return "DIV";
            case "%": return "MOD";

            case ">": return "GT";
            case "<": return "LT";
            case ">=": return "GTE";
            case "<=": return "LTE";
            case "==": return "EQ";
            case "!=": return "NEQ";

            default:
                throw new Error(
                    `Unknown operator '${op}'`
                );
        }
    }

    emitNode(node) {
        switch (node.type) {

            case "BLOCK":
                for (const child of node.statements) {
                    this.emitNode(child);
                }
                break;

            case "LITERAL":
                this.emit({
                    op: "PUSH_CONST",
                    value: node.value
                });
                break;

            case "MEMORY_ACCESS":
                this.emit({
                    op: "PUSH_MEMORY",
                    key: node.key
                });
                break;

            case "SENSE":
                this.emit({
                    op: "PUSH_SENSE",
                    key: node.name
                });
                break;

            case "BINARY_OP":
                this.emitNode(node.left);
                this.emitNode(node.right);

                this.emit({
                    op: this.opcode(node.operator)
                });
                break;

            case "ASSIGNMENT":
                this.emitNode(node.right);

                this.emit({
                    op: "STORE_MEMORY",
                    key: node.left.key
                });
                break;

            case "ACTION": {

                this.emit({
                    op: node.action.toUpperCase(),
                    args: node.args
                });

                break;
            }

            case "IF_ELSE": {

                this.emitNode(node.condition);

                const falseJump = this.emit({
                    op: "JUMP_IF_FALSE",
                    target: null
                });

                this.emitNode(node.thenBody);

                const endJump = this.emit({
                    op: "JUMP",
                    target: null
                });

                this.patch(
                    falseJump,
                    this.address()
                );

                this.emitNode(node.elseBody);

                this.patch(
                    endJump,
                    this.address()
                );

                break;
            }

            default:
                throw new Error(
                    `Cannot emit node type '${node.type}'`
                );
        }
    }

    bytecode() {

        for (const child of this.ast.body) {
            this.emitNode(child);
        }

        return this.code;
    }
}


class Parser {

    constructor(tokens) {
        this.tokens = tokens;
        this.pos = 0;
    }

    peek() {
        return this.tokens[this.pos] ?? null;
    }

    check(type) {
        return this.peek()?.type === type;
    }

    consume(type = null) {
        const token = this.peek();

        if (!token) {
            throw new Error(
                `Unexpected EOF${type ? `, expected ${type}` : ""}`
            );
        }

        if (type && token.type !== type) {
            throw new Error(
                `Expected ${type}, got ${token.type}`
            );
        }

        this.pos++;
        return token;
    }

    parse() {
        const nodes = [];

        while (this.peek()) {
            let node = null;

            switch (this.peek().type) {
                case "IF":
                    node = this.parseIfStatement();
                    break;

                case "ACTION":
                    node = this.parseAction();
                    break;

                case "MEMORY":
                    node = this.parseMemoryWrite();
                    break;

                default:
                    throw new Error(
                        `Unexpected token ${this.peek().type}`
                    );
            }

            if (node) {
                nodes.push(node);
            }
        }

        return new ProgramNode(nodes);
    }

    parseBlock() {
        const statements = [];

        while (this.peek() && !this.check("RBRACE")) {
            let node = null;

            switch (this.peek().type) {
                case "IF":
                    node = this.parseIfStatement();
                    break;

                case "ACTION":
                    node = this.parseAction();
                    break;

                case "MEMORY":
                    node = this.parseMemoryWrite();
                    break;

                default:
                    throw new Error(
                        `Unexpected token ${this.peek().type}`
                    );
            }

            if (node) {
                statements.push(node);
            }
        }

        return new BlockNode(statements);
    }

    parseAction() {
        const action = this.consume("ACTION").value;

        const args = [];

        while (this.check("LITERAL")) {
            args.push(
                this.consume("LITERAL").value
            );
        }

        return new ActionNode(action, args);
    }

    // parseMemoryWrite() {
    //     this.consume("MEMORY");

    //     const key = this.consume("LITERAL").value;

    //     const memoryNode = new MemoryAccessNode(key);

    //     if (this.check("ASSIGNMENT")) {
    //         this.consume("ASSIGNMENT");

    //         const right = this.parseExpression();

    //         return new AssignmentNode(
    //             memoryNode,
    //             right
    //         );
    //     }

    //     return memoryNode;
    // }

    parseMemoryWrite() {
        this.consume("MEMORY");

        const key = this.consume("LITERAL").value;

        const memoryNode = new MemoryAccessNode(key);

        if (!this.check("ASSIGNMENT")) {
            throw new Error(
                `Standalone memory access is not allowed`
            );
        }

        this.consume("ASSIGNMENT");

        const right = this.parseExpression();

        return new AssignmentNode(
            memoryNode,
            right
        );
    }

    precedence(type, value) {
        if (type !== "MATHOP") {
            return 0;
        }

        switch (value) {
            case ">":
            case "<":
            case ">=":
            case "<=":
            case "==":
            case "!=":
                return 10;

            case "+":
            case "-":
                return 20;

            case "*":
            case "/":
            case "%":
                return 30;
                

            default:
                return 0;
        }
    }

    parsePrefix() {
        const token = this.peek();

        if (!token) {
            throw new Error(
                "Unexpected EOF in expression"
            );
        }

        switch (token.type) {

            case "LITERAL":
                return new LiteralNode(
                    this.consume("LITERAL").value
                );

            case "MEMORY":
                this.consume("MEMORY");

                return new MemoryAccessNode(
                    this.consume("LITERAL").value
                );

            case "SENSE":
                this.consume("SENSE");

                return new SenseNode(
                    this.consume("LITERAL").value
                );

            default:
                throw new Error(
                    `Unexpected token ${token.type} in expression`
                );
        }
    }


    parseExpression(rbp = 0) {
        let left = this.parsePrefix();

        while (true) {
            const token = this.peek();

            if (!token || token.type !== "MATHOP") {
                break;
            }

            const bp = this.precedence(
                token.type,
                token.value
            );

            if (bp <= rbp) {
                break;
            }

            const op = this.consume("MATHOP");

            const right = this.parseExpression(bp);

            left = new BinaryOpNode(
                op.value,
                left,
                right
            );
        }

        return left;
    }

    parseIfStatement() {
        this.consume("IF");

        const condition = this.parseExpression();

        this.consume("LBRACE");

        const thenBody = this.parseBlock();

        this.consume("RBRACE");

        this.consume("ELSE");

        this.consume("LBRACE");

        const elseBody = this.parseBlock();

        this.consume("RBRACE");

        return new IfElseNode(
            condition,
            thenBody,
            elseBody
        );
    }
}



const bytecodecache = new Map();

class DSL {

    constructor(code) {
        this.code = code;
        this.instructions = [];

        this.parse();
    }

    parse() {

        const cached = bytecodecache.get(this.code);

        if (cached) {
            this.instructions = cached;
            return;
        }

        const tokens = scan(this.code);


        const parser = new Parser(tokens);
        const ast = parser.parse();

        const emitter = new ByteCodeEmitter(ast);
        const bytecode = emitter.bytecode();

        bytecodecache.set(
            this.code,
            bytecode
        );

        this.instructions = bytecode;
    }

    get(i) {
        return this.instructions[i];
    }

    get length() {
        return this.instructions.length;
    }
}

export { scan, Parser, ByteCodeEmitter, DSL };
