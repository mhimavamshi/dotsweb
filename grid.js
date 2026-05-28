class Grid {

    constructor(dims) {
        this.SIZE = dims;
        this.CELL_SIZE = { width: 50, height: 50 };
        this.filled = new Set();
        this.filledtemp = new Set();
    }

    indexToWorld(x, y) {
        return {
            x: x * this.CELL_SIZE.width,
            y: y * this.CELL_SIZE.height,
        }
    }

    cellIndex(point) {
        return {
            x: Math.floor(point.x / this.CELL_SIZE.width),
            y: Math.floor(point.y / this.CELL_SIZE.height)
        }
    }

    fillCell(point) {
        const index = this.cellIndex(point);
        this.filled.add(`${index.x},${index.y}`);
    }

    drawVerticalLines(ctx, camera) {
        const left = camera.x - this.SIZE.width / 2;
        const right = camera.x + this.SIZE.width / 2;

        let currX = Math.floor(left / this.CELL_SIZE.width) * this.CELL_SIZE.width;

        ctx.beginPath();

        while (currX <= right) {
            ctx.moveTo(currX, camera.y - this.SIZE.height / 2);
            ctx.lineTo(currX, camera.y + this.SIZE.height / 2);

            currX += this.CELL_SIZE.width;
        }

        ctx.stroke();
    }

    drawHorizontalLines(ctx, camera) {
        const top = camera.y - this.SIZE.height / 2;
        const bottom = camera.y + this.SIZE.height / 2;

        let currY = Math.floor(top / this.CELL_SIZE.height) * this.CELL_SIZE.height;

        ctx.beginPath();

        while (currY <= bottom) {
            ctx.moveTo(camera.x - this.SIZE.width / 2, currY);
            ctx.lineTo(camera.x + this.SIZE.width / 2, currY);

            currY += this.CELL_SIZE.height;
        }

        ctx.stroke();
    }

    drawFilled(ctx) {
        ctx.fillStyle = "red";

        for (const key of this.filled) {
            const [ix, iy] = key.split(",").map(Number);
            let { x, y } = this.indexToWorld(ix, iy);
            ctx.fillRect(
                x,
                y,
                this.CELL_SIZE.width,
                this.CELL_SIZE.height
            );
        }

    }

    drawCells(ctx, indices) {
        ctx.fillStyle = "red";

        for (const index of indices) {

            let {x, y} = this.indexToWorld(index.x, index.y);

            ctx.fillRect(
                x,
                y,
                this.CELL_SIZE.width,
                this.CELL_SIZE.height
            );
        }
    }
    

    draw(ctx, camera) {
        ctx.strokeStyle = "white";
        this.drawVerticalLines(ctx, camera);
        this.drawHorizontalLines(ctx, camera);
        this.drawFilled(ctx);
    }

    registerEvents(eventregistry) {

        eventregistry.register({
            mouseClick: (pos) => {
                // this.fillCell(pos);
            }
        });

    }

}

export { Grid };