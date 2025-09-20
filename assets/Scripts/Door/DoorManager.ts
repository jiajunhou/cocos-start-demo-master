import { _decorator, animation, Animation, AnimationClip, Component, Layers, Node, resources, Sorting2D, Sprite, SpriteFrame, UITransform } from 'cc';
import { EntityManager } from '../../Base/EntityManager';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../../Enum';
import EventManager from '../../Runtime/EventManager';
import { DoorStateMachine } from './DoorStateMachine';
import DataManager from '../../Runtime/DataManager';


const { ccclass, property } = _decorator;

@ccclass('DoorManager')
export class DoorManager extends EntityManager {

   async init(){
     this.fsm = this.addComponent(DoorStateMachine)
   super.init({
      x:2,
      y:0,
      type:ENTITY_TYPE_ENUM.DOOR,
      direction:DIRECTION_ENUM.TOP,
      state:ENTITY_STATE_ENUM.IDLE

   })

      EventManager.Instance.on(EVENT_ENUM.DOOR_OPEN,this.onOpen,this)

      this.direction = DIRECTION_ENUM.TOP

    await this.fsm.init()

    }

    onDestroy() {
      super.onDestroy()
      EventManager.Instance.off(EVENT_ENUM.DOOR_OPEN,this.onOpen)
    }

    onOpen(){
      if(DataManager.Instance.enemies.every(enemy => (enemy.state === ENTITY_STATE_ENUM.DEATH)
      && this.state !== ENTITY_STATE_ENUM.DEATH)){
        this.state = ENTITY_STATE_ENUM.DEATH
    }

  }



}

