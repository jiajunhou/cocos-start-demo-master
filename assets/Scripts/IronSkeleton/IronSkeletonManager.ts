import { _decorator, animation, Animation, AnimationClip, Component, Layers, log, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc';

import { EnemyManager } from '../../Base/EnemyManager';
import { IEntity } from '../../levels';
import EventManager from '../../Runtime/EventManager';
import DataManager from '../../Runtime/DataManager';
import { IronSkeletonStateMachine } from './IronSkeletonStateMachine';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM } from '../../Enum';
const { ccclass, property } = _decorator;

@ccclass('IronSkeletonManager')
export class IronSkeletonManager extends EnemyManager {

   public scope:number

   async init(params:IEntity){
     this.fsm = this.addComponent(IronSkeletonStateMachine)

   super.init(params)

      this.direction = DIRECTION_ENUM.TOP

      EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.onChangeDirection,this)
      EventManager.Instance.on(EVENT_ENUM.ATTACK_ENEMY,this.onDeath,this)


    await this.fsm.init()
   this.state = ENTITY_STATE_ENUM.IDLE
    }

 onDestroy(){
      super.onDestroy()
      EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END,this.onChangeDirection)
      EventManager.Instance.off(EVENT_ENUM.ATTACK_ENEMY,this.onDeath)
 }



}
