class Resolver {
    constructor(agents) {
        this.agents = agents;
    }

    resolve() {
        // for now, just approve
        for(const agent of this.agents) {
            agent.executePending();
        }
    }

    update() {
        for(const agent of this.agents) {
            agent.tick();
        }
        this.resolve();
    }
}

export { Resolver };