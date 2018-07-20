

import * as chartsActions from '../actions/charts.actions';
import {createSelector} from '@ngrx/store';
import { stat } from 'fs';

export interface State {
  times: {[device:string]:number[]};
  entities: { [time: number]: any };
}

export const INIT_STATE: State = {
  times: {},
  entities: {}
};

export function reducer(state = INIT_STATE, action: chartsActions.All): State {
  switch (action.type) {
    case chartsActions.JSON_ALL : {
        var times4device = action.payload.map(json=>{
            return json.time;
        });
        let device = action.payload[0].device;
        if(!device){
            return state;
        }
        return {
            ...state,
            times:{[device]:times4device},
            entities:{[device]:action.payload}
        }
    }
    case chartsActions.JSON_ONE : {
        let device = action.payload.device;
        if(!device){
            return state;
        }

        let newTimes = {...state.times};
        let newEntities = {...state.entities};
        if(!newTimes[device]){
            newTimes[device]=[];
            newEntities[device]=[];
        }else{
            newTimes[device] = [...newTimes[device]];
            newEntities[device] = [...newEntities[device]];
        }
        if(newTimes[device].includes(action.payload.time)){
            return state;
        }
        newTimes[device].push(action.payload.time);
        newEntities[device].push(action.payload);
        return {
            ...state,
            times:newTimes,
            entities: newEntities
        }
    }
    default: return state;
  }
}

export const getTimes = (state:State) => state.times;
export const getEntities = (state:State) => state.entities;