import { _decorator, animation, Animation, AnimationClip, Component, Layers, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc';
import StateMachine, { getInitParamsNumber, getInitParamsTrigger } from '../../Base/StateMachine';
import { ENTITY_STATE_ENUM, PARAMS_NAME_ENUM } from '../../Enum';

import State from '../../Base/State';

const { ccclass, property } = _decorator;
const BASE_URL = 'texture/burst';



@ccclass("BurstStateMachine")
export class BurstStateMachine extends StateMachine {

async init(){


  this.animationComponent = this.addComponent(Animation)


  this.initParmas()
  this.initStateMachines()
  this.initAnimationEvent()

  await Promise.all(this.waitingList)

  this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
}

initAnimationEvent(){
}


  initParmas(){
    this.params.set(PARAMS_NAME_ENUM.IDLE,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.ATTACK,getInitParamsTrigger())
     this.params.set(PARAMS_NAME_ENUM.DIRECTION,getInitParamsNumber())
      this.params.set(PARAMS_NAME_ENUM.DEATH,getInitParamsTrigger())

  }


  initStateMachines(){
 this.stateMachines.set(PARAMS_NAME_ENUM.IDLE,new State(this,`${BASE_URL}/idle`))
 this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK,new State(this,`${BASE_URL}/attack`))
   this.stateMachines.set(PARAMS_NAME_ENUM.DEATH,new State(this,`${BASE_URL}/death`))
  }


run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
        if (this.params.get(PARAMS_NAME_ENUM.DEATH).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH)
        }  else if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
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
