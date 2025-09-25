import { _decorator, animation, Animation, AnimationClip, Burst, Component, Layers, Node, resources, Sorting2D, Sprite, SpriteFrame, UITransform } from 'cc';
import { EntityManager } from '../../Base/EntityManager';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../../Enum';
import EventManager from '../../Runtime/EventManager';
import DataManager from '../../Runtime/DataManager';
import { BurstStateMachine } from './BurstStateMachine';
import { IEntity } from '../../levels';


const { ccclass, property } = _decorator;

@ccclass('BurstManager')
export class BurstManager extends EntityManager {

   async init(params:IEntity){
    console.log("BurstManager init params is ")
     this.fsm = this.addComponent(BurstStateMachine)
   super.init(params)
      const transform = this.getComponent(UITransform)
      transform.setContentSize(55,55)
      EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.onBurst,this)

      this.direction = DIRECTION_ENUM.TOP

    await this.fsm.init()

    }

    update() {
      this.node.setPosition(this.x * 55 , -this.y * 55 )
    }


    onDestroy() {
      super.onDestroy()
      EventManager.Instance.off(EVENT_ENUM.DOOR_OPEN,this.onBurst)
    }

     isWaiting: boolean = false; // 标记是否正在等待
      waitTimer = null; // 保存定时器ID
onBurst() {
  if (this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.Instance.player) {
    return;
  }

  const { x: playerX, y: playerY } = DataManager.Instance.player;
  const isPlayerOnTop = this.x === playerX && this.y === playerY;

  // 如果玩家不在上面且正在等待状态，清除定时器
  if (!isPlayerOnTop && this.isWaiting) {
    clearTimeout(this.waitTimer);
    this.isWaiting = false;
    return;
  }

  // 玩家在上面但还没开始计时
  if (isPlayerOnTop && !this.isWaiting) {
    this.state = ENTITY_STATE_ENUM.ATTACK; // 进入攻击状态
    this.isWaiting = true; // 标记开始等待

    // 设置1.5秒延迟检测
    this.waitTimer = setTimeout(() => {
      // 再次检查玩家是否仍在上面
      const currentPlayer = DataManager.Instance.player;
      if (currentPlayer && currentPlayer.x === this.x && currentPlayer.y === this.y) {
        this.state = ENTITY_STATE_ENUM.DEATH; // 实体死亡
        EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.AIRDEATH);
      }
      this.isWaiting = false; // 重置等待状态
    }, 1500); // 1.5秒延迟
  }
}
}

