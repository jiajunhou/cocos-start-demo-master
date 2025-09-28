import { AnimationClip } from "cc";
import DirectionSubStateMachine from "../../Base/DirectionSubStateMachine";
import StateMachine from "../../Base/StateMachine";
import { DIRECTION_ENUM, PARAMS_NAME_ENUM, SPIKES_COUNT_ENUM, SPIKES_COUNT_MAP_NUMBER_ENUM } from "../../Enum";
import State from "../../Base/State";
import SubStateMachine from "../../Base/SubStateMachine";
import { SpikesStateMachine } from "./SpikesStateMachine";
import SpikesSubStateMachine from "./SpikesSubStateMachine";



export const BASE_URL = 'texture/spikes/spikesthree'

export default class SpikesThreeSubStateMachine extends SpikesSubStateMachine{

  constructor(fsm:StateMachine){
    super(fsm)
       this.stateMachines.set(SPIKES_COUNT_ENUM.ZERO,
        new State(fsm,`${BASE_URL}/zero`,AnimationClip.WrapMode.Loop))

  this.stateMachines.set(SPIKES_COUNT_ENUM.ONE,
        new State(fsm,`${BASE_URL}/one`,AnimationClip.WrapMode.Loop))

          this.stateMachines.set(SPIKES_COUNT_ENUM.TWO,
        new State(fsm,`${BASE_URL}/two`,AnimationClip.WrapMode.Loop))

          this.stateMachines.set(SPIKES_COUNT_ENUM.THREE,
        new State(fsm,`${BASE_URL}/three`,AnimationClip.WrapMode.Loop))

          this.stateMachines.set(SPIKES_COUNT_ENUM.FOUR,
        new State(fsm,`${BASE_URL}/four`,AnimationClip.WrapMode.Loop))
  }


}
