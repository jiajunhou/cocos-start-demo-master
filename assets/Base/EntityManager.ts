import { _decorator, animation, Animation, AnimationClip, Component, Layers, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc';
import { ResourceManager } from '../Runtime/RescourseManager';
import {EVENT_ENUM,CONTROLLER_ENUM, PARAMS_NAME_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, DIRECTION_ORDER_ENUM} from '../Enum'
import EventManager from '../Runtime/EventManager';
import { PlayerStateMachine } from '../Player/PlayerStateMachine';
import { IEntity } from '../levels';
import StateMachine from './StateMachine';
import { randomByLength } from '../Scripts/Untils';
const { ccclass, property } = _decorator;

@ccclass('EntityManager')
export class EntityManager extends Component {
      id:string = randomByLength(12)
      x:number = 0;
      y:number = 0;
      fsm : StateMachine ;


      protected transform: UITransform
      private _direction:DIRECTION_ENUM
      private _state:ENTITY_STATE_ENUM
       type:ENTITY_TYPE_ENUM


       get direction() : DIRECTION_ENUM {
         return this._direction
      }

       set direction(v : DIRECTION_ENUM) {
         this._direction = v;
          this.fsm.setParams(PARAMS_NAME_ENUM.DIRECTION,DIRECTION_ORDER_ENUM[this._direction])
      }


         get state() : ENTITY_STATE_ENUM {
         return this._state
      }

       set state(v : ENTITY_STATE_ENUM) {
         this._state = v;
          this.fsm.setParams(this._state,true)
      }





    init(params:IEntity){
        const sprite = this.addComponent(Sprite);

      sprite.sizeMode = Sprite.SizeMode.CUSTOM;

      const transform = this.getComponent(UITransform)
      transform.setContentSize(55*4,55*4)


      this.direction = params.direction;

      this.x = params.x;
      this.y = params.y
      this.state = params.state
      this.type = params.type


    }

    update() {

      this.node.setPosition(this.x * 55 - 55*1.5, -this.y * 55 + 55*1.5)

    }

     onDestroy() {

    }






}

