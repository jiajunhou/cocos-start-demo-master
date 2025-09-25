import { _decorator, animation, Animation, AnimationClip, Component, Layers, Node, resources, Sorting2D, Sprite, SpriteFrame, UITransform } from 'cc';
import { ResourceManager } from '../Runtime/RescourseManager';
import {EVENT_ENUM,CONTROLLER_ENUM, PARAMS_NAME_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, DIRECTION_ORDER_ENUM} from '../Enum'
import EventManager from '../Runtime/EventManager';
import { PlayerStateMachine } from './PlayerStateMachine';
import { EntityManager } from '../Base/EntityManager';
import DataManager from '../Runtime/DataManager';
import { TileManager } from '../Scripts/Tile/TileManager';
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager';
import { IEntity } from '../levels';
const { ccclass, property } = _decorator;

@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {

      isMoving:boolean = false
      targetX:number = 0
      targetY:number = 0
      private readonly speed = 1/10;

   async init(params:IEntity){
     this.fsm = this.addComponent(PlayerStateMachine)
   super.init(params)
      this.targetX = this.x
      this.targetY = this.y
      this.direction = DIRECTION_ENUM.TOP

    await this.fsm.init()

   this.state = ENTITY_STATE_ENUM.IDLE
    EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL,this.inputHandle,this)
    EventManager.Instance.on(EVENT_ENUM.ATTACK_PLAYER,this.onDeath,this)
    }

    update() {
      super.update()
       this.updateXY()

    }

    updateXY(){
      if(this.targetX < this.x){
         this.x -= this.speed;
      }else if(this.targetX > this.x){
         this.x += this.speed
      }

       if(this.targetY < this.y){
         this.y -= this.speed;
      }else if(this.targetY > this.y){
         this.y += this.speed
      }

      if(Math.abs(this.targetX - this.x) <= 0.1 && Math.abs(this.targetY - this.y)<=0.1 && this.isMoving == true){
            this.isMoving = false
            this.x = this.targetX
              this.y = this.targetY
            EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
      }

    }

    onDeath(type:ENTITY_STATE_ENUM){
      this.state = type
    }

  async inputHandle(inputDirection: CONTROLLER_ENUM) {

  if (this.isMoving) return;

  if (this.state === ENTITY_STATE_ENUM.DEATH
    || this.state === ENTITY_STATE_ENUM.AIRDEATH
    || this.state === ENTITY_STATE_ENUM.ATTACK  ) return;

  const { eX, eY } = this.willAttack(inputDirection);
  if (eX !== undefined && eY !== undefined) {


    EventManager.Instance.emit(EVENT_ENUM.ATTACK_ENEMY, eX, eY);

    await new Promise(reslove => {
      this.scheduleOnce(() => {
        reslove(null);
      }, 1);
   }
    )

    EventManager.Instance.emit(EVENT_ENUM.DOOR_OPEN)

    return;
  }

  EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END);
  this.move(inputDirection);
}

willAttack(type: CONTROLLER_ENUM) {

   this.isMoving = false;
  const enemies = DataManager.Instance.enemies.filter(enemis => enemis.state !== ENTITY_STATE_ENUM.DEATH);



  for (let i = 0; i < enemies.length; i++) {
    const { x: eX, y: eY, id: eId } = enemies[i];


    if (type === CONTROLLER_ENUM.TOP
      && this.direction === DIRECTION_ENUM.TOP
      && eX === this.x
      && eY === this.targetY - 2
    ) {
      this.state = ENTITY_STATE_ENUM.ATTACK;
      return { eX, eY };
    }

    else if (type === CONTROLLER_ENUM.LEFT
      && this.direction === DIRECTION_ENUM.LEFT
      && eX === this.x - 2
      && eY === this.targetY
    ) {
      this.state = ENTITY_STATE_ENUM.ATTACK;
      return { eX, eY };
    }

    else if (type === CONTROLLER_ENUM.RIGHT
      && this.direction === DIRECTION_ENUM.RIGHT
      && eX === this.x + 2
      && eY === this.targetY
    ) {
      this.state = ENTITY_STATE_ENUM.ATTACK;
      return { eX, eY };
    }

    else if (type === CONTROLLER_ENUM.BOTTOM
      && this.direction === DIRECTION_ENUM.BOTTOM
      && eX === this.x
      && eY === this.targetY + 2
    ) {
      this.state = ENTITY_STATE_ENUM.ATTACK;
      return { eX, eY };
    }
    // 不满足条件时不返回，继续检查下一个
  }

  return { eX: undefined, eY: undefined };
}

   //  isAttack(enemie:WoodenSkeletonManager){
   //      const{x:x,y:y} = enemie
   //       if(((this.x === x && Math.abs(this.y - y)<=2) || (this.y === y && Math.abs(this.x - x)<=2))
   //       && (this.state!== ENTITY_STATE_ENUM.DEATH && this.state!== ENTITY_STATE_ENUM.AIRDEATH)
   //       && (enemie.state!== ENTITY_STATE_ENUM.DEATH && enemie.state!== ENTITY_STATE_ENUM.AIRDEATH)
   //       && ((this.direction === DIRECTION_ENUM.TOP && this.y > y) ||
   //          (this.direction === DIRECTION_ENUM.BOTTOM && this.y < y) ||
   //          (this.direction === DIRECTION_ENUM.LEFT && this.x > x) ||
   //          (this.direction === DIRECTION_ENUM.RIGHT && this.x < x))
   //    ){
   //          this.state = ENTITY_STATE_ENUM.ATTACK
   //          EventManager.Instance.emit(EVENT_ENUM.ATTACK_ENEMY,enemie)
   //          return true
   //       }
   //    return false
   //  }

   willBlock(inputDirection:CONTROLLER_ENUM){

      const {
         targetX:x,
         targetY:y,
         direction:direction
      } = this

      const {
         tileInfo
      } = DataManager.Instance


         var my = this.y + 6
         var mx = this.x + 3

      if(inputDirection === CONTROLLER_ENUM.TOP){
         if(direction === DIRECTION_ENUM.TOP){
            const playerNextY = my - 1;
            const weaponNextY = my - 2;
            if(playerNextY < 0 ){
               this.state = ENTITY_STATE_ENUM.BLOCKFRONT
               return true
            }
            const playTail = tileInfo[mx][playerNextY]
            const weaponTail = tileInfo[mx][weaponNextY]

            if(playTail && playTail.moveable && (!weaponTail || weaponTail.turnable)){
               // empty
            }else{
                 this.state = ENTITY_STATE_ENUM.BLOCKFRONT
               return true
            }

         }
      }
      else if(inputDirection === CONTROLLER_ENUM.TURNLEFT){
         let nextX
         let nextY
         if(direction === DIRECTION_ENUM.TOP){
               nextX = mx - 1;
               nextY = my - 1;
         }else if(direction === DIRECTION_ENUM.BOTTOM){
               nextX = mx + 1;
               nextY = my + 1;
         }else if(direction === DIRECTION_ENUM.LEFT){
               nextX = mx - 1;
               nextY = my + 1;
         }else if(direction === DIRECTION_ENUM.RIGHT){
               nextX = mx + 1;
               nextY = my - 1;
         }

         if((!tileInfo[mx][nextY] || tileInfo[mx][nextY].turnable)&&
            (!tileInfo[nextX][my] || tileInfo[nextX][my].turnable) &&
            (!tileInfo[nextX][nextY] || tileInfo[nextX][nextY].turnable)
      ){
//
         }else{
              this.state = ENTITY_STATE_ENUM.BLOCKTURNLEFT
            return true
         }
      }

      else if(inputDirection === CONTROLLER_ENUM.TURNRIGHT){
         let nextX
         let nextY
         if(direction === DIRECTION_ENUM.TOP){
               nextX = mx + 1;
               nextY = my + 1;
         }else if(direction === DIRECTION_ENUM.BOTTOM){
               nextX = mx - 1;
               nextY = my - 1;
         }else if(direction === DIRECTION_ENUM.LEFT){
               nextX = mx + 1;
               nextY = my - 1;
         }else if(direction === DIRECTION_ENUM.RIGHT){
               nextX = mx - 1;
               nextY = my + 1;
         }

         if((!tileInfo[mx][nextY] || tileInfo[mx][nextY].turnable)&&
            (!tileInfo[nextX][my] || tileInfo[nextX][my].turnable) &&
            (!tileInfo[nextX][nextY] || tileInfo[nextX][nextY].turnable)
      ){
//
         }else{
              this.state = ENTITY_STATE_ENUM.BLOCKTURNRIGHT
            return true
         }
      }

      return false
    }

    move(inputDirection){
      this.isMoving = true
      if(inputDirection == CONTROLLER_ENUM.TOP){
         this.targetY-=1
          this.isMoving = true
      }else if(inputDirection == CONTROLLER_ENUM.LEFT){
         this.targetX-=1
          this.isMoving = true
      }else if(inputDirection == CONTROLLER_ENUM.RIGHT){
         this.targetX+=1
          this.isMoving = true
      }else if(inputDirection == CONTROLLER_ENUM.BOTTOM){
         this.targetY+=1
          this.isMoving = true
      }else if(inputDirection == CONTROLLER_ENUM.TURNLEFT){
            if(this.direction === DIRECTION_ENUM.TOP){
               this.direction = DIRECTION_ENUM.LEFT
            }else if(this.direction === DIRECTION_ENUM.LEFT){
               this.direction = DIRECTION_ENUM.BOTTOM
            }else if(this.direction === DIRECTION_ENUM.RIGHT){
               this.direction = DIRECTION_ENUM.TOP
            }else if(this.direction === DIRECTION_ENUM.BOTTOM){
               this.direction = DIRECTION_ENUM.RIGHT
            }

         this.state = ENTITY_STATE_ENUM.TURNLEFT
           EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
      }else if(inputDirection == CONTROLLER_ENUM.TURNRIGHT){
            if(this.direction === DIRECTION_ENUM.TOP){
               this.direction = DIRECTION_ENUM.RIGHT
            }else if(this.direction === DIRECTION_ENUM.LEFT){
               this.direction = DIRECTION_ENUM.TOP
            }else if(this.direction === DIRECTION_ENUM.RIGHT){
               this.direction = DIRECTION_ENUM.BOTTOM
            }else if(this.direction === DIRECTION_ENUM.BOTTOM){
               this.direction = DIRECTION_ENUM.LEFT
            }

         this.state = ENTITY_STATE_ENUM.TURNRIGHT
           EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
      }
    }


}

