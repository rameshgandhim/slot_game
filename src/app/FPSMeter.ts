/* eslint-disable import/prefer-default-export */
import { Ticker, Text } from 'pixi.js';
import { GameObject } from './GameObject';
import { ITick } from './ITick';

export class FPSMeter extends GameObject implements ITick {
  fps: Text;

  constructor(private ticker: Ticker) {
    super();
    this.fps = new Text('FPS: 0', { fill: 0xffffff });
    this.addChild(this.fps);
  }

  tick(): void {
    this.fps.text = `FPS: ${this.ticker.FPS.toFixed(2)}`;
  }
}
