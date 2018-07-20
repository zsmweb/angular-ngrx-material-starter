


import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {NotesService} from '../../services/notes.service';
import * as notesActions from '../actions/notes.actions';
import { Observable,of } from 'rxjs';
import { tap,startWith,switchMap,map } from 'rxjs/operators';
import { Action } from '@ngrx/store';


@Injectable()

export class NotesEffects {

  @Effect({dispatch: false}) // effect will not dispatch any actions
  listNotes$ = this.actions$
      .ofType(notesActions.LIST_NOTES) // requesting the socket server to list the notes for us
      .pipe(
          startWith(new notesActions.NotesListed()), // List notes automatically when applications starts
          tap(() => this.notesService.listNotes())
      );

  @Effect()
  notesListed$: Observable<Action> =
      this.notesService.notesListed$ // listen to the socket for NOTES LIST event
      .pipe(switchMap(notes =>
          of(new notesActions.NotesListed(notes)) // ask the the store to populate the notes
      ));

  @Effect({dispatch: false})
  addNote$ = this.actions$
      .ofType(notesActions.ADD_NOTE).pipe(
        map((action: notesActions.AddNote) => action.payload),
        tap((note) => this.notesService.addNote(note))
      );
      

  @Effect()
  noteAdded$: Observable<Action> =
      this.notesService.noteAdded$
      .pipe(switchMap(note =>
          of(new notesActions.NoteAdded(note))
      ));

  @Effect({dispatch: false})
  updateNote$ = this.actions$
      .ofType(notesActions.UPDATE_NOTE).pipe(
        map((action: notesActions.UpdateNote) => action.payload),
        tap((note) => this.notesService.updateNote(note))
      );

  @Effect()
  noteUpdated$: Observable<Action> =
      this.notesService.noteUpdated$.pipe(
      switchMap(note =>
          of(new notesActions.NoteUpdated(note))
      ));

  @Effect({dispatch: false})
  deleteNote$ = this.actions$
      .ofType(notesActions.DELETE_NOTE).pipe(
      map((action: notesActions.UpdateNote) => action.payload),
      tap((note) => this.notesService.deleteNote(note))
    );

  @Effect()
  noteDeleted$: Observable<Action> =
      this.notesService.noteDeleted$
      .pipe(switchMap(note =>
          of(new notesActions.NoteDeleted(note))
      ));

  @Effect({dispatch: false})
  joinRoom$ = this.actions$
      .ofType(notesActions.JOIN_ROOM).pipe(
      map((action: notesActions.JoinRoom) => action.payload),
      tap((room) => this.notesService.join(room)));

  @Effect()
  deviceListed$: Observable<Action> =
      this.notesService.deviceMonitor$ // listen to the socket for DEVICE LIST event
      .pipe(switchMap(dvs =>
          of(new notesActions.DeviceListed(dvs)) // ask the the store to populate the notes
      ));

  @Effect()
  errorReport$: Observable<Action> =
    this.notesService.error$.pipe
    (switchMap(obj =>
        of(new notesActions.NoteError(obj))
    ));
      
  constructor(private actions$: Actions, private notesService: NotesService) {}
}
