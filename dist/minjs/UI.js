import{isPaused as t}from"./app.js";import{qs as e}from"./utils.js";import{FLOATING_DEFAULT_FONT_SIZE as i,FONT_FAMILY as s,FontSizes as a,LIGHT_GRAY_COLOR as r,MAX_LIVES as h,PROGRESS_ICON_X as o,RED_TEXT_COLOR as l}from"./constants.js";import{Heart as n}from"./icon.js";import{valuesToHSL as g}from"./utils.js";const m=e("canvas");export class UI{constructor(t){this.game=t,this.widthCenter=.5*this.game.width,this.heightCenter=.5*this.game.height,this.progressIcons=[],this.floatingMessages=[],this.numerator=0,this.denominator=0,this.redTextHSL=g(l),this.lightGrayTextHSL=g(r),this.overlayOpacity=1,this.overlayTimer=0,this.overlayInterval=45,this.bgColor=getComputedStyle(document.body,null).getPropertyValue("background-color");for(let t=0;t<h;t++)this.progressIcons.push(new n({game:this.game,x:o*t+10,transparency:.1,sizeModifier:.2}))}update(t){this.floatingMessages=this.floatingMessages.filter((t=>!t.markedForDeletion)),this.floatingMessages.forEach((e=>e.update(t)))}draw(e){let i=this.game.player.enemiesDefeated,r=this.game.currentWave.enemiesToDefeat;r&&(e.font=`${a.XSMALL}px ${s}`,e.strokeStyle=this.redTextHSL,e.lineWidth=7,e.textAlign="left",e.fillStyle=this.lightGrayTextHSL,e.strokeText(`${i} / ${r}`,20,80),e.fillText(`${i} / ${r}`,20,80)),this.floatingMessages.forEach((t=>t.draw(e))),this.progressIcons.forEach((t=>{t.waveCompleted?t.transparency=1:t.isCurrentWave&&(t.transparency=Math.max(i/r,.1)),(t.isCurrentWave||t.waveCompleted)&&(t.sizeModifier=.25),t.draw(e)})),this.game.player.isGameOver&&(this.overlayTimer>this.overlayInterval&&this.overlayOpacity<1?(this.overlayOpacity+=.025,this.overlayTimer=0):this.overlayTimer+=this.game.deltaTime,e.save(),e.globalAlpha=this.overlayOpacity,e.beginPath(),e.rect(0,0,m.width,m.height),e.fillStyle=this.bgColor,e.fill(),e.restore(),e.font=`${a.XLARGE*this.overlayOpacity}px ${s}`,this.setUpTextSettings(e),this.drawText(e,"YOU LOSE")),this.game.gameIsStarting&&(this.overlayTimer>this.overlayInterval&&this.overlayOpacity>0?(this.overlayOpacity=Math.max(this.overlayOpacity-.05,0),this.overlayTimer=0):this.overlayTimer+=this.game.deltaTime,e.save(),e.globalAlpha=this.overlayOpacity,e.beginPath(),e.rect(0,0,m.width,m.height),e.fillStyle=this.bgColor,e.fill(),e.restore(),this.overlayOpacity<=0&&(this.game.gameIsStarting=!1)),11!==this.game.currentWave.waveIndex||t||(e.filter="none",e.font=`${a.MEDIUM}px ${s}`,this.setUpTextSettings(e),this.drawText(e,"CONGRATULATIONS",{y:.5*this.game.height-64}),e.font=`${a.SMALL}px ${s}`,this.drawText(e,`${this.game.currentWave.newBestLives?"*NEW BEST*":""} Lives Remaining :  ${this.progressIcons.length}`),this.drawText(e,`${this.game.currentWave.newBestTime?"*NEW BEST*":""} Completed in : ${this.game.currentWave.totalTime}`,{y:.5*this.game.height+52})),t&&(e.filter="none",e.font=`${a.XLARGE}px ${s}`,this.setUpTextSettings(e),this.drawText(e,"PAUSED"))}setUpTextSettings(t){t.strokeStyle=this.redTextHSL,t.lineWidth=7,t.textAlign="center",t.textBaseline="middle",t.fillStyle=this.lightGrayTextHSL}drawText(t,e,{x:i=this.widthCenter,y:s=this.heightCenter}={}){t.strokeText(e,i,s),t.fillText(e,i,s)}}export class FloatingMessage{constructor({value:t,x:e,y:i,targetX:s=30,targetY:a=80,sizeModifier:r=0}){this.value=t,this.x=e,this.y=i,this.targetX=s,this.targetY=a,this.markedForDeletion=!1,this.timer=0,this.opacity=1,this.sizeModifier=r,this.fontBonus=0}update(t){this.x+=.03*(this.targetX-this.x),this.y+=.03*(this.targetY-this.y),this.timer+=t,this.timer>1e3&&(this.markedForDeletion=!0),this.timer>900?(this.opacity=.3,this.fontBonus=4*this.sizeModifier):this.timer>700?(this.opacity=.6,this.fontBonus=2*this.sizeModifier):this.timer>600&&(this.opacity=.8,this.fontBonus=this.sizeModifier)}draw(t){t.save(),t.globalAlpha=this.opacity,t.font=`${i+this.fontBonus}px ${s}`,t.strokeText(`${this.value}`,this.x,this.y),t.fillText(`${this.value}`,this.x,this.y),t.restore()}}