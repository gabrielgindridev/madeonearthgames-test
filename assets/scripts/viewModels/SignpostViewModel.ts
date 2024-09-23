import { Observable } from "rxjs";
import { Hero } from "../settings/Settings";
import { PlayerModel } from "../models/PlayerModel";
import { Visibility } from "./Visibility";

export class SignpostViewModel
{
    public HeroesObs : Observable<Hero[]>;
    public Visibility = new Visibility();

    constructor(playerModel:PlayerModel)
    {
        this.HeroesObs = playerModel.Heroes.asObservable();
    }
}