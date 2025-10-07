import { _decorator, Component, Enum, Graphics, Node, view , game } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager';
import { PlayerManager } from '../../Player/PlayerManager';
import EventManager from '../../Runtime/EventManager';
import { CONTROLLER_ENUM, EVENT_ENUM } from '../../Enum';
const { ccclass, property } = _decorator;


enum FADE_STATE_ENUM {
  IDLE = 'IDLE',
  FADE_IN = 'FADE_IN',
  FADE_OUT = 'FADE_OUT'
}


const SCREEN_WIDTH = view.getVisibleSize().width
const SCREEN_HEIGHT = view.getVisibleSize().height

export const DEFAULT_DURATION = 2000

@ccclass("DrawManager")
export class DrawManager extends Component {

  private ctx:Graphics = null
  private state:FADE_STATE_ENUM = FADE_STATE_ENUM.IDLE
  private oldTime:number = 0
  private duration:number = 1
  private fadeRes: (value:PromiseLike<null>)=> void

  init(){
    this.ctx = this.addComponent(Graphics)

    this.setAlpha(1)
  }

  setAlpha(percent:number){
    this.ctx.clear();

    this.ctx.rect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT)
    this.ctx.fillColor.set(0,0,0,255 * percent)

    this.ctx.fill()

  }


  update() {
    const deltaTime = (game.totalTime - this.oldTime)  / this.duration

    switch(this.state){
      case FADE_STATE_ENUM.FADE_IN:
            if(deltaTime < 1){
              this.setAlpha(deltaTime)
            }else{
              this.setAlpha(1)
              this.state = FADE_STATE_ENUM.IDLE
            }
        break;
      case FADE_STATE_ENUM.FADE_OUT:
        if(deltaTime >= 1){
              this.setAlpha(1 - deltaTime)
            }else{
              this.setAlpha(1)
              this.state = FADE_STATE_ENUM.IDLE
            }
        break;
    }

  }


  fadeIn(_duration:number = DEFAULT_DURATION){
        this.setAlpha(0)
        this.duration = _duration
        this.oldTime = game.totalTime
        this.state = FADE_STATE_ENUM.FADE_IN
        return new Promise((res)=>{
            this.fadeRes = res
        })
  }

  fadeOut(_duration:number = DEFAULT_DURATION){
      this.setAlpha(1)
      this.duration = _duration
      this.oldTime = game.totalTime
      this.state = FADE_STATE_ENUM.FADE_OUT
      return new Promise((res)=>{
            this.fadeRes = res
        })
  }

}
