/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */

import { Loader, Application, Sprite, Texture } from 'pixi.js';
import { SlotMath } from './Math';
import { ReelSet } from './ReelSet';
import { Tweener } from './Tween';
import { GameObject } from './GameObject';
import { MathEngine, GameResult } from './MathEngine';
import { SlotWinPanel } from './SlotWinPanel';
import { Scene } from './Scene';

export class SlotController extends GameObject {
  readonly math: SlotMath;

  reelSet: ReelSet;

  mathEngine: MathEngine;

  spinButton: Sprite;

  winPanel: SlotWinPanel;

  constructor(private loader: Loader,
    private tweener: Tweener,
    private app: Application,
    private scene: Scene) {
    super();
    this.math = this.loader.resources.math.data;
    this.mathEngine = new MathEngine(this.math);
    this.reelSet = this.createReelSet();
    this.scene.addTicker(this.reelSet);
    this.addChild(this.reelSet);
    this.spinButton = this.createSpinButton();
    this.winPanel = this.createWinPanel();
    this.reelSet.postInitialize();
    this.debugMath();

    this.reelSet.anchorX = 0.5;
    this.resize();
  }

  resize() {
    const centerX = this.app.screen.width / 2;
    this.reelSet.x = centerX;
    this.spinButton.x = centerX;
    this.winPanel.x = centerX;
    this.winPanel.y = this.spinButton.y + this.spinButton.height + 10;
  }

  debugMath() {
    const result = this.mathEngine.playOneGameWithStops(1, [0, 11, 1, 10, 14]);
    this.printLog(result);
    const result1 = this.mathEngine.playOneGameWithStops(1, [0, 0, 0, 0, 0]);
    this.printLog(result1);
  }

  createReelSet(): ReelSet {
    const reelSet = new ReelSet(this.math.ReelBands, this.tweener, this.app);
    return reelSet;
  }

  createWinPanel(): SlotWinPanel {
    const winPanel = new SlotWinPanel(this.mathEngine);
    // winPanel.anchorX = 0.5;
    this.addChild(winPanel);
    return winPanel;
  }

  createSpinButton(): Sprite {
    const button = new Sprite(Texture.from('spin'));
    const buttonSize = 120;
    button.anchor.set(0.5);
    button.x = this.app.screen.width / 2;
    button.y = this.math.Config.ReelHeight
    * this.reelSet.symbolSize
    + this.reelSet.symbolSpacing
    * (this.math.Config.ReelHeight + 1) + 10;
    button.scale.x = Math.min(buttonSize / button.width, buttonSize / button.height);
    button.scale.y = button.scale.x;
    button.pivot.set(0.5, 0);
    button.anchor.set(0.5, 0);

    button.interactive = true;
    button.buttonMode = true;

    button
      // Mouse & touch events are normalized into
      // the pointer* events for handling different
      // button events.
      .on('pointerdown', () => this.onSpinButton());

    this.addChild(button);
    return button;
  }

  onSpinButton(): void {
    const result = this.mathEngine.playOneGame(1);
    this.setReelOutcome(result);
    this.winPanel.buildWinPanel(result);
    this.winPanel.anchorX = 0.5;
    this.printLog(result);
  }

  private setReelOutcome(result: GameResult) {
    if (this.reelSet) {
      for (let i = 0; i < this.reelSet.reels.length; i += 1) {
        const r = this.reelSet.reels[i];
        r.clearSymbols();
        r.setStrip(result.stops[i]);
      }
      // disable spinning.
      // this.reelSet.startSpin();
    }
  }

  printLog(result: GameResult): void {
    console.log('==========');
    console.log('positions : ', result.stops.join(','));
    console.log('Reel Grid');
    for (let index = 0; index < result.grid.length; index += 1) {
      const symbols = result.grid[index];
      console.log(symbols.join(' '));
    }
    console.log('Reel Grid By Reels');

    for (let sId = 0; sId < result.grid[0].length; sId += 1) {
      const symbols: string[] = [];
      for (let rId = 0; rId < result.grid.length; rId += 1) {
        symbols.push(result.grid[rId][sId]);
      }
      console.log(symbols.join(' '));
    }
    console.log('Total Win : ', result.totalWin);

    for (let index = 0; index < result.pays.length; index += 1) {
      const pay = result.pays[index];
      const symbols = this.mathEngine.getSymbolListFromGrid(result.grid, pay.GridPoints);
      console.log(`- payline ${pay.PayLineId}, ${this.calculateX(symbols)}, ${pay.Win}`);
    }
    console.log('==========');
  }

  private calculateX(symbols: string[]): string {
    return `${symbols[0]} x${symbols.length}`;
  }
}
