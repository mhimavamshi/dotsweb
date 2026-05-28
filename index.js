import { Screen } from "./screen.js";
import { Grid } from "./grid.js";
import { EventRegistry } from "./eventregistry.js";
import { Agent } from "./agent.js";
import { DSL } from "./execution.js";
import { Resolver } from "./resolver.js";

const canvas = document.getElementById("worldCanvas");
const ctx = canvas.getContext("2d");

const screen = new Screen(canvas, ctx);
const size = { width: canvas.width, height: canvas.height };
const grid = new Grid(size);
let agents = [];
const eventregistry = new EventRegistry();

let ticks = 0;
const TICKS_PER_FRAME = 5; 

let dsl = new DSL();
dsl.add(
    [
        {op: "move", dir: "up"},
        {op: "move", dir: "left"},
        {op: "move", dir: "up"},
        {op: "move", dir: "right"},
        {op: "move", dir: "right"},
        {op: "move", dir: "down"},
        {op: "move", dir: "down"}
    ]
)

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function populateAgents(n = 5) {
    const cols = size.width / grid.CELL_SIZE.width;
    const rows = size.height / grid.CELL_SIZE.height;
    const halfCols = Math.floor(cols / 2);
    const halfRows = Math.floor(rows / 2);


    for (let i = 0; i < n; i++) {
        let pos = {
            x: getRandomInt(-halfCols, halfCols - 1),
            y: getRandomInt(-halfRows, halfRows - 1)
        };
        let agent = new Agent(pos, dsl);
        agents.push(agent);
    }

    
}
populateAgents(1);

const resolver = new Resolver(agents);

function setUpEvents() {

    grid.registerEvents(eventregistry);

    screen.registerEvents(eventregistry);

    canvas.addEventListener("click", function (event) {
        const rect = canvas.getBoundingClientRect();

        const canvasX = event.clientX - rect.left;
        const canvasY = event.clientY - rect.top;

        const translatedX = canvasX - (canvas.width / 2);
        const translatedY = canvasY - (canvas.height / 2);

        eventregistry.emit("mouseClick", { x: translatedX, y: translatedY });

    });


    window.addEventListener("keydown", function (event) {
        eventregistry.emit("keyDown", event);
    });

}

function update() {
    resolver.update();
}


function drawWorld(ctx) {
    let positions = [];
    for (const agent of agents) {
        positions.push(agent.pos);
    }

    grid.draw(ctx, screen.camera);
    grid.drawCells(ctx, positions);
}

function drawUI(ctx) {

}

setUpEvents();
function loop() {

    ticks++;

    if (ticks >= TICKS_PER_FRAME) {
        update();
        ticks = 0;
    }


    screen.draw(drawWorld, drawUI);

    requestAnimationFrame(loop);
}

loop();