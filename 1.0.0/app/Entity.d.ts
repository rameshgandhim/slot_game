import { Sprite, Texture, Resource } from 'pixi.js';
export declare type Entity = {
    sprite: Sprite;
    speed: number;
    direction: 'left' | 'right';
};
export declare const createEntity: (texture: Texture<Resource>, x: number, y: number) => Entity;
export declare const getNextEntityDirection: (viewWidth: number, c: Entity) => 'left' | 'right';
export declare const getNextEntityPosition: (c: Entity) => number;
