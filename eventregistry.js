class EventRegistry {

    constructor() {
        this.callbacks = {
            mouseClick: []
        };
    }

    register(callbacks) {
        for (const event in callbacks) {

            if (!this.callbacks[event]) {
                this.callbacks[event] = [];
            }

            this.callbacks[event].push(callbacks[event]);
        }
    }

    emit(event, ...args) {

        if (!this.callbacks[event]) {
            return;
        }

        for (const callback of this.callbacks[event]) {
            callback(...args);
        }
    }

}

export { EventRegistry };

// class EventRegistry {

//     constructor(events = []) {
//         this.callbacks = {};

//         for (const event of events) {

//             this.callbacks[event] = [];

//             this[event] = (...args) => {
//                 this.emit(event, ...args);
//             };
//         }
//     }

//     register(callbacks) {
//         for (const event in callbacks) {

//             if (!this.callbacks[event]) {
//                 this.callbacks[event] = [];
//             }

//             this.callbacks[event].push(callbacks[event]);
//         }
//     }

//     emit(event, ...args) {

//         if (!this.callbacks[event]) {
//             return;
//         }

//         for (const callback of this.callbacks[event]) {
//             callback(...args);
//         }
//     }

// }