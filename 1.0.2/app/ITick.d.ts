export interface ITick {
    tick(delta?: number): void;
}
export interface IResizable {
    resize(width: number, height: number): void;
}
export declare function isTickable(arg: unknown): arg is ITick;
