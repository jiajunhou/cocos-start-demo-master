import { _decorator } from 'cc';
import State from '../Base/State';
import StateMachine from './StateMachine';


export default abstract class SubStateMachine{
  constructor(public fsm:StateMachine){}

private _current_state:State = null;

  stateMachines:Map<string,State> = new Map()

  get currentState(){
    return this._current_state;
  }

  set currentState(newState){
     if (!newState) {
      return
    }
    this._current_state = newState
    this._current_state.run()
  }



abstract run():void
}
