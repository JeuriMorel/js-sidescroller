import{Phase_One as t,Phase_Three as i,Phase_Two as s}from"./boss_phases.js";import{Attack as h,Defeated as e,Got_Hit as a,Idle as r,Jump_Down as f,Jump_Forward as o,Retreat as d,STATES as n}from"./boss_states.js";import{BOSS_DAMAGED as u,BOSS_GROWL as g,DEFAULT_BOSS_BAR_COLOR as l,DEFAULT_BOSS_BORDER_COLOR as x,DEFENCE_DEBUFF as m,SOUND_BOSS_JUMP as y,SOUND_BOSS_RETREAT as b,SOUND_TONGUE as c,INVULNERABILITY_TIME as O,AttackTarget as w,SOUND_DIMENSION_SUCK as M,BOSS_LAND as p}from"./constants.js";import{HealthBar as T}from"./health_bar.js";import{FloatingMessage as A}from"./UI.js";import{setSfxVolume as z}from"./utils.js";export class Armored_Frog{constructor(i){this.game=i,this.sprite_sheets=i.sprite_sheets.boss,this.healthPoints=100,this.animationSheet=0,this.frame=0,this.lastFinishedFrame=null,this.maxFrame=11,this.fps=20,this.frameInterval=1e3/this.fps,this.frameTimer=0,this.defence=10,this.deleteEnemy=!1,this.isDefeated=!1,this.invulnerabilityTime=0,this.phase=new t(this),this.phase2Threshold=60,this.phase3Threshold=20,this.spriteHeight=0,this.spriteWidth=0,this.width=0,this.height=0,this.horizontalSpeed=0,this.spriteGroundOffsetModifier=.9,this.attackIntervals=[1e3,2e3,2500],this.attackOffsetX=95,this.got_hitOffsetX=48,this.hitOffsetX=0,this.attackInterval=6e3,this.attackTimer=0,this.idleXOffsetModifier=.25,this.sizeModifier=.6,this.canBeDebuffed=!0,this.hasBeenDebuffed=!1,this.isDebuffed=!1,this.debuffTimer=0,this.debuffInterval=4500,this.musicIsPlaying=!1,this.audio={damaged:new Audio(u),retreat:new Audio(b),jump:new Audio(y),tongue:new Audio(c),growl:new Audio(g),dematerialize:new Audio(M),land:new Audio(p)},z(this.audio),this.states=[new d(this),new h(this),new r(this),new f(this),new o(this),new a(this),new e(this)],this.x=.5*this.game.width,this.y=-6*this.game.height,this.currentState=this.states[n.JUMP_DOWN],this.currentState.enter(),this.hurtbox={body:{isActive:!0,xOffset:this.width*this.idleXOffsetModifier*this.sizeModifier,yOffset:.95*this.height*this.sizeModifier,x:this.x+this.xOffset,y:this.y+this.yOffset,width:1.4*this.width*this.sizeModifier,height:.6*this.height*this.sizeModifier},tongue:{isActive:!0,xOffset:this.width*this.idleXOffsetModifier*this.sizeModifier,yOffset:1.1*this.height*this.sizeModifier,x:this.x+this.xOffset,y:this.y+this.yOffset,width:.8*this.width*this.sizeModifier,height:.15*this.height*this.sizeModifier}},this.hitbox={body:{isActive:!0,xOffset:this.width*this.idleXOffsetModifier*this.sizeModifier,yOffset:.3*this.height*this.sizeModifier,x:this.x+this.xOffset,y:this.y+this.yOffset,width:1.25*this.width*this.sizeModifier,height:.2*this.height*this.sizeModifier},tongue:{isActive:!0,xOffset:this.width*this.idleXOffsetModifier*this.sizeModifier,yOffset:1.1*this.height*this.sizeModifier,x:this.x+this.xOffset,y:this.y+this.yOffset,width:.8*this.width*this.sizeModifier,height:.15*this.height*this.sizeModifier},claws:{isActive:!0,xOffset:this.width*this.idleXOffsetModifier*this.sizeModifier,yOffset:1.4*this.height*this.sizeModifier,x:this.x+this.xOffset,y:this.y+this.yOffset,width:1.4*this.width*this.sizeModifier,height:.15*this.height*this.sizeModifier}},this.velocityY=-30,this.weight=3,this.healthBarPadding=20,this.healthBarY=this.game.height-.5*this.game.groundMargin,this.healthBar=new T({x:this.healthBarPadding,y:this.healthBarY,width:this.game.width-2*this.healthBarPadding,height:20,maxhealth:this.healthPoints,defaultbarColor:l,borderColor:x})}get enemyName(){return this.constructor.name}setState(t){this.currentState=this.states[t],this.currentState.enter()}update(t){this.y+=this.velocityY,this.y>this.game.height-this.height*this.spriteGroundOffsetModifier-this.game.groundMargin&&(this.y=this.game.height-this.height*this.spriteGroundOffsetModifier-this.game.groundMargin),this.isOnGround()?this.velocityY=0:this.velocityY+=this.weight,this.isDebuffed&&(this.debuffTimer>this.debuffInterval?(this.defence+=m,this.game.UI.floatingMessages.push(new A({value:"+ defence RESTORED",x:this.x,y:this.y+100,targetX:this.x,targetY:this.y})),this.isDebuffed=!1,this.canBeDebuffed=!0,this.debuffTimer=0,this.game.sfx.defenceUpSFX.play()):this.debuffTimer+=t),this.frameTimer>this.frameInterval?(this.frameTimer=0,this.frame<this.maxFrame?this.frame++:this.frame=0):this.frameTimer+=t,this.healthBar.updatePosition(this.healthBarPadding,this.healthBarY),this.currentState==this.states[n.IDLE]&&this.isOnGround()&&"GAME_OVER"!=this.game.player.currentState.state&&(this.attackTimer>this.attackInterval&&!this.isDefeated&&!this.game.player.isDashAttacking()?(this.attackTimer=0,this.attackInterval=this.attackIntervals[Math.floor(Math.random()*this.attackIntervals.length)],this.attack(),this.musicIsPlaying||(this.game.music.currentTheme.play(),this.musicIsPlaying=!0)):this.attackTimer+=t),this.currentState.update(),this.updateHitboxes(),this.invulnerabilityTime>0?this.invulnerabilityTime-=t:this.isDefeated||(this.hurtbox.body.isActive=!0,this.hurtbox.tongue.isActive=!0),this.jumpTarget&&(this.jumpTarget-=this.game.scrollSpeed),!this.isOnGround()&&this.jumpTarget&&(this.x+=.15*(this.jumpTarget-this.x)),this.isOnGround()&&!this.isDefeated&&"ATTACK"!=this.currentState.state&&this.game.player.x>this.x+this.width&&this.setState(n.JUMP_FORWARD)}isOnGround(){return this.y>=this.game.height-this.height*this.spriteGroundOffsetModifier-this.game.groundMargin}draw(t){this.healthBar.draw(t),t.drawImage(this.image,this.frame*this.spriteWidth,this.animationSheet*this.spriteHeight,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height)}attack(){let t=this.attacks[Math.floor(Math.random()*this.attacks.length)];"TONGUE_ATTACK"===t&&this.setState(n.ATTACK),"JUMP_ATTACK"===t&&this.setState(n.JUMP_FORWARD)}updateHitboxes(){this.hurtbox.body.x=this.x+this.hurtbox.body.xOffset,this.hurtbox.body.y=this.y+this.hurtbox.body.yOffset,this.hurtbox.tongue.x=this.x+this.hurtbox.tongue.xOffset,this.hurtbox.tongue.y=this.y+this.hurtbox.tongue.yOffset,this.hitbox.tongue.x=this.x+this.hitbox.tongue.xOffset,this.hitbox.tongue.y=this.y+this.hitbox.tongue.yOffset,this.hitbox.body.x=this.x+this.hitbox.body.xOffset,this.hitbox.body.y=this.y+this.hitbox.body.yOffset,this.hitbox.claws.x=this.x+this.hitbox.claws.xOffset,this.hitbox.claws.y=this.y+this.hitbox.claws.yOffset}exitTongueAttack(){this.hurtbox.tongue.isActive=!1,this.hitbox.tongue.isActive=!1,this.x+=this.attackOffsetX}resolveCollision({target:t,attackDamage:i}){t===w.ENEMY&&("ATTACK"===this.currentState.state&&this.exitTongueAttack(),this.healthPoints-=Math.max(i-this.defence,0),this.healthPoints<0&&(this.healthPoints=0),this.healthBar.updateBar(this.healthPoints),this.setState(this.healthPoints<=0?n.DEFEATED:n.GOT_HIT),this.setPhase()),t===w.PLAYER&&("ATTACK"===this.currentState.state&&this.exitTongueAttack(),this.invulnerabilityTime=O)}setPhase(){"Phase_One"===this.phase.phase&&this.healthPoints<=this.phase2Threshold?this.phase=new s(this):"Phase_Two"===this.phase.phase&&this.healthPoints<=this.phase3Threshold&&(this.phase=new i(this))}resetBoxes(){this.hurtbox&&(this.hurtbox.body.xOffset=this.width*this.idleXOffsetModifier*this.sizeModifier,this.hurtbox.tongue.xOffset=this.width*this.idleXOffsetModifier*this.sizeModifier),this.hitbox&&(this.hitbox.body.xOffset=this.width*this.idleXOffsetModifier*this.sizeModifier,this.hitbox.tongue.xOffset=this.width*this.idleXOffsetModifier*this.sizeModifier,this.hitbox.claws.xOffset=this.width*this.idleXOffsetModifier*this.sizeModifier,this.hitbox.claws.width=1.4*this.width*this.sizeModifier,this.hitbox.claws.yOffset=1.4*this.height*this.sizeModifier)}isFirstRefreshOnCurrentFrame(){return this.frame!==this.lastFinishedFrame}}