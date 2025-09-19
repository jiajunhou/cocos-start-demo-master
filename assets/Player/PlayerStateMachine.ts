import { _decorator, animation, Animation, AnimationClip, Component, Layers, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc';
import { ENTITY_STATE_ENUM, FSM_PARAM_TYPE_ENUM, PARAMS_NAME_ENUM } from '../Enum';
import StateMachine, { getInitParamsNumber, getInitParamsTrigger } from '../Base/StateMachine';
import IdleSubStateMachine from './IdleSubStateMachine';
import TurnLeftSubStateMachine from './TurnLeftSubStateManager';
import BlockFrontSubStateMachine from './BlockFrontSubStateMachine';
import { EntityManager } from '../Base/EntityManager';
import BlockTurnLeftSubStateMachine from './BlockTurnLeftSubStateMachine';
import TurnRightSubStateMachine from './TurnRightSubStateManager';
import BlockTurnRightSubStateMachine from './BlockTurnRightSubStateMachine';
import DeathSubStateMachine from './DeathSubStateMachine';
import AttackSubStateMachine from './AttackSubStateMachine';
const { ccclass, property } = _decorator;




@ccclass("PlayStateMachine")
export class PlayerStateMachine extends StateMachine {



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

    console.log(name+"name name name name name is whiteList")
    const whiteList = ['turn','block','attack']
    if(whiteList.some(v =>name.includes(v))){
      this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
      //  this.setParams(PARAMS_NAME_ENUM.IDLE,true)
    }
  })

}

  initParmas(){
    this.params.set(PARAMS_NAME_ENUM.IDLE,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.TURNLEFT,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.TURNRIGHT,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DIRECTION,getInitParamsNumber())
    this.params.set(PARAMS_NAME_ENUM.BLOCKFRONT,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKTURNLEFT,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DEATH,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKTURNRIGHT,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.ATTACK,getInitParamsTrigger())
  }


  initStateMachines(){
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE,
      new IdleSubStateMachine(this)
    )

     this.stateMachines.set(PARAMS_NAME_ENUM.TURNLEFT,
      new TurnLeftSubStateMachine(this)
    )

      this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKFRONT,
      new BlockFrontSubStateMachine(this)
    )

    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKTURNLEFT,
      new BlockTurnLeftSubStateMachine(this)
    )

     this.stateMachines.set(PARAMS_NAME_ENUM.TURNRIGHT,
      new TurnRightSubStateMachine(this)
    )

    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKTURNRIGHT,
      new BlockTurnRightSubStateMachine(this)
    )

    this.stateMachines.set(PARAMS_NAME_ENUM.DEATH,
      new DeathSubStateMachine(this)
    )

    this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK,
      new AttackSubStateMachine(this)
    )
  }


  run(){
    switch (this.currentState){
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURNRIGHT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKFRONT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK):
      case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
        if(this,this.params.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT).value){
           this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT)
          //  this.params.get((PARAMS_NAME_ENUM.BLOCKTURNLEFT)).value = false
        }else if(this,this.params.get(PARAMS_NAME_ENUM.ATTACK).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK)
        }else if(this,this.params.get(PARAMS_NAME_ENUM.DEATH).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH)
        }
        else if(this,this.params.get(PARAMS_NAME_ENUM.BLOCKFRONT).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKFRONT)
            // this.params.get((PARAMS_NAME_ENUM.BLOCKFRONT)).value = false
        }else if(this,this.params.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT)
            // this.params.get((PARAMS_NAME_ENUM.BLOCKFRONT)).value = false
        }else if(this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT)
          this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value = false
        }else if(this.params.get(PARAMS_NAME_ENUM.TURNRIGHT).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNRIGHT)
          this.params.get(PARAMS_NAME_ENUM.TURNRIGHT).value = false
        }else if(this.params.get(PARAMS_NAME_ENUM.IDLE).value){
            this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        }else{
          this.currentState = this.currentState
        }
        break;
        default:
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    }
  }
}
