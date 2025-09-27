import { AnimationClip } from "cc";
import DirectionSubStateMachine from "../../Base/DirectionSubStateMachine";
import StateMachine from "../../Base/StateMachine";
import { DIRECTION_ENUM, PARAMS_NAME_ENUM, SPIKES_COUNT_ENUM, SPIKES_COUNT_MAP_NUMBER_ENUM } from "../../Enum";
import State from "../../Base/State";
import SubStateMachine from "../../Base/SubStateMachine";



export const BASE_URL = 'texture/spikes/spikesone'

export default class SpikesOneSubStateMachine extends SubStateMachine{

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
  }

run(): void {
    const value = this.fsm.getParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT);
    this.currentState = this.stateMachines.get(SPIKES_COUNT_MAP_NUMBER_ENUM[value as number]);
}

}
