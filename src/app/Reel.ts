/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { Sprite, Texture } from 'pixi.js';
import { BlurFilter } from '@pixi/filter-blur';
import { GameObject } from './GameObject';
import { backout, Tweener } from './Tween';
import { ReelBand } from './Math';

export class SlotReel extends GameObject {
  reelsContainer: GameObject | undefined;

  reelHeight = 3;

  margin = 10;

  spinDelay = 600;

  reelIndex = 0;

  symbols: Sprite[] = [];

  currPosition = 0;

  previousPosition = 0;

  blur = new BlurFilter();

  reelContainer: GameObject;

  constructor(private tweener: Tweener,
    private symbolSize: number,
    private reelBand: ReelBand) {
    super();
    this.name = reelBand.name;
    this.reelContainer = new GameObject();
    this.addChild(this.reelContainer);
    this.reelContainer.activate();
  }

  postInitialize(): void {
    this.buildReelStrip();
    this.blur.blurX = 0;
    this.blur.blurY = 0;
    this.filters = [this.blur];
    console.log('margin : ', this.margin);
  }

  buildReelStrip(): void {
    if (this.reelContainer) {
      for (let i = 0; i < this.reelBand.Band.length; i += 1) {
        const symbolTexture = this.reelBand.Band[i];
        const symbol = new Sprite();
        symbol.texture = Texture.from(symbolTexture);
        symbol.y = i * this.symbolY + this.margin;
        symbol.scale.x = Math.min(this.symbolSize / symbol.width, this.symbolSize / symbol.height);
        symbol.scale.y = symbol.scale.x;

        symbol.x = Math.round((this.symbolSize - symbol.width) / 2);
        this.symbols.push(symbol);
        this.reelContainer.addChild(symbol);
      }
    }
  }

  get symbolY(): number {
    return this.symbolSize + this.margin;
  }

  startSpin() {
    const extra = Math.floor(Math.random() * 3);
    const target = this.currPosition + 10 + this.reelIndex * 5 + extra;
    const time = 2500 + this.spinDelay + extra * 600;
    this.tweener.tweenTo(this,
      'currPosition',
      target,
      time,
      backout(0.5),
      undefined,
      () => this.onComplete());
  }

  spin() {
    this.blur.blurY = (this.currPosition - this.previousPosition) * 8;
    this.previousPosition = this.currPosition;

    // Update symbol positions on reel.
    for (let j = 0; j < this.symbols.length; j += 1) {
      const s = this.symbols[j];
      const prevy = s.y;
      s.y = ((this.currPosition + j) % this.symbols.length) * this.symbolY - this.symbolY;
      if (s.y < 0 && prevy > this.symbolSize) {
        // Detect going over and swap a texture.
        // This should in proper product be determined from some logical reel.
        s.texture = Texture.from(
          this.reelBand.Band[Math.floor(Math.random() * this.symbols.length)],
        );
        const scale = Math.min(
          this.symbolSize / s.texture.width, this.symbolSize / s.texture.height);
        s.scale.x = scale;
        s.scale.y = scale;
        s.x = Math.round((this.symbolSize - s.width) / 2);
      }
    }
  }

  setStrip(reel: ReelBand) {
    this.reelBand = reel;
    this.buildReelStrip();
  }

  setStop(index: number): void {
    this.reelContainer.y = this.symbolSize * index;
  }

  onComplete(): void {
  }
}
