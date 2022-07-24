/* eslint-disable import/prefer-default-export */
import { Application, Graphics } from 'pixi.js';
import { GameObject } from './GameObject';
import { SlotReel } from './Reel';
import { ReelBand } from './Math';
import { Tweener } from './Tween';
import { ITick } from './ITick';

export class ReelSet extends GameObject implements ITick {
  reels: SlotReel[] = [];

  reelWidth = 125;

  symbolSize = 120;

  symbolSpacing = 10;

  reelMargin: { x?: number, y?: number } = { x: 10, y: 10 };

  running = false;

  constructor(private reelBands: ReelBand[],
    private tweener: Tweener,
    private app: Application) {
    super();
  }

  postInitialize(): void {
    this.buildReels();
  }

  buildReels(): void {
    for (let i = 0; i < this.reelBands.length; i += 1) {
      const reelBand = this.reelBands[i];
      const reel = new SlotReel(this.tweener, this.symbolSize, reelBand, i);
      reel.x = i * this.reelWidth + (this.reelMargin.x ?? 0);
      reel.y = (this.reelMargin.y ?? 0);
      reel.onReelSpinComplete = () => this.onComplete(i);
      this.reels.push(reel);
      this.addChild(reel);
      reel.margin = this.symbolSpacing;
      reel.postInitialize();
    }

    this.buildMargin();
  }

  buildMargin(): void {
    const screenHeight = this.app.screen.height;
    const screenWidth = this.app.screen.width;
    // this.y = margin - 15;
    // this.x = Math.round(screenWidth - this.reelWidth * this.reels.length);
    console.log('reels x : y: ', this.x, this.y, screenWidth, screenHeight);
    const mask = new Graphics();
    const maskHeight = (
      this.symbolSize
      + this.symbolSpacing
      + (this.symbolSpacing / 2)) * this.reels[0].reelHeight;
    mask.drawRect(0, 0, screenWidth, maskHeight);
    console.log('draw rect for ', maskHeight);
    this.addChild(mask);
    this.mask = mask;
  }

  startSpin() {
    if (this.running) {
      return;
    }
    this.running = true;

    for (let i = 0; i < this.reels.length; i += 1) {
      const r = this.reels[i];
      r?.startSpin();
    }
  }

  onComplete(reel: number): void {
    if (reel === this.reels.length - 1) {
      this.stop();
    }
  }

  stop(): void {
    this.running = false;
  }

  tick(): void {
    if (this.running) {
      for (let i = 0; i < this.reels.length; i += 1) {
        const r = this.reels[i];
        r.spin();
      }
    }
  }
}
