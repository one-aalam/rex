let activeEffect: any;

export class Dep {
    _value: any;
    subscribers: any;
    // Initialize the value of the reactive dependency
    constructor(value: any) {
        this._value = value
        this.subscribers = new Set()
    }

    // Getter of the dependency. Executed when a part of the software reads the value of it.
    get value() {
        this.depend()
        return this._value
    }

    // Setter of the dependency. Executed when the value changes

    set value(newValue) {
        this._value = newValue
        this.notify()
    }

    // Subscribe a new function as observer to the dependency
    depend() {
        if (activeEffect) this.subscribers.add(activeEffect);
    }

    // Notify subscribers of a value change
    notify() {
        this.subscribers.forEach((subscriber: () => any) => subscriber())
    }
}

export class DepX {
    subscribers: any = new Set();
    // Subscribe a new function as observer to the dependency
    depend() {
        if (activeEffect) this.subscribers.add(activeEffect);
    }

    // Notify subscribers of a value change
    notify() {
        this.subscribers.forEach((subscriber: () => any) => subscriber())
    }
}

export function watchEffect(fn: () => void) {
    const wrappedFn = () => {
        activeEffect = wrappedFn
        // clean up the deps
        fn()
        activeEffect = null
    }

    wrappedFn();
}