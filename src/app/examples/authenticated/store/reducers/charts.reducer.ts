

import * as chartsActions from '../actions/charts.actions';

import * as variance from 'compute-variance';
import * as average from 'average-array';

export interface State {
  times: {[device:string]:number[]};
  entities: { [device:string]: any };
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
    case chartsActions.CLEAR_ALL : {
        let newEntities = {...state.entities};
        newEntities[action.payload] = [];
        return {
            ...state,
            entities: newEntities
        }
    }
    default: return state;
  }
}

export const getTimes = (state:State) => state.times;
export const getEntities = (state:State) => state.entities;

export const getAverageFps = (state:State) =>{
    let res = {};
    Object.keys(state.entities).map(key=>{
        let fpsarr = state.entities[key].map(json=>parseInt(json.fps));
        res[key] = { average: average(fpsarr).toFixed(2),variance: variance(fpsarr).toFixed(2)};
    });
    return res;
}