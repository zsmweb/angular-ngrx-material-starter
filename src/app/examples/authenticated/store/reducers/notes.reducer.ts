

import {Note,ditem} from '../../../../core/models/note';
import * as notesActions from '../actions/notes.actions';
import {createSelector} from '@ngrx/store';

export interface State {
  ids: string[];
  entities: { [id: string]: Note };
  devices:string[];
  curDevice:string;
  selectedNoteId: string;
}

export const INIT_STATE: State = {
  ids: [],
  entities: {},
  devices:[],
  curDevice:null,
  selectedNoteId: null
};


export function reducer(state = INIT_STATE, action: notesActions.All): State {

  switch (action.type) {

    case notesActions.NOTES_LISTED : {

      const ids = Object.keys(action.payload);
      return {
        ...state,
        ids,
        entities: action.payload
      };

    }

    case notesActions.NOTE_ADDED : {

      if (state.ids.includes(action.payload.id)) { // if note already exists
        return state;
      }

      return {
        ...state,
        ids: [...state.ids, action.payload.id],
        entities: Object.assign({}, state.entities, {[action.payload.id]: action.payload})
      };

    }


    case notesActions.NOTE_UPDATED : {

      const newState = Object.assign({}, state);
      const note = newState.entities[action.payload.id];
      newState.ids = [...newState.ids];
      newState.entities = {...newState.entities};
      if (!note) { // note doesn't exist in the store
        newState.ids = [...newState.ids, action.payload.id];
        newState.entities[action.payload.id] = action.payload; // create it
      } else {
        newState.entities[action.payload.id] = Object.assign({}, {...note}, {...action.payload});
      }
      return newState;
    }


    case notesActions.NOTE_DELETED : {

      if (!state.entities[action.payload.id]) {
        return state;
      }

      const newState = Object.assign({}, state);
      
      const idIndex = newState.ids.indexOf(action.payload.id);

      newState.ids = [...newState.ids];
      newState.entities = {...newState.entities};
      newState.ids.splice(idIndex, 1);
      newState.entities[action.payload.id] = undefined;

      return newState;
    }

    case notesActions.ERROR_REPORT : {

      const ids = Object.keys(action.payload);
      return {
        ...state,
        ids,
        entities: action.payload
      };

    }

    case notesActions.DEVICE_LIST :{
      return {
        ...state,
        devices:action.payload
      };
    }

    case notesActions.JOIN_ROOM : {
      return{
        ...state,
        curDevice:action.payload
      }
    }
    default: return state;
  }
}

export const getDevices = (state: State) => state.devices;
export const getCurDevices = (state: State) => state.curDevice;
export const getEntites = (state: State) => state.entities;
export const getIds = (state: State) => state.ids;
export const getSelectedId = (state: State) => state.selectedNoteId;

export const getSelected = createSelector(
    getEntites,
    getSelectedId,
    (entities, id) => entities[id]
);

export const getEntitesArray = (state: State) => state.ids.map(id => state.entities[id]);
export const getCpuEntitesArray = (state: State) => state.ids.filter(id=>state.entities[id]['path']=='/sys/srs/srs_cpulevel').map(id => {
  let bd = state.entities[id].body;
  return {id:bd[0],min:bd[1],max:bd[2],timeout:bd[3],path:"/sys/srs/srs_cpulevel"};
});
export const getGpuEntitesArray = (state: State) => state.ids.filter(id=>state.entities[id]['path']=='/sys/srs/srs_gpulevel').map(id => {
  let bd = state.entities[id].body;
  return {id:bd[0],min:bd[1],max:bd[2],timeout:bd[3],path:"/sys/srs/srs_gpulevel"};
});