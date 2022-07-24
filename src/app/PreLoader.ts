/* eslint-disable import/prefer-default-export */
import * as PIXI from 'pixi.js';
import { GameObject } from './GameObject';
import { TextStyle } from './Style';
import { IResizable } from './ITick';
import { Application } from 'pixi.js';

export class PreloaderScreen extends GameObject implements IResizable {
  loadingText: PIXI.Text;

  constructor(app: Application) {
    super();
    const loadingTextD = new PIXI.Text('Loading...', TextStyle);
    loadingTextD.y = app.screen.height / 2;
    this.addChild(loadingTextD);
    this.loadingText = new PIXI.Text('0%', TextStyle);
    this.loadingText.name = 'Loading Text';
    this.loadingText.x = 0;
    this.loadingText.y = 0;
    // winText.width = 500;
    this.addChild(this.loadingText);
    this.resize(app.screen.width, app.screen.height);
  }

  resize(width: number, height: number): void {
    this.loadingText.y = height - 40;
    this.x = width / 2;
    this.anchorX = 0.5;
  }

  setProgress(p: number): void {
    this.loadingText.text = `${p}%`;
  }
}
