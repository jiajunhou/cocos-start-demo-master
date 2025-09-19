import { _decorator, animation, Animation, AnimationClip, Component, Layers, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc';
import { ENTITY_STATE_ENUM, FSM_PARAM_TYPE_ENUM, PARAMS_NAME_ENUM } from '../Enum';
import StateMachine, { getInitParamsNumber, getInitParamsTrigger } from '../Base/StateMachine';
import { EntityManager } from '../Base/EntityManager';
import IdleSubStateMachine from './IdleSubStateMachine';
import AttackSubStateMachine from './AttackSubStateMachine';
import DeathSubStateMachine from './DeathSubStateMachine';
const { ccclass, property } = _decorator;




@ccclass("WoodenSkeletonStateMachine")
export class WoodenSkeletonStateMachine extends StateMachine {



async init(){


  this.animationComponent = this.addComponent(Animation)


  this.initParmas()
  this.initStateMachines()
  this.initAnimationEvent()

  await Promise.all(this.waitingList)

  this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
}

initAnimationEvent(){
  this.animationComponent.on(Animation.EventType.FINISHED,()=>{
    const name = this.animationComponent.defaultClip.name

    const whiteList = ['attack']
    if(whiteList.some(v =>name.includes(v))){
      this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
    }
  })

}


  initParmas(){
    this.params.set(PARAMS_NAME_ENUM.IDLE,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DIRECTION,getInitParamsNumber())
    this.params.set(PARAMS_NAME_ENUM.ATTACK,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger())
  }


  initStateMachines(){
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE,
      new IdleSubStateMachine(this)
    )

    this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK,
      new AttackSubStateMachine(this)
    )
    this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new DeathSubStateMachine(this))

  }


run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK):
      case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
        if (this.params.get(PARAMS_NAME_ENUM.DEATH).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH)
          // this.params.get(PARAMS_NAME_ENUM.DEATH).value = false
        } else if (this.params.get(PARAMS_NAME_ENUM.ATTACK).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK)
          // this.params.get(PARAMS_NAME_ENUM.ATTACK).value = false
        } else if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
          // this.params.get(PARAMS_NAME_ENUM.IDLE).value = false
        } else {
          this.currentState = this.currentState
        }
        break
      default:
        this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        break
    }
  }
}
