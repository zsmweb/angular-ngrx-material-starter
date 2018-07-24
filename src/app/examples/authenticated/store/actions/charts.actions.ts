import {Action} from '@ngrx/store';

export const JSON_ONE  = '[JSON] one'; 
export const JSON_ALL  = '[JSON] all'; 
export const CLEAR_ALL = '[JSON] clear'

export class OneJson implements Action {
    readonly type = JSON_ONE;
    constructor(public payload?: any) {}
}

export class AllJson implements Action {
    readonly type = JSON_ALL;
    constructor(public payload?: any) {}
}

export class ClearAll implements Action {
    readonly type = CLEAR_ALL;
    constructor(public payload?:string){}
}

export type All =
    AllJson|OneJson|ClearAll;