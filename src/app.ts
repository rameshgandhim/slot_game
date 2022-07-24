/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Application, Loader, Ticker,
} from 'pixi.js';
import * as PIXI from 'pixi.js';

// import { Tweener } from './app/Tween';
import { FPSMeter } from './app/FPSMeter';
import { Scene } from './app/Scene';
import { SlotAssets } from './app/assets';
import { SlotController } from './app/SlotController';
import { Tweener } from './app/Tween';

// Enables Pixi Dev tool to work
declare let window: Window & { PIXI: unknown };
window.PIXI = PIXI;

const bodyWidth = document.body.clientWidth;
const bodyHeight = document.body.clientHeight;
const canvasElement = document.getElementById('gameCanvas') as HTMLCanvasElement;

// create and append app
const app = new Application({
  backgroundColor: 0x808080, // grey
  sharedTicker: true,
  sharedLoader: true,
  // resolution: devicePixelRatio,
  resizeTo: canvasElement,
  antialias: true,
  view: canvasElement,
  width: bodyWidth,
  height: bodyHeight,
});

window.scrollTo(0, 1);

document.body.appendChild(app.view);
const loader = Loader.shared;
const ticker = Ticker.shared;
const tweener = new Tweener();
// preload needed assets
for (const k of Object.keys(SlotAssets)) {
  loader.add(k, SlotAssets[k]);
}

const setVariable = (element: string, variable: string, value: string | null) => {
  const el = document.getElementById(element);
  if (el) {
    el.style.setProperty(variable, value);
  }
};

loader.onProgress.add((p) => {
  setVariable('progressBar', '--w', `${p.progress.toString()}%`);
  setVariable('loader', '--p', p.progress.toString());
});

function closeLoadingScreen(): void {
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    loadingScreen.style.display = 'none';
  }
}

const scene = new Scene(app.stage);
scene.addTicker(tweener);
scene.deactivateAll();

function resize() {
  // app.stage.scale.x = window.innerWidth / bodyWidth;
  // app.stage.scale.y = window.innerHeight / bodyHeight;
  app.renderer.resize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', () => resize());

// when loader is ready
loader.load(() => {
  setTimeout(() => closeLoadingScreen(), 1000);

  const fpsMeter = new FPSMeter(ticker);

  scene.addGameObject(fpsMeter);
  fpsMeter.activate();
  const slot = new SlotController(loader, tweener, app, scene);
  scene.addGameObject(slot);
  slot.activate();
  window.addEventListener('resize', () => slot.resize());

  // closeLoadingScreen();
  ticker.add((delta: number) => {
    scene.tick(delta);
  });
});
