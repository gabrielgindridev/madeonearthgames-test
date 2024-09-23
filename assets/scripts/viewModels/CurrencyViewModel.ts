import { Observable } from 'rxjs';
import { PlayerModel } from '../models/PlayerModel';

export class CurrencyViewModel 
{
    public CurrencyObs  : Observable<number>;

    constructor(model:PlayerModel)
    {
        this.CurrencyObs = model.Currency.asObservable();
    }
}