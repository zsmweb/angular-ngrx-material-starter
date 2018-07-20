import { Component, OnInit } from '@angular/core';

import { routeAnimations } from '@app/core';
import { NotesService } from '../authenticated/services/notes.service';
import { Subject, Observable } from 'rxjs';
import {Store} from '@ngrx/store';
import * as fromNotesStore from '../authenticated/store';

import * as notesActions from '../authenticated/store/actions/notes.actions';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
@Component({
  selector: 'anms-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss'],
  animations: [routeAnimations]
})
export class ExamplesComponent implements OnInit {
  examples:Observable<any>;
  constructor(private router: Router,private noteService:NotesService,private store: Store<fromNotesStore.State>) {}
  curDevice;
  ngOnInit() {
    this.noteService.deviceMonitor$.subscribe((devices)=>{
      if(!this.curDevice&&devices.length>0){
        this.curDevice = devices[0];
        this.store.dispatch(new notesActions.JoinRoom(this.curDevice));
        this.router.navigate(['/examples/authenticated/'+this.curDevice]);
        console.log('going'+this.curDevice)
      }
      let tmp =localStorage.getItem('curDevice');
      if(tmp){
        if(devices.includes(tmp) && this.curDevice!=tmp){
          this.curDevice = tmp;
          this.store.dispatch(new notesActions.JoinRoom(this.curDevice));
          this.router.navigate(['/examples/authenticated/'+this.curDevice]);
          console.log('going1'+this.curDevice)
        }
      }
    });
    this.examples = this.store.select(fromNotesStore.getDevices).pipe(
      map(d=>{
        return d.map(dd=>{return { link: 'authenticated/'+dd, label: dd }})
      })
    );
  }
}
