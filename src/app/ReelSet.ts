/* eslint-disable import/prefer-default-export */
import { Application, Graphics } from 'pixi.js';
import { GameObject } from './GameObject';
import { SlotReel } from './Reel';
import { ReelBand } from './Math';
import { Tweener } from './Tween';

export class ReelSet extends GameObject {
  reels: SlotReel[] = [];

  reelWidth = 250;

  symbolSize = 240;

  symbolSpacing = 10;

  reelMargin: { x?: number, y?: number } = { x: 10, y: 10 };

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
      const reel = new SlotReel(this.tweener, this.symbolSize, reelBand);
      reel.x = i * this.reelWidth + (this.reelMargin.x ?? 0);
      reel.y = (this.reelMargin.y ?? 0);
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
}
