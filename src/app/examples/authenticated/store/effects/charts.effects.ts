


import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {NotesService} from '../../services/notes.service';
import * as chartsActions from '../actions/charts.actions';
import { Observable,of } from 'rxjs';
import { tap,startWith,switchMap,map } from 'rxjs/operators';
import { Action } from '@ngrx/store';


@Injectable()

export class ChartsEffects {

    @Effect()
    allJson$: Observable<Action> =
        this.notesService.download$ // listen to the socket for NOTES LIST event
        .pipe(switchMap(jsons =>
            of(new chartsActions.AllJson(jsons)) // ask the the store to populate the notes
        ));

    @Effect()
    oneJson$: Observable<Action> =
        this.notesService.fps$ // listen to the socket for NOTES LIST event
        .pipe(switchMap(json =>
            of(new chartsActions.OneJson(json)) // ask the the store to populate the notes
        ));

  constructor(private actions$: Actions, private notesService: NotesService) {}
}
