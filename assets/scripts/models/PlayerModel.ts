import { BehaviorSubject } from 'rxjs';
import { Hero, PlayerSettings } from '../settings/Settings';

export class PlayerModel 
{
    public Currency:    BehaviorSubject<number>;
    public Heroes:      BehaviorSubject<Hero[]>;

    constructor(settings: PlayerSettings) 
    {
        this.Currency = new BehaviorSubject<number>(settings.state.currency);
        this.Heroes   = new BehaviorSubject<Hero[]>(settings.state.heroes);
    }

    public Consume(cost:number)
    {
        this.Currency.next(this.Currency.getValue() - cost);
    }
    
    public SummonHero(hero:Hero)
    {
        this.Heroes.next(this.Heroes.getValue().concat(hero));
    }
}