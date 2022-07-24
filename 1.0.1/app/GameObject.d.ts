import { Container } from 'pixi.js';
export declare class GameObject extends Container {
    localAnchorX: number;
    localAnchorY: number;
    activate(): void;
    deactivate(): void;
    set anchorX(value: number);
    get anchorX(): number;
    set anchorY(value: number);
    get anchorY(): number;
}
