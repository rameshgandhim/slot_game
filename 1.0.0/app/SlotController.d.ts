import { Loader, Application, Sprite } from 'pixi.js';
import { SlotMath } from './Math';
import { ReelSet } from './ReelSet';
import { Tweener } from './Tween';
import { GameObject } from './GameObject';
import { MathEngine, GameResult } from './MathEngine';
import { SlotWinPanel } from './SlotWinPanel';
import { Scene } from './Scene';
export declare class SlotController extends GameObject {
    private loader;
    private tweener;
    private app;
    private scene;
    readonly math: SlotMath;
    reelSet: ReelSet;
    mathEngine: MathEngine;
    spinButton: Sprite;
    winPanel: SlotWinPanel;
    constructor(loader: Loader, tweener: Tweener, app: Application, scene: Scene);
    resize(): void;
    debugMath(): void;
    createReelSet(): ReelSet;
    createWinPanel(): SlotWinPanel;
    createSpinButton(): Sprite;
    onSpinButton(): void;
    private setReelOutcome;
    printLog(result: GameResult): void;
    private calculateX;
}
