import { _decorator, animation, Animation, AnimationClip, Component, Layers, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc';
import StateMachine, { getInitParamsNumber } from '../../Base/StateMachine';
import { ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, PARAMS_NAME_ENUM, SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM } from '../../Enum';
import { EntityManager } from '../../Base/EntityManager';
import IdleSubStateMachine from './SpikesOneSubStateMachine';
import SpikesOneSubStateMachine from './SpikesOneSubStateMachine';
const { ccclass, property } = _decorator;




@ccclass("SpikesStateMachine")
export class SpikesStateMachine extends StateMachine {



async init(){


  this.animationComponent = this.addComponent(Animation)


  this.initParmas()
  this.initStateMachines()
  this.initAnimationEvent()

  await Promise.all(this.waitingList)

  this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
}

initAnimationEvent(){
  // this.animationComponent.on(Animation.EventType.FINISHED,()=>{
  //   const name = this.animationComponent.defaultClip.name

  //   const whiteList = ['attack']
  //   if(whiteList.some(v =>name.includes(v))){
  //     this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
  //   }
  // })

}


  initParmas(){
    this.params.set(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT,getInitParamsNumber())
     this.params.set(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT,getInitParamsNumber())
  }


  initStateMachines(){
    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_ONE,
      new SpikesOneSubStateMachine(this)
    )

  }


run() {
 const value = this.getParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT)

    switch (this.currentState) {
      case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE):
        if(value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_ONE){
          this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE)
        } else {
          this.currentState = this.currentState
        }
        break
      default:
        this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE)
        break
    }
  }
}
