/* eslint-disable import/prefer-default-export */

import { Container } from 'pixi.js';
import { GameObject } from './GameObject';
import { isTickable, ITick } from './ITick';

export class Scene {
  tickers: ITick[] = [];

  gameObjects: GameObject[] = [];

  readonly stage: Container;

  constructor(stage: Container) {
    this.stage = stage;
  }

  deactivateAll(): void {
    this.gameObjects.forEach((g) => {
      g.deactivate();
    });
  }

  addGameObject(g: GameObject): void {
    this.stage.addChild(g);
    this.gameObjects.push(g);

    if (isTickable(g)) {
      this.addTicker(g);
    }
    g.deactivate();
  }

  addTicker(g: ITick): void {
    this.tickers.push(g);
  }

  tick(delta: number) {
    for (let i = 0; i < this.tickers.length; i += 1) {
      this.tickers[i].tick(delta);
    }
  }
}
