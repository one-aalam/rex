import { DepX } from './dep';

export function reactive(
    obj: { [x: string]: any; },
    notifier: (key: string | number, value: string | number ) => void) {
    const Dep: { [x: string]: any; } = {
        target: null
    }
    Object.keys(obj).forEach((key) => {
        return obj.hasOwnProperty(key) && typeof obj[key] === 'function' ?
            makeComputed(obj, key, Dep) : makeReactive(obj, key, notifier, Dep)
    });
    return obj
}

export const makeReactive = (
    obj: { [x: string]: any; },
    key: string | number,
    notifier: (key: string | number, value: string | number) => void,
    Dep: any ) =>  {
    let value = obj[key];
    let deps: any[] = [];
    Object.defineProperty(obj, key, {
        get() {
            if (Dep.target) {
                if (!deps.includes(Dep.target)) {
                    deps.push(Dep.target)
                }
            }
            return value
        },
        set(newValue) {
            if (newValue !== value) {
                value = newValue
                if (deps.length) {
                    deps.forEach(notifier)
                }
                notifier(key, value);
                Dep.cache = null;
            }
        },
    })
}



export const makeComputed = (
    obj: { [x: string]: any; },
    key: string | number,
    Dep: any ) =>  {
    Dep.cache = null;
    const computeFunc = obj[key];
    Object.defineProperty(obj, key, {
        get() {
            if (!Dep.target) {
                Dep.target = key
            }
            if (!Dep.cache) {
                Dep.cache = computeFunc.call(obj)
            }
            Dep.target = null;
            return Dep.cache;
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
