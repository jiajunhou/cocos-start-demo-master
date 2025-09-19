import { _decorator, Component, Node } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager';
import { PlayerManager } from '../../Player/PlayerManager';
import { ControllerManager } from '../UI/ControllerManager';
import EventManager from '../../Runtime/EventManager';
import DataManager from '../../Runtime/DataManager';
import { WoodenSkeletonManager } from '../../WoodenSkeleton/WoodenSkeletonManager';
import { ENTITY_STATE_ENUM, EVENT_ENUM } from '../../Enum';

const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {


    protected onLoad(): void {

    }

    async start() {
        // 先初始化数据
        DataManager.Instance.initLevel(1)
        await this.generateTileMap()
        await  this.gengeratePlayer()
        await  this.gengerateEnemies()
        this.generateController()
    }

    update(deltaTime: number) {

    }

   async gengerateEnemies(){

         const stage = new Node();
        stage.setParent(this.node)
        const enemies = new Node();
        enemies.setParent(stage)

        const enemiesManager = enemies.addComponent(WoodenSkeletonManager)

      await enemiesManager.init()
        DataManager.Instance.enemies.push(enemiesManager)
    }

    async gengeratePlayer(){
        const stage = new Node();
        stage.setParent(this.node)
        const player = new Node();
        player.setParent(stage)

        const playerManager = player.addComponent(PlayerManager)

      await playerManager.init()
        DataManager.Instance.player = playerManager
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN)
    }


 async generateTileMap() {
  const stage = new Node();
  stage.setParent(this.node);
  const tileMap = new Node();
  tileMap.setParent(stage);

  const tileMapManager = tileMap.addComponent(TileMapManager);

 await tileMapManager.init();
}


    generateController(){
        const controller = new Node();
        controller.setParent(this.node)
        controller.addComponent(ControllerManager)
    }

}

