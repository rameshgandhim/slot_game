/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { Text } from 'pixi.js';
import { GameObject } from './GameObject';
import { GameResult, MathEngine } from './MathEngine';
import { TextStyle } from './Style';

export class SlotWinPanel extends GameObject {
  texts: Text[] = [];

  constructor(private mathEngine: MathEngine) {
    super();
  }

  buildWinPanel(gameResult: GameResult) {
    console.log('total Win', gameResult.totalWin);
    this.clearWin();
    const winText = new Text(`Total wins: ${gameResult.totalWin}`, TextStyle);
    winText.name = 'Total Win';
    winText.x = 100;
    winText.y = 295;
    this.addText(winText);
    for (let i = 0; i < gameResult.pays.length; i += 1) {
      const pay = gameResult.pays[i];
      const symbols = this.mathEngine.getSymbolListFromGrid(gameResult.grid, pay.GridPoints);
      const str = `- payline ${pay.PayLineId}, ${this.calculateX(symbols)}, ${pay.Win}`;
      const text = new Text(str, TextStyle);
      text.name = `payline-${i}`;
      text.x = 100;
      text.y = 295 + 50 * (i + 1);
      this.addText(text);
    }
  }

  addText(text: Text) {
    this.addChild(text);
    this.texts.push(text);
  }

  clearWin() {
    if (this.texts) {
      for (let i = 0; i < this.texts.length; i += 1) {
        const t = this.texts[i];
        this.removeChild(t);
      }
    }
  }

  private calculateX(symbols: string[]): string {
    return `${symbols[0]} x${symbols.length}`;
  }
}
