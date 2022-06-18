import { updateGround, setupGround } from "./ground.js";
import { updateDino, setupDino, getDinoRect, setDinoLose } from "./dino.js";
import { updateCactus, setupCactus, getCactusRects } from "./cactus.js";


// Adaptive scaling for any window size
const WORLD_W = 100;
const WORLD_H = 25;
const SPEED_SCALE_INCREASE = 0.00001;

const world = document.querySelector('[data-world]');
const scoreElement = document.querySelector('[data-score]');
const highscoreElement = document.querySelector("[data-highscore-value]");
const startScreenElement = document.querySelector('[data-start-screen]');

function setPixelToWorldScale() {
   let worldToPixelScale;

   if(window.innerWidth / window.innerHeight < WORLD_W / WORLD_H) {
      worldToPixelScale = window.innerWidth / WORLD_W
   }
   else {
      worldToPixelScale = window.innerHeight / WINDOW_H;
   }
   world.style.width = `${WORLD_W * worldToPixelScale}px`;
   world.style.height = `${WORLD_H * worldToPixelScale}px`
}
setPixelToWorldScale();
window.addEventListener("resize", setPixelToWorldScale);

// Update Loop
let lastTime = 0;
let speedScale;
let score;

function update(time) {
   if(lastTime === 0) {
      lastTime = time;
      window.requestAnimationFrame(update);
      return
   }
   const delta = time - lastTime;
   updateGround(delta, speedScale);
   updateDino(delta, speedScale);
   updateCactus(delta, speedScale);
   updateSpeedScale(delta);
   updateScore(delta);
   if(checkLose()) return handleLose();

   lastTime = time;
   window.requestAnimationFrame(update);
};

function updateScore(delta) {
   score += delta * 0.01;
   scoreElement.textContent = Math.floor(score);
};

function updateSpeedScale(delta) {
   speedScale += delta * SPEED_SCALE_INCREASE;
}

// Start/Stop Game
document.addEventListener("keydown", handleStart, {once: true});

function handleStart() {
   lastTime = 0;
   speedScale = 0.95;
   score = 0;
   setupGround();
   setupDino();
   setupCactus();
   startScreenElement.classList.add('hide')
   window.requestAnimationFrame(update);
}

function handleLose() {
   setDinoLose();
   setTimeout(() => {
      document.addEventListener("keydown", handleStart, {once: true})
      startScreenElement.classList.remove("hide")
   }, 100)
}

function isCollision(r1, r2) {
   return (
      r1.left < r2.right &&
      r1.top < r2.bottom &&
      r1.right > r2.left &&
      r1.bottom > r2.top
   )
}

function checkLose() {
   const dinoRect = getDinoRect();
   return getCactusRects().some(rect => isCollision(rect, dinoRect))
}