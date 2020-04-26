import { DepX } from './dep';

export function reactive(obj: { [x: string]: any; }, notifier: (key: string | number, value: string | number ) => void) {
    Object.keys(obj).forEach((key) => obj.hasOwnProperty(key) && makeReactive(obj, key, notifier))
    return obj
}

export const makeReactive = (obj: { [x: string]: any; }, key: string | number, notifier: (key: string | number, value: string | number) => void ) =>  {
    let value = obj[key];
    Object.defineProperty(obj, key, {
        get() {
            return value
        },
        set(newValue) {
            if (newValue !== value) {
                value = newValue
                notifier(key, value);
            }
        },
    })
}

export function reactiveDep(obj: { [x: string]: any; }) {
    Object.keys(obj).forEach((key) => obj.hasOwnProperty(key) && makeReactiveDep(obj, key))
    return obj
}

export const makeReactiveDep = (obj: { [x: string]: any; }, key: string | number ) =>  {
    const dep = new DepX();
    let value = obj[key];
    Object.defineProperty(obj, key, {
        get() {
            dep.depend()
            return value
        },
        set(newValue) {
            if (newValue !== value) {
                value = newValue
                dep.notify()
            }
        },
    })
}
