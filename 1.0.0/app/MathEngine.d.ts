import { SlotMath, PayLineList, ComboList } from './Math';
export declare type SymbolGrid = string[];
export declare type ReelGrid = SymbolGrid[];
export declare type PayResult = {
    Combo: ComboList;
    PayLine: PayLineList;
};
export declare type ReelGridPoint = {
    reelIdx: number;
    symbolIdx: number;
};
export declare type Pay = {
    PayLineId: number;
    GroupId: number;
    GridPoints: ReelGridPoint[];
    Win: number;
};
export declare type GameResult = {
    totalWin: number;
    stops: number[];
    pays: Pay[];
    grid: ReelGrid;
};
export declare class MathEngine {
    private math;
    constructor(math: SlotMath);
    playOneGame(bet: number): GameResult;
    playOneGameWithStops(bet: number, stops: number[]): GameResult;
    generatePayWins(grid: ReelGrid, bet: number, stops: number[], payResult: PayResult[]): GameResult;
    generateReelStops(): number[];
    getReelGrid(stops: number[]): ReelGrid;
    evaluate(reelGrid: ReelGrid): PayResult[];
    getSymbolListFromGrid(grid: ReelGrid, points: ReelGridPoint[]): string[];
    findWinCombo(reelGrid: ReelGrid, payLine: PayLineList): PayResult[];
    private findMatchingPaylines;
    isSymbolAny(index: number, symbols: string[]): boolean;
    isMatch(reelGrid: ReelGrid, payline: PayLineList, combo: ComboList): boolean;
}
