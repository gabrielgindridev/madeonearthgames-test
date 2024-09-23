import { Observable } from "rxjs";
import { Hero } from "../settings/Settings";
import { PlayerModel } from "../models/PlayerModel";

export class SignpostViewModel
{
    public HeroesObs  : Observable<Hero[]>;

    constructor(playerModel:PlayerModel)
    {
        this.HeroesObs = playerModel.Heroes.asObservable();
    }
}