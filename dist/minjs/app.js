import{injectControlsInHowToPlay as e,qs as t,qsa as i,setSfxVolume as s}from"./utils.js";import{Background as a}from"./background.js";import{LAYER_HEIGHT as n,LAYER_WIDTH as r,DEFAULT_SCROLL_SPEED as o,SOUND_DEFENCE_UP as h,SOUND_DEFENCE_DOWN as c,BLUR_VALUE as m,DEFAULT_CONTROLS as d}from"./constants.js";import{Player as l}from"./player.js";import u from"./inputs.js";import{UI as p}from"./UI.js";import{Wave_Boss as w,Wave_Eight as f,Wave_Five as g,Wave_Four as v,Wave_Nine as y,Wave_One as T,Wave_Results as b,Wave_Seven as _,Wave_Six as E,Wave_Three as k,Wave_Two as P,Wave_Win as x}from"./waves.js";import j from"./music.js";import{Accordian as L}from"./accordian.js";import{resetStats as W,updateStats as I}from"./best_stats.js";import{confirm as F}from"./custom_confirm_box.js";export let isPaused=!1;export function togglePause(){isPaused=!isPaused,isPaused||animate(0)}const S=t("body");if("ontouchstart"in document.documentElement){S.classList.add("is_touch_device");t('[data-btn="full-screen"]').addEventListener("click",(function(){document.fullscreenElement?(document.exitFullscreen(),t('[data-btn="full-screen"]').children[0].setAttribute("data-icon","expand")):S.requestFullscreen().then((()=>t('[data-btn="full-screen"]').children[0].setAttribute("data-icon","compress"))).catch((e=>alert(`Error, can't enable full-screen mode: ${e.message}`)))}))}const D=JSON.parse(localStorage.getItem("controls"))||d;e(D),I(),window.addEventListener("load",(function(){const e=t("canvas"),d=e.getContext("2d");e.width=.5*r,e.height=n;const R=t('[data-btn="new-game"]'),A=t('[data-btn="restart-game"]'),U=t("[data-modal='credits']"),O=t('[data-btn="credits-open"]'),$=t('[data-btn="credits-close"]'),q=t("[data-modal='how-to-play']"),G=t('[data-btn="how-to-play-open"]'),M=t('[data-btn="how-to-play-close"]'),N=t("[data-btn='controls-modal-open']"),C=(t("[data-list='main-menu']"),t("#menu_confirm")),Q=t("#menu_cancel"),X=i("[data-sfx='menu-confirm']"),V=i("[data-sfx='menu-cancel']");X.forEach((e=>e.addEventListener("click",(()=>{e.parentElement.open?Q.play():C.play()})))),V.forEach((e=>e.addEventListener("click",(()=>Q.play())))),O.addEventListener("click",(()=>{U.showModal(),isPaused||togglePause()})),$.addEventListener("click",(()=>{U.close()})),G.addEventListener("click",(()=>{q.showModal(),isPaused||togglePause()})),M.addEventListener("click",(()=>{q.close()})),A.addEventListener("click",(function(){isPaused=!0,F("restart",ie)}));const B=t("details");new L(B);const J={player:t("#player"),enemies:{angry_egg:t("#angryEgg"),crawler:t("#crawler"),ghost:t("#ghost"),bee:t("#bee"),pumpkin:{idle:t("#pumpkin_idle"),walk:t("#pumpkin_walk"),explode:t("#pumpkin_explode")}},boss:{attack:t("#attack"),retreat:t("#retreat"),idle:t("#idle"),jump_down:t("#jump_down"),jump_forward:t("#jump_up"),got_hit:t("#got_hit"),defeated:t("#defeated")},particles:{boom_one:t("#boom"),boom_two:t("#boom2"),smoke:t("#smoke"),hit_one:t("#hit_one"),hit_two:t("#hit_two"),red_hit_one:t("#red_hit_V1"),red_hit_two:t("#red_hit_V2")},icons:{heart:t("#heart")}};class z{constructor(e,t){this.isOn=!0,this.sprite_sheets=J,this.width=e,this.height=t,this.groundMargin=60,this.scrollSpeed=o,this.maxBarWidth=30*o,this.background=new a(this),this.player=new l(this),this.input=new u(this,D),this.UI=new p(this),this.enemyTimer=0,this.enemies=[],this.particles=[],this.recoveryTime=0,this.isRecovering=!1,this.deltaTime=0,this.gameIsStarting=!1,this.showResults=!1,this.resultsInterval=3500,this.resultsTimer=0,this.music=new j(this),this.sfx={defenceUpSFX:new Audio(h),defenceDownSFX:new Audio(c)},this.waves=[new T(this),new P(this),new k(this),new v(this),new g(this),new E(this),new _(this),new f(this),new y(this),new w(this),new x(this),new b(this)],this.currentWave=this.waves[0],this.currentWave.enter(),s(this.sfx),this.startingTime=performance.now(),this.totalTimePlaying=0}get formattedTime(){let e=new Date(Math.floor(this.totalTimePlaying)),t=e.getMinutes(),i=e.getSeconds();return`${t>0?t:""} ${t?"minute"+(t>1?"s":""):""} ${i} ${"second"+(i>1?"s":"")}`}handleTimer(){if(isPaused||this.currentWave.waveIndex>=10){const e=performance.now()-this.startingTime;this.totalTimePlaying+=e}else this.startingTime=performance.now()}update(e,t){this.background.update(),this.music.update(e),this.player.isGameOver||this.player.update(e,t),this.scrollSpeed>o&&(this.scrollSpeed-=.03),this.recoveryTime>0&&this.isRecovering?this.recoveryTime-=e:this.recoveryTime<=0&&(this.recoveryTime=0,this.isRecovering=!1),this.enemies.forEach((t=>{t.update(e)})),this.enemies=this.enemies.filter((e=>!e.deleteEnemy)),this.currentWave.enemyFrequency&&this.enemyTimer>this.currentWave.enemyFrequency&&this.enemies.length<this.currentWave.maxEnemies?(this.enemyTimer=0,this.currentWave.addEnemy()):this.enemyTimer+=e,this.currentWave.enemiesToDefeat&&this.player.enemiesDefeated>=this.currentWave.enemiesToDefeat&&(this.player.enemiesDefeated=0,this.currentWave.exit()),this.showResults&&(this.resultsTimer>=this.resultsInterval?(this.currentWave.exit(),this.showResults=!1):this.resultsTimer+=e),this.particles=this.particles.filter((e=>!e.markedForDeletion)),this.particles.forEach((t=>t.update(e))),this.UI.update(e),isPaused&&this.handleTimer()}draw(e){isPaused&&(e.filter=`blur(${m})`),this.background.draw(e),this.player.draw(e),this.enemies.forEach((t=>{t.draw(e)})),this.particles.forEach((t=>t.draw(e))),this.UI.draw(e)}stickyFriction(e){const t=-3*this.deltaTime*e;this.player.frameTimer>=0&&(this.player.frameTimer+=t),this.enemies.forEach((e=>{"EXPLODE"!==e.state?.state&&e.frameTimer>=0&&(e.frameTimer+=t)})),this.enemyTimer+=t}endGame(){this.music.currentTheme&&(this.music.currentTheme.currentTime=0,this.music.currentTheme?.pause()),isPaused=!1,this.isOn=!1,Y=0,this.input.removeEventListeners(),cancelAnimationFrame(K),this.gameIsStarting=!1,W(),S.classList.remove("game-is-on")}}let H,K,Y=0;const Z={NEW:"New Game",QUIT:"Quit Game"};function ee(){H.endGame(),d.clearRect(0,0,e.width,e.height),R.textContent=Z.NEW,A.disabled=!0,N.disabled=!0}function te(){H=new z(e.width,e.height),R.textContent=Z.QUIT,A.disabled=!1,document.activeElement.blur(),Y=0,isPaused=!1,S.classList.add("game-is-on"),H.gameIsStarting=!0,I(),animate(0)}function ie(){ee(),te()}this.animate=function t(i){0===i&&H.handleTimer();let s=i-Y;Y=i,H.deltaTime=s,d.clearRect(0,0,e.width,e.height),H.update(s,H.input),H.draw(d),isPaused?cancelAnimationFrame(K):K=requestAnimationFrame(t)},R.addEventListener("click",(()=>{H?.isOn?(isPaused=!0,F("quit",ee)):te()}))}));