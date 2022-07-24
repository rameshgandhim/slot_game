import * as PIXI from 'pixi.js';
import { GameObject } from './GameObject';
import { IResizable } from './ITick';
import { Application } from 'pixi.js';
export declare class PreloaderScreen extends GameObject implements IResizable {
    loadingText: PIXI.Text;
    constructor(app: Application);
    resize(width: number, height: number): void;
    setProgress(p: number): void;
}
