import { BehaviorSubject } from 'rxjs';
import { Hero } from '../settings/Settings';

export class PlayerModel 
{
    public Currency: BehaviorSubject<number>;
    public Heroes:   BehaviorSubject<Hero[]>;

    constructor(currency: number) 
    {
        this.Currency = new BehaviorSubject<number>(currency);
        this.Heroes   = new BehaviorSubject<Hero[]>([]);
    }

    public Consume(cost:number)
    {
        this.Currency.next(this.Currency.getValue() - cost);
    }
}