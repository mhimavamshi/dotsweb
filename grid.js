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

    drawVerticalLines(ctx) {
        let currX = -this.SIZE.width / 2;
        ctx.beginPath();
        while (currX <= this.SIZE.width / 2) {
            ctx.moveTo(currX, -this.SIZE.height / 2);
            ctx.lineTo(currX, this.SIZE.height / 2);
            currX += this.CELL_SIZE.width;
        }

        ctx.stroke();

    }

    drawHorizontalLines(ctx) {
        let currY = -this.SIZE.height / 2;

        ctx.beginPath();
        while (currY <= this.SIZE.height / 2) {
            ctx.moveTo(-this.SIZE.width / 2, currY);
            ctx.lineTo(this.SIZE.width / 2, currY);
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
    

    draw(ctx) {
        ctx.strokeStyle = "white";
        this.drawVerticalLines(ctx);
        this.drawHorizontalLines(ctx);
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