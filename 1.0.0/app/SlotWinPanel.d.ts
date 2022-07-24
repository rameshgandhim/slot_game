import { Text } from 'pixi.js';
import { GameObject } from './GameObject';
import { GameResult, MathEngine } from './MathEngine';
export declare class SlotWinPanel extends GameObject {
    private mathEngine;
    texts: Text[];
    constructor(mathEngine: MathEngine);
    buildWinPanel(gameResult: GameResult): void;
    addText(text: Text): void;
    clearWin(): void;
    private calculateX;
}
