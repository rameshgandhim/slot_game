/* eslint-disable import/prefer-default-export */
import {
  Container,
} from 'pixi.js';

export class GameObject extends Container {
    localAnchorX = 0;

    localAnchorY = 0;

    activate(): void {
      this.visible = true;
    }

    deactivate(): void {
      this.visible = false;
    }

    set anchorX(value: number) {
      this.localAnchorX = value;
      this.pivot.x = value * (this.width / this.scale.x);
    }

    get anchorX(): number {
      return this.localAnchorX;
    }

    set anchorY(value: number) {
      this.localAnchorY = value;
      this.pivot.y = value * (this.height / this.scale.y);
    }

    get anchorY(): number {
      return this.localAnchorY;
    }
}
