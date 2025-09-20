import { _decorator, Component, Node } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager';
import { PlayerManager } from '../../Player/PlayerManager';
import { ControllerManager } from '../UI/ControllerManager';
import EventManager from '../../Runtime/EventManager';
import DataManager from '../../Runtime/DataManager';
import { WoodenSkeletonManager } from '../../WoodenSkeleton/WoodenSkeletonManager';
import { ENTITY_STATE_ENUM, EVENT_ENUM } from '../../Enum';
import { DoorManager } from '../Door/DoorManager';
import { createUINode } from '../Untils';

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
        await this.generateTileMap()
        await  this.gengeratePlayer()
        await  this.gengerateEnemies()
        await this.gengerateDoor()
        this.generateController()
    }

    update(deltaTime: number) {

    }


        async gengerateDoor(){

            const node = createUINode()
            node.setParent(this.stage)
            const doorManager = node.addComponent(DoorManager)
            await doorManager.init()
            DataManager.Instance.door = doorManager

        }


   async gengerateEnemies(){

        // if (DataManager.Instance.enemies.length > 0) {
        //     return;
        // }

          const node = createUINode()
            node.setParent(this.stage)
            const woodenSkeleton = node.addComponent(WoodenSkeletonManager)
            await woodenSkeleton.init()
            DataManager.Instance.enemies.push(woodenSkeleton)

        // const stage = new Node();
        // stage.setParent(this.node)
        // const enemies = new Node();
        // enemies.setParent(stage)

        // const enemiesManager = enemies.addComponent(WoodenSkeletonManager)

        // await enemiesManager.init()
        // DataManager.Instance.enemies.push(enemiesManager)
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
            await player.init()
            DataManager.Instance.player = player
            EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN)

        // const stage = new Node();
        // stage.setParent(this.node)
        // const player = new Node();
        // player.setParent(stage)

        // const playerManager = player.addComponent(PlayerManager)

        // await playerManager.init()
        // DataManager.Instance.player = playerManager
        // EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN)
    }


 async generateTileMap() {

      const node = createUINode()
            node.setParent(this.stage)
            const tilemap = node.addComponent(TileMapManager)
            await tilemap.init()
            // this.adaptMapPos()

    //          const node = createUINode()
    // node.setParent(this.stage)
    // const tileMapManager = node.addComponent(TileMapManager)
    // await tileMapManager.init()
    // this.adaptMapPos()
//   const stage = new Node();
//   stage.setParent(this.node);
//   const tileMap = new Node();
//   tileMap.setParent(stage);

//   const tileMapManager = tileMap.addComponent(TileMapManager);

//  await tileMapManager.init();
}


    generateController(){
        const controller = new Node();
        controller.setParent(this.node)
        controller.addComponent(ControllerManager)
    }

}
