import { Executor } from "./execution.js";
class Agent {
    constructor(pos, dsl) {
        this.pos = pos;
        this.UNIT = 1;

        this.dsl = dsl;
        this.executionctx = new Executor(this);

        this.memory = {};
        this.senses = {};
    }

    buildSenses(grid) {
        // derive and update sensory data
    }

    tick() {
        this.buildSenses();
        this.executionctx.tick();
    }

    move(direction) {
        this.pos.x += direction.x;
        this.pos.y += direction.y;

        // console.log(`moved to ${JSON.stringify(this.pos)}`);
    }

    executePending() {
        // get all this.executionctx.pending; map to same function name and directly execute
        const pending = this.executionctx.pending;
        // console.log(`executing: ${JSON.stringify(pending)}`);

        for (const action of pending) {
            if (action.move) {
                this.move(action.move);
            }
        }

        this.executionctx.pending = [];
    }

}

export { Agent };