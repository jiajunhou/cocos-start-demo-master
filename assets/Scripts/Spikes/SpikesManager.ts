import { _decorator, animation, Animation, AnimationClip, Component, Layers, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc';
import StateMachine from '../../Base/StateMachine';
import { randomByLength } from '../Untils';
import { ENTITY_TYPE_ENUM, PARAMS_NAME_ENUM, SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM } from '../../Enum';
import { IEntity, ISpikes } from '../../levels';
import { SpikesStateMachine } from './SpikesStateMachine';

const { ccclass, property } = _decorator;

@ccclass('SpikesManager')
export class SpikesManager extends Component {
      id:string = randomByLength(12)
      x:number = 0;
      y:number = 0;
      fsm : StateMachine ;
      private _count:number = 0
      private _totalCount:number = 0;
      private type:ENTITY_TYPE_ENUM

      get count() : number {
         return this._count
      }

        set count(v : number) {
          this._count = v
          this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT,v)
        }

         get totalCount()  {
         return this._totalCount
      }

       set totalCount(v) {
         this._totalCount = v;
         this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT,v)
      }





    async init(params:ISpikes){
        const sprite = this.addComponent(Sprite);

      sprite.sizeMode = Sprite.SizeMode.CUSTOM;

      const transform = this.getComponent(UITransform)
      transform.setContentSize(55*4,55*4)


      this.fsm = this.addComponent(SpikesStateMachine)
      await this.fsm.init()

      this.x = params.x;
      this.y = params.y
      this.type = params.type
      this.totalCount = SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM[this.type]
      this.count = params.count

    }

    update() {

      this.node.setPosition(this.x * 55 - 55*1.5, -this.y * 55 + 55*1.5)

    }

     onDestroy() {

    }


}

