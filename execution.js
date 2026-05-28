class Executor {
    constructor(agent) {
        this.agent = agent;
        this.ip = 0;
        this.dsl = this.agent.dsl;
        this.pending = [];
    }

    execute(instr) {
        if (instr.op !== "move") {
            return;
        }

        if(instr.dir === "up") this.pending.push({move: {x: 0, y: -this.agent.UNIT}});
        if(instr.dir === "down") this.pending.push({move: {x: 0, y: this.agent.UNIT}});
        if(instr.dir === "left") this.pending.push({move: {x: -this.agent.UNIT, y: 0}});
        if(instr.dir === "right") this.pending.push({move: {x: this.agent.UNIT, y: 0}});  
    } 


    tick() {
        this.pending = [];
        if (this.ip >= this.dsl.length) {
            this.ip = 0;
        } // ideally we reset and loop maybe? or have jumps in dsl
        const instr = this.dsl.get(this.ip);
        this.execute(instr);
        this.ip++;
    }
}

// for now; add syntax checks, parsing and all later
class DSL {
    constructor() {
        this.instructions = [];
    }

    add(instructions) {
        this.instructions = instructions;
    }

    get(i) {
        return this.instructions[i];
    }

    get length() {
        return this.instructions.length;
    }
    
}


export { Executor, DSL };

