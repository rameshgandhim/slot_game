import { ITick } from './ITick';
export declare function lerp(a1: number, a2: number, t: number): number;
export declare function backout(amount: number): (a: number) => number;
export declare type Tween = {
    object: any;
    property: any;
    propertyBeginValue: any;
    target: any;
    easing: any;
    time: number;
    change?: (t: Tween) => void | null;
    complete?: (t: Tween) => void | null;
    start: number;
};
export declare class Tweener implements ITick {
    tweening: Tween[];
    tick(): void;
    tweenTo(object: any, property: any, target: any, time: number, easing: any, onchange?: (t: Tween) => void | null, oncomplete?: (t: Tween) => void | null): Tween;
    stop(t: Tween): void;
}
