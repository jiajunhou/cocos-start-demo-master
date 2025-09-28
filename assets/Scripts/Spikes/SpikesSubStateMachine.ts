import { AnimationClip } from "cc";
import DirectionSubStateMachine from "../../Base/DirectionSubStateMachine";
import StateMachine from "../../Base/StateMachine";
import { DIRECTION_ENUM, PARAMS_NAME_ENUM, SPIKES_COUNT_ENUM, SPIKES_COUNT_MAP_NUMBER_ENUM } from "../../Enum";
import State from "../../Base/State";
import SubStateMachine from "../../Base/SubStateMachine";

export default class SpikesSubStateMachine extends SubStateMachine{

run(): void {
    const value = this.fsm.getParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT);
    this.currentState = this.stateMachines.get(SPIKES_COUNT_MAP_NUMBER_ENUM[value as number]);
}

}
