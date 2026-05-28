import { Screen } from "./screen.js";
import { Grid } from "./grid.js";
import { EventRegistry } from "./eventregistry.js";
import { Agent } from "./agent.js";

const canvas = document.getElementById("worldCanvas");
const ctx = canvas.getContext("2d");

const screen = new Screen(canvas, ctx);
const size = { width: canvas.width, height: canvas.height };
const grid = new Grid(size);
let agents = [];
const eventregistry = new EventRegistry();

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
        let agent = new Agent(pos);
        agents.push(agent);
    }
}
populateAgents(5);

function setUpEvents() {

    grid.registerEvents(eventregistry);
    for (const agent of agents) {
        agent.registerEvents(eventregistry);
    }


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


function drawWorld(ctx) {
    let positions = [];
    for (const agent of agents) {
        positions.push(agent.pos);
    }

    grid.draw(ctx);
    grid.drawCells(ctx, positions);
}

function drawUI(ctx) {

}

setUpEvents();
function loop() {
    screen.draw(drawWorld, drawUI);

    requestAnimationFrame(loop);
}

loop();