import {Action} from '@ngrx/store';

export const JSON_ONE  = '[JSON] one'; 
export const JSON_ALL  = '[JSON] all'; 

export class OneJson implements Action {
    readonly type = JSON_ONE;
    constructor(public payload?: any) {}
}

export class AllJson implements Action {
    readonly type = JSON_ALL;
    constructor(public payload?: any) {}
}

export type All =
    AllJson|OneJson;