import { Executor } from "./execution.js";
class Agent {
    constructor(pos, dsl) {
        this.pos = pos;
        this.UNIT = 1;
        this.color = "red";

        this.dsl = dsl;
        this.executionctx = new Executor(this);

        this.memory = structuredClone(dsl.initialMemory);
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

    setColor(data) {
        this.color = data;
    }

    executePending() {
        // get all this.executionctx.pending; map to same function name and directly execute
        const pending = this.executionctx.pending;
        // console.log(`executing: ${JSON.stringify(pending)}`);

        for (const action of pending) {
            this.executeAction(action);
        }

        this.executionctx.pending = [];
    }

    executeAction(action) {
        switch(action.type) {
            // even here, if we have action type mapped directly to this.func name, then just pass the args
            // for example, this has this.action.type func and called with action.data
            case "MOVE":
                this.move(action.data);
                break;
            case "COLOR":
                this.setColor(action.data);
                break;
            default:
                throw new Error(`Unknown action: ${action.type}`);
        }
    }

}

export { Agent };