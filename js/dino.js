import { incrementCustomProperty, getCustomProperty, setCustomProperty } from "./updateCustomProperty.js";

const dinoElement = document.querySelector("[data-dino]");
const JUMP_SPEED = 0.45;
const GRAVITY = 0.002;
const DINO_FRAME_COUNT = 2;
const FRAME_TIME = 100;

let isJumping;
let dinoFrame;
let currentFrameTime;
let ySpeed = 0;

export function setupDino() {
   isJumping = false;
   dinoFrame = 0;
   currentFrameTime = 0;
   setCustomProperty(dinoElement, "--bottom", 0)
};

export function updateDino(delta, speedScale) {
   handleRun(delta, speedScale);
   handleJump(delta);

   document.addEventListener("keydown", onJump);
};

export function getDinoRect() {
   return dinoElement.getBoundingClientRect();
}

export function setDinoLose() {
   dinoElement.src = `../imgs/dino-lose.png`;
}

function handleRun(delta, speedScale) {
   if(isJumping) {
      dinoElement.src = `../imgs/dino-stationary.png`;
      return
   }

   if(currentFrameTime >= FRAME_TIME) {
      dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT;
      dinoElement.src = `../imgs/dino-run-${dinoFrame}.png`
      currentFrameTime -= FRAME_TIME;
   }
   currentFrameTime += delta * speedScale;
};

function handleJump(delta) {
   if(!isJumping) return;

   incrementCustomProperty(dinoElement, "--bottom", ySpeed * delta);

   if(getCustomProperty(dinoElement, "--bottom") <= 0) {
      setCustomProperty(dinoElement, "--bottom", 0)
      isJumping = false;
   }
   ySpeed -= GRAVITY * delta;
};

function onJump(e) {
   if(e.code !== "Space" || isJumping) return;

   ySpeed = JUMP_SPEED;
   isJumping = true;
}