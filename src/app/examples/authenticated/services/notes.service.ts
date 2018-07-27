import { Injectable } from '@angular/core';
import {SocketService} from '../../../core/socketio/socket.service';
import { Observable } from 'rxjs';

@Injectable()
export class NotesService {

  theDevice:string;
  notesListed$: Observable<any>;
  noteAdded$: Observable<any>;
  noteUpdated$: Observable<any>;
  noteDeleted$: Observable<any>;
  error$: Observable<any>;
  fps$:Observable<any>;
  download$:Observable<any>;
  deviceMonitor$: Observable<any>;

  constructor(private socket: SocketService) {
    this.socket.join('notes');
    this.socket.emit('reverseDevice',"ok");
    // Every socket NOTES event has it's own observable, will be used by ngrx effects
    this.notesListed$ = this.socket.listen('[Notes] Listed');
    this.noteAdded$ = this.socket.listen('[Notes] Added');
    this.noteUpdated$ = this.socket.listen('[Notes] Updated');
    this.noteDeleted$ = this.socket.listen('[Notes] Deleted');
    this.error$ = this.socket.listen('[Notes] Error');
    this.fps$ = this.socket.listen('[FPS]');
    this.download$ = this.socket.listen('getDeviceJson');
    this.deviceMonitor$ = this.socket.listen('[DEVICE]');
  }

  join(room: string) {
    this.socket.join(room);
    if('notes'!=room){
      this.theDevice = room;
    }
  }

  // These methods will be called by ngrx effects (do not use directly in the components)
  listNotes() {
    this.socket.emit('[Notes] List');
  }

  addNote(note) {
    this.socket.emit('[Notes] Add', note);
  }

  updateNote(note) {
    this.socket.emit('[Notes] Update', note);
  }

  deleteNote(note) {
    this.socket.emit('[Notes] Delete', note);
  }

  download(){
    this.socket.emit('getDeviceJson',{device:this.theDevice});
  }
}
