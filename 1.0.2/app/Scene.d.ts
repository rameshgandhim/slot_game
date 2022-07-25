import { Container } from 'pixi.js';
import { GameObject } from './GameObject';
import { ITick } from './ITick';
export declare class Scene {
    tickers: ITick[];
    gameObjects: GameObject[];
    readonly stage: Container;
    constructor(stage: Container);
    deactivateAll(): void;
    addGameObject(g: GameObject): void;
    addTicker(g: ITick): void;
    tick(delta: number): void;
    show(visible: boolean): void;
}
