export class Store {
    constructor(state) {
        this.state = state;
        this.listeners = [];
    }

    setState(newState) {
        this.state = newState;
        this.informListeners();
    }

    updateState(newState) {
        this.state = {
            ...this.state,
            ...newState
        };
        this.informListeners();
    }

    getState() {
        return this.state;
    }

    informListeners() {
        for (const listener of this.listeners) {
            listener(this.state);
        }
    }

    subscribe(listener) {
        this.listeners.push(listener)
    }

    unsubscribe(listenerToRemove) {
        this.listeners = this.listeners.filter(iListener => iListener !== listenerToRemove);
    }
}