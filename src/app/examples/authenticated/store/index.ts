import * as fromNotes from './reducers/notes.reducer';
import {createFeatureSelector, createSelector} from '@ngrx/store';


export interface NotesState {
  notes: fromNotes.State;
}

export interface State {
  'notes': NotesState;
}

export const reducers = {
  notes: fromNotes.reducer
};


export const getNotesRootState = createFeatureSelector<NotesState>('notes');
export const getNotesState = createSelector(getNotesRootState, (notesState: NotesState) => notesState.notes)

export const getDevices = createSelector(getNotesState, fromNotes.getDevices);
export const getCurDevices = createSelector(getNotesState, fromNotes.getCurDevices);
export const getEntites = createSelector(getNotesState, fromNotes.getEntites);
export const getIds = createSelector(getNotesState, fromNotes.getIds);
export const getSelectedId = createSelector(getNotesState, fromNotes.getSelectedId);
export const getSelected = createSelector(getNotesState, fromNotes.getSelected);
export const getEntitiesArray = createSelector(getNotesState, fromNotes.getEntitesArray);
export const getCpuEntitesArray = createSelector(getNotesState, fromNotes.getCpuEntitesArray);
export const getGpuEntitesArray = createSelector(getNotesState, fromNotes.getGpuEntitesArray);