
import { reactive } from './reactive';

export const store = (obj: { hasOwnProperty: (arg0: string) => any; [x: string]: any; }) => {
    const subscribers: {[x: string]: any; } = {}

    const subscribe = (key: string | number, onUpdateHandler: (value: string| number) => void) => {
        if(!subscribers[key]) subscribers[key] = [];
        subscribers[key].push(onUpdateHandler);
        return () => {
            console.log('Unsubscribe');
        }
    }

    const notify = (key: string | number, value: string | number) => {
        if(!subscribers[key] || subscribers[key].length < 1) return
        subscribers[key].forEach((handler: (value: string| number) => any) => handler(value))
    }

    return [
        reactive(obj, notify),
        subscribe,
    ]
}
