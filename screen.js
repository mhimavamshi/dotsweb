function Point(x, y) {
    return { x, y };
}

class Screen {

    constructor(canvas, ctx) {
        this.camera = Point(0, 0);
        this.ctx = ctx;
        this.canvas = canvas;

        this.BACKGROUND_COLOR = "black";
    }

    draw(worldCallBack, screenCallBack) {
        this.switchToWorld();
        worldCallBack();
        this.switchToScreen();
        screenCallBack();
    }

    clear() {
        this.ctx.fillStyle = this.BACKGROUND_COLOR;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    switchToWorld() {
        this.clear();
        this.ctx.save();
        this.ctx.translate(
            this.canvas.width / 2 - this.camera.x,
            this.canvas.height / 2 - this.camera.y
        );
    }

    switchToScreen() {
        this.ctx.restore();
    }

}

export { Screen };