import { _decorator, animation, Animation, AnimationClip, Component, Layers, log, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc';
import {EVENT_ENUM,CONTROLLER_ENUM,  DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, DIRECTION_ORDER_ENUM} from '../Enum'
import EventManager from '../Runtime/EventManager';
import { EntityManager } from '../Base/EntityManager';
import DataManager from '../Runtime/DataManager';

import { WoodenSkeletonStateMachine } from './WoodenSkeletonStateMachine';
const { ccclass, property } = _decorator;

@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EntityManager {

   public scope:number

   async init(){
     this.fsm = this.addComponent(WoodenSkeletonStateMachine)

   super.init({
      x:2,
      y:-3,
      type:ENTITY_TYPE_ENUM.SKELETON_WOODEN,
      direction:DIRECTION_ENUM.TOP,
      state:ENTITY_STATE_ENUM.IDLE
   })

      this.direction = DIRECTION_ENUM.TOP

      EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.onChangeDirection,this)
      EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.onAttack,this)
      EventManager.Instance.on(EVENT_ENUM.ATTACK_ENEMY,this.onDeath,this)


    await this.fsm.init()
   this.state = ENTITY_STATE_ENUM.IDLE
    }

 onDestroy(){
      super.onDestroy()
      EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END,this.onChangeDirection)
      EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END,this.onAttack)
      EventManager.Instance.off(EVENT_ENUM.ATTACK_ENEMY,this.onDeath)
 }


onDeath(attackX: number, attackY: number){

   if(this.state === ENTITY_STATE_ENUM.DEATH || this.state === ENTITY_STATE_ENUM.AIRDEATH){
      return;
   }

   if(this.x === attackX && this.y === attackY){
      this.state = ENTITY_STATE_ENUM.DEATH;
   }
}

  onAttack(){
      if(this.state === ENTITY_STATE_ENUM.DEATH || this.state === ENTITY_STATE_ENUM.AIRDEATH
         || !DataManager.Instance.player
      )
         return

      const {x:playerX,y:playerY,state:playerState} = DataManager.Instance.player


      if((this.x === playerX && Math.abs(this.y - playerY)<=1) || (this.y === playerY &&
          Math.abs(this.x - playerX)<=1) && playerState!== ENTITY_STATE_ENUM.DEATH && playerState!== ENTITY_STATE_ENUM.AIRDEATH){


         this.state = ENTITY_STATE_ENUM.ATTACK
         EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER,ENTITY_STATE_ENUM.DEATH)
      }else{
         this.state = ENTITY_STATE_ENUM.IDLE
      }
    }


    onChangeDirection(){
      if(this.state === ENTITY_STATE_ENUM.DEATH || this.state === ENTITY_STATE_ENUM.AIRDEATH || !DataManager.Instance.player) return
      const {x:playerX,y:playerY} = DataManager.Instance.player
      const disX = Math.abs(this.x - playerX)
      const disY = Math.abs(this.y - playerY)

      if(playerX >= this.x && playerY <= this.y){
         this.direction = disY > disX ?DIRECTION_ENUM.TOP:DIRECTION_ENUM.RIGHT
      }else if(playerX <= this.x && playerY <= this.y){
              this.direction = disY > disX ?DIRECTION_ENUM.TOP:DIRECTION_ENUM.LEFT
      }else if(playerX <= this.x && playerY >= this.y){
              this.direction = disY > disX ?DIRECTION_ENUM.BOTTOM:DIRECTION_ENUM.LEFT
      }else if(playerX >= this.x && playerY >= this.y){
              this.direction = disY > disX ?DIRECTION_ENUM.BOTTOM:DIRECTION_ENUM.RIGHT
      }
    }

}
