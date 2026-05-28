// my idea next is simply to have programmable agents - DSLs that tick and change variables of the agent. each agent has its own exec context
// well have to decide if its wrap around or camera panning on infinite grid. given screen - infinite grid seems fine,  with camera panning (Screen to event registry key events)
class Agent {
    constructor(pos) {
        this.pos = pos;
        this.UNIT = 1;
    }

    handleMovement(event) {
        if(event.key == "ArrowUp") this.pos.y -= this.UNIT;
        if(event.key == "ArrowDown") this.pos.y += this.UNIT;
        if(event.key == "ArrowLeft") this.pos.x -= this.UNIT;
        if(event.key == "ArrowRight") this.pos.x += this.UNIT;
    }

    registerEvents(eventregistry) {
        eventregistry.register({
            keyDown: (event) => {
                this.handleMovement(event);
                console.log(`new pos: ${JSON.stringify(this.pos)} after ${event.key}`);
            }
        });
    }

}

export { Agent };