import { Application } from 'pixi.js';
import { GameObject } from './GameObject';
import { SlotReel } from './Reel';
import { ReelBand } from './Math';
import { Tweener } from './Tween';
import { ITick } from './ITick';
export declare class ReelSet extends GameObject implements ITick {
    private reelBands;
    private tweener;
    private app;
    reels: SlotReel[];
    reelWidth: number;
    symbolSize: number;
    symbolSpacing: number;
    reelMargin: {
        x?: number;
        y?: number;
    };
    running: boolean;
    constructor(reelBands: ReelBand[], tweener: Tweener, app: Application);
    postInitialize(): void;
    buildReels(): void;
    buildMargin(): void;
    startSpin(): void;
    onComplete(reel: number): void;
    stop(): void;
    tick(): void;
}
