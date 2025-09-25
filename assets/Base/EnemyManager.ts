import { _decorator, animation, Animation, AnimationClip, Component, Layers, log, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc';
import {EVENT_ENUM,CONTROLLER_ENUM,  DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, DIRECTION_ORDER_ENUM} from '../Enum'
import EventManager from '../Runtime/EventManager';
import { EntityManager } from '../Base/EntityManager';
import DataManager from '../Runtime/DataManager';
import { IEntity } from '../levels';
import { WoodenSkeletonStateMachine } from '../WoodenSkeleton/WoodenSkeletonStateMachine';

const { ccclass, property } = _decorator;

@ccclass('EnemyManager')
export class EnemyManager extends EntityManager {

   public scope:number

   async init(params:IEntity){


   super.init(params)

      this.direction = DIRECTION_ENUM.TOP

      EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.onChangeDirection,this)

      EventManager.Instance.on(EVENT_ENUM.ATTACK_ENEMY,this.onDeath,this)

       this.state = ENTITY_STATE_ENUM.IDLE
    }

 onDestroy(){
      super.onDestroy()
      EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END,this.onChangeDirection)

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
