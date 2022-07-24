/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable arrow-body-style */
/* eslint-disable no-useless-constructor */
/* eslint-disable import/prefer-default-export */
import { SlotMath, PayLineList, ComboList } from './Math';

export type SymbolGrid = string[]
export type ReelGrid = SymbolGrid[]
export type PayResult = {
  Combo: ComboList
  PayLine: PayLineList
}

export type ReelGridPoint = {
  reelIdx: number,
  symbolIdx: number
}

export type Pay = {
  PayLineId: number,
  GroupId: number,
  GridPoints: ReelGridPoint[],
  Win: number,
}

export type GameResult = {
  totalWin: number,
  stops: number[],
  pays: Pay[]
  grid: ReelGrid
}

const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export class MathEngine {
  constructor(private math: SlotMath) { }

  playOneGame(bet: number): GameResult {
    const stops = this.generateReelStops();
    return this.playOneGameWithStops(bet, stops);
  }

  playOneGameWithStops(bet: number, stops: number[]): GameResult {
    const reelGrid = this.getReelGrid(stops);
    const winCombo = this.evaluate(reelGrid);
    const gameResult = this.generatePayWins(reelGrid, bet, stops, winCombo);
    return gameResult;
  }

  generatePayWins(grid: ReelGrid,
    bet: number,
    stops: number[], payResult: PayResult[]): GameResult {
    const pays: Pay[] = [];
    let totalWin = 0;

    for (let i = 0; i < payResult.length; i += 1) {
      const winInfo = payResult[i];
      totalWin += winInfo.Combo.win * bet;

      const reelGridPoints: ReelGridPoint[] = [];
      for (let sId = 0; sId < winInfo.PayLine.PayLines.length; sId += 1) {
        const point = winInfo.PayLine.PayLines[sId];
        if (!this.isSymbolAny(sId, winInfo.Combo.SymbolList)) {
          reelGridPoints.push({
            reelIdx: point.ReelIndex,
            symbolIdx: point.SymolIndex,
          });
        }
      }
      const pay: Pay = {
        PayLineId: +winInfo.PayLine.PayLineId,
        GroupId: winInfo.Combo.Group,
        GridPoints: reelGridPoints,
        Win: winInfo.Combo.win,
      };
      pays.push(pay);
    }
    return {
      totalWin,
      pays,
      stops,
      grid,
    };
  }

  generateReelStops(): number[] {
    const stops: number[] = [];
    for (let i = 0; i < this.math.ReelBands.length; i += 1) {
      const reel = this.math.ReelBands[i];
      stops.push(generateRandomNumber(0, reel.Band.length));
    }
    return stops;
  }

  getReelGrid(stops: number[]): ReelGrid {
    const grid: ReelGrid = [];

    for (let i = 0; i < stops.length; i += 1) {
      const stop = stops[i];
      const reelBand = this.math.ReelBands[i];
      let strip = reelBand.Band.slice(stop, this.math.Config.ReelHeight + stop);
      if (strip.length < this.math.Config.ReelHeight) {
        strip = [...strip, ...reelBand.Band.slice(0, this.math.Config.ReelHeight - strip.length)];
      }
      grid.push(strip);
    }
    return grid;
  }

  evaluate(reelGrid: ReelGrid): PayResult[] {
    const paylines = this.math.PayLineList;
    const comboList = this.math.ComboList;
    const hitPaylines: PayResult[] = this.findMatchingPaylines(paylines, reelGrid, comboList);
    // let winCombo: PayResult[] = [];
    // for (let i = 0; i < hitPaylines.length; i += 1) {
    //   const payLine = hitPaylines[i];
    //   const win = this.findWinCombo(reelGrid, payLine);
    //   winCombo = [...winCombo, ...win];
    // }
    return hitPaylines;
  }

  getSymbolListFromGrid(grid: ReelGrid, points: ReelGridPoint[]): string[] {
    const symbols: string[] = [];

    for (let index = 0; index < points.length; index += 1) {
      const point = points[index];
      symbols.push(grid[point.reelIdx][point.symbolIdx]);
    }
    return symbols;
  }

  findWinCombo(reelGrid: ReelGrid, payLine: PayLineList): PayResult[] {
    const matchPaylines: Map<number, PayResult> = new Map<number, PayResult>();
    for (let cId = 0; cId < this.math.ComboList.length; cId += 1) {
      const c = this.math.ComboList[cId];

      for (let pId = 0; pId < payLine.PayLines.length; pId += 1) {
        const pay = payLine.PayLines[pId];
        const sym = reelGrid[pay.ReelIndex][pay.SymolIndex];
        if (sym !== c.SymbolList[pId] && !this.isSymbolAny(pId, c.SymbolList)) {
          break;
        }

        if (matchPaylines.has(c.Group)) {
          const existing = matchPaylines.get(c.Group);
          if (existing && existing.Combo.win > c.win) {
            break;
          }
        }
        matchPaylines.set(c.Group, {
          Combo: c,
          PayLine: payLine,
        });
      }
    }
    const combo = [...matchPaylines.values()];
    return combo;
  }

  private findMatchingPaylines(paylines: PayLineList[],
    reelGrid: ReelGrid, comboList: ComboList[]): PayResult[] {
    const matchPaylines: Map<number, PayResult> = new Map<number, PayResult>();

    for (let cId = 0; cId < comboList.length; cId += 1) {
      const combo = comboList[cId];
      for (let index = 0; index < paylines.length; index += 1) {
        const payline = paylines[index];
        if (this.isMatch(reelGrid, payline, combo)) {
          if (matchPaylines.has(combo.Group)) {
            const existing = matchPaylines.get(combo.Group);
            if (existing && existing.Combo.win > combo.win) {
              break;
            }
          }
          matchPaylines.set(combo.Group, {
            Combo: combo,
            PayLine: payline,
          });
        }
      }
    }

    return [...matchPaylines.values()];
  }

  isSymbolAny(index: number, symbols: string[]): boolean {
    let isAny = true;
    if (index < symbols.length) {
      isAny = symbols[index] === 'any';
    }
    return isAny;
  }

  isMatch(reelGrid: ReelGrid, payline: PayLineList, combo: ComboList): boolean {
    let match = true;

    for (let payId = 0; payId < payline.PayLines.length; payId += 1) {
      const symbol = combo.SymbolList[payId];
      const payLineAt = payline.PayLines[payId];
      const symbolAt = reelGrid[payLineAt.ReelIndex][payLineAt.SymolIndex];
      if (symbolAt !== symbol && !this.isSymbolAny(payId, combo.SymbolList)) {
        match = false;
        break;
      }
    }
    return match;
  }
}
