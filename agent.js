// my idea next is simply to have programmable agents - DSLs that tick and change variables of the agent. each agent has its own exec context
// well have to decide if its wrap around or camera panning on infinite grid. given screen - infinite grid seems fine,  with camera panning (Screen to event registry key events)

import { Executor } from "./execution.js";
class Agent {
    constructor(pos, dsl) {
        this.pos = pos;
        this.UNIT = 1;

        this.dsl = dsl;
        this.executionctx = new Executor(this);
    }

    tick() {
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