/***
 *  需要具有播放动画能力
 *
 */

import { PlayerStateMachine } from "../Player/PlayerStateMachine";
import { _decorator, animation, Animation, AnimationClip, Component, Layers, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc';
import { ResourceManager } from '../Runtime/RescourseManager';
import {EVENT_ENUM,CONTROLLER_ENUM, PARAMS_NAME_ENUM} from '../Enum'
import EventManager from '../Runtime/EventManager';
import StateMachine from "./StateMachine";
import { sortSpriteFrame } from "../Scripts/Untils";

const { ccclass, property } = _decorator;



export default class State {

  private animationClip:AnimationClip

  constructor(
    public fsm: StateMachine ,
    private path:string,
    private wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal){
    this.init()
  }

  async init(){

    const promise = ResourceManager.Instance.loadDir(this.path)

    this.fsm.waitingList.push(promise)

    const spriteFrames = await promise
      this.animationClip = new AnimationClip();
      const track = new animation.ObjectTrack() //创建向量轨道
      track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame')

      // const frame:Array<[number,SpriteFrame]> =  spriteFrames.map((item,index)=>[1/8 * index,item])
      const frame : Array<[number,SpriteFrame]> = sortSpriteFrame(spriteFrames).map((item,index)=>
       [ 1/8 * index,item]
      );

      track.channel.curve.assignSorted(frame)


      this.animationClip.addTrack(track)

      this.animationClip.name = this.path

      this.animationClip.duration = frame.length * 1/8 ;

      this.animationClip.wrapMode= this.wrapMode
  }

  run(){
      if(this.fsm.animationComponent?.defaultClip?.name == this.animationClip.name) return
      this.fsm.animationComponent.defaultClip = this.animationClip
      this.fsm.animationComponent.play();
  }

}
