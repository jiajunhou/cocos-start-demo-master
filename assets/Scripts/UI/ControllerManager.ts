import { _decorator, Component, Node } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager';
import { PlayerManager } from '../../Player/PlayerManager';
import EventManager from '../../Runtime/EventManager';
import { CONTROLLER_ENUM, EVENT_ENUM } from '../../Enum';
const { ccclass, property } = _decorator;

@ccclass("ControllerManager")
export class ControllerManager extends Component {
  handleController(evt:Event,type: string){
    EventManager.Instance.emit(EVENT_ENUM.PLAYER_CTRL,type as CONTROLLER_ENUM)
  }
}
