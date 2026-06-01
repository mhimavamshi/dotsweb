class Executor {
    constructor(agent) {
        this.agent = agent;
        this.dsl = agent.dsl;

        this.ip = 0;

        this.pending = [];

        this.stack = [];
    }

    readMemory(key) {
        return this.agent.memory?.[key];
    }

    writeMemory(key, value) {
        if (!this.agent.memory) {
            this.agent.memory = {};
        }

        this.agent.memory[key] = value;
    }

    readSense(key) {
        return this.agent.senses?.[key];
    }

    execute(instr) {
        switch (instr.op) {

            case "PUSH_CONST":
                this.stack.push(instr.value);
                break;

            case "PUSH_MEMORY":
                this.stack.push(
                    this.readMemory(instr.key)
                );
                break;

            case "PUSH_SENSE":
                this.stack.push(
                    this.readSense(instr.key)
                );
                break;

            case "STORE_MEMORY": {
                const value = this.stack.pop();

                this.writeMemory(
                    instr.key,
                    value
                );
                break;
            }

            case "ADD": {
                const right = this.stack.pop();
                const left = this.stack.pop();

                this.stack.push(left + right);
                break;
            }

            case "SUB": {
                const right = this.stack.pop();
                const left = this.stack.pop();

                this.stack.push(left - right);
                break;
            }

            case "MUL": {
                const right = this.stack.pop();
                const left = this.stack.pop();

                this.stack.push(left * right);
                break;
            }

            case "DIV": {
                const right = this.stack.pop();
                const left = this.stack.pop();

                this.stack.push(left / right);
                break;
            }

            case "MOD": {
                const right = this.stack.pop();
                const left = this.stack.pop();

                this.stack.push(left % right);
                break;
            }

            case "GT": {
                const right = this.stack.pop();
                const left = this.stack.pop();

                this.stack.push(left > right);
                break;
            }

            case "LT": {
                const right = this.stack.pop();
                const left = this.stack.pop();

                this.stack.push(left < right);
                break;
            }

            case "GTE": {
                const right = this.stack.pop();
                const left = this.stack.pop();

                this.stack.push(left >= right);
                break;
            }

            case "LTE": {
                const right = this.stack.pop();
                const left = this.stack.pop();

                this.stack.push(left <= right);
                break;
            }

            case "EQ": {
                const right = this.stack.pop();
                const left = this.stack.pop();

                this.stack.push(left === right);
                break;
            }

            case "NEQ": {
                const right = this.stack.pop();
                const left = this.stack.pop();

                this.stack.push(left !== right);
                break;
            }

            case "JUMP":
                this.ip = instr.target;
                return;

            case "JUMP_IF_FALSE": {
                const cond = this.stack.pop();

                if (!cond) {
                    this.ip = instr.target;
                    return;
                }

                break;
            }

            case "MOVE": {
                const dir = instr.args[0];
                if (dir === "up") {
                    this.addPendingAction("MOVE", {x: 0, y: -this.agent.UNIT});
                }

                if (dir === "down") {
                    this.addPendingAction("MOVE", {x: 0, y: this.agent.UNIT});
                }

                if (dir === "left") {
                    this.addPendingAction("MOVE", {y: 0, x: -this.agent.UNIT});
                }

                if (dir === "right") {
                    this.addPendingAction("MOVE", {y: 0, x: this.agent.UNIT});
                }

                break;
            }

            case "COLOR": {
                const color = instr.args[0];
                this.addPendingAction("COLOR", color);

                break;
            }

        }

        this.ip++;
    }
    
    addPendingAction(action, data) {
        this.pending.push({type: action, data: data});
    }

    tick() {

        this.pending = [];
        this.stack = [];

        this.ip = 0;

        while (this.ip < this.dsl.length) {

            const instr = this.dsl.get(this.ip);

            if (!instr) {
                break;
            }

            this.execute(instr);
        }
    }

}

export {
    Executor
};