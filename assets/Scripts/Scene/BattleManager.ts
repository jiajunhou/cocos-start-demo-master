import { _decorator, Component, Node } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager';
import { PlayerManager } from '../../Player/PlayerManager';
import { ControllerManager } from '../UI/ControllerManager';
import EventManager from '../../Runtime/EventManager';
import DataManager from '../../Runtime/DataManager';
import { WoodenSkeletonManager } from '../../WoodenSkeleton/WoodenSkeletonManager';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../../Enum';
import { DoorManager } from '../Door/DoorManager';
import { createUINode } from '../Untils';
import { IronSkeletonManager } from '../IronSkeleton/IronSkeletonManager';
import { BurstManager } from '../Burst/BurstManager';
import { SpikesManager } from '../Spikes/SpikesManager';
import FadeManager from '../../Runtime/FadeManager';

const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {


    private stage: Node = null;
    protected onLoad(): void {

    }

    async start() {

        this.stage = createUINode()
        this.stage.setParent(this.node)
        this.stage.setSiblingIndex(2)
        // 先初始
        DataManager.Instance.initLevel(1)



        // await FadeManager.Instance.fadeIn()
        await this.generateTileMap()
         await this.generateSpikes()
        // await this.generateBurst()
        await  this.gengeratePlayer()
        await  this.gengerateEnemies()
        await this.gengerateDoor()
        // await this.gengerateIronEnemies()
        this.generateController()

        //  await FadeManager.Instance.fadeOut()
    }

    update(deltaTime: number) {}

        async generateSpikes(){
                const node = createUINode()
                node.setParent(this.stage)
                const spikes = node.addComponent(SpikesManager)
                await spikes.init({
                x:-3,
                y:-2,
                type:ENTITY_TYPE_ENUM.SPIKES_FOUR,
                count:0,
                })
                DataManager.Instance.spikesManager.push(spikes);
        }

        async gengerateDoor(){

            const node = createUINode()
            node.setParent(this.stage)
            const doorManager = node.addComponent(DoorManager)
            await doorManager.init()
            DataManager.Instance.door = doorManager

        }

       async generateBurst(){
          const node = createUINode()
            node.setParent(this.stage)
            const burstManager = node.addComponent(BurstManager)
            await burstManager.init({
                      x:-3,
                      y:-2,
                      type:ENTITY_TYPE_ENUM.BURST,
                      direction:DIRECTION_ENUM.TOP,
                      state:ENTITY_STATE_ENUM.IDLE
            })
            DataManager.Instance.burstManger.push(burstManager);
       }


   async gengerateEnemies(){
          const node = createUINode()
            node.setParent(this.stage)
            const woodenSkeleton = node.addComponent(WoodenSkeletonManager)
            await woodenSkeleton.init(
                {
                      x:2,
                      y:-3,
                      type:ENTITY_TYPE_ENUM.SKELETON_WOODEN,
                      direction:DIRECTION_ENUM.TOP,
                      state:ENTITY_STATE_ENUM.IDLE
                   }
            )
            DataManager.Instance.enemies.push(woodenSkeleton)
    }


   async gengerateIronEnemies(){
          const node = createUINode()
            node.setParent(this.stage)
            const ironskeleton = node.addComponent(IronSkeletonManager)
            await ironskeleton.init(
                {
                      x:2,
                      y:-5,
                      type:ENTITY_TYPE_ENUM.SKELETON_IRON,
                      direction:DIRECTION_ENUM.TOP,
                      state:ENTITY_STATE_ENUM.IDLE
                   }
            )
            DataManager.Instance.enemies.push(ironskeleton)
    }




      adaptMapPos() {
    const { mapRowCount, mapColumnCount } = DataManager.Instance
    const disX = (55 * mapRowCount) / 2
    const disY = (55 * mapColumnCount) / 2 + 80
    this.stage.setPosition(-disX, disY)
  }

    async gengeratePlayer(){

        // if (DataManager.Instance.player) {
        //     return;
        // }

            const node = createUINode()
            node.setParent(this.stage)
            const player = node.addComponent(PlayerManager)
            await player.init({
                    x:-3,
                    y:0,
                    type:ENTITY_TYPE_ENUM.PLAYER,
                    direction:DIRECTION_ENUM.TOP,
                    state:ENTITY_STATE_ENUM.IDLE
            })
            DataManager.Instance.player = player
            EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN)


    }


 async generateTileMap() {

      const node = createUINode()
            node.setParent(this.stage)
            const tilemap = node.addComponent(TileMapManager)
            await tilemap.init()
}


    generateController(){
        const controller = new Node();
        controller.setParent(this.node)
        controller.addComponent(ControllerManager)
    }

}
