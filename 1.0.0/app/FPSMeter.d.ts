import { Ticker, Text } from 'pixi.js';
import { GameObject } from './GameObject';
import { ITick } from './ITick';
export declare class FPSMeter extends GameObject implements ITick {
    private ticker;
    fps: Text;
    constructor(ticker: Ticker);
    tick(): void;
}
