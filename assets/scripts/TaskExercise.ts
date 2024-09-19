import { _decorator, Component } from 'cc';
import { CurrencyView } from './views/CurrencyView';
import { BehaviorSubject, Observable } from 'rxjs';
const { ccclass, property } = _decorator;

@ccclass('TaskExercise')
export class TaskExercise extends Component 
{
    @property({ type: CurrencyView }) public currencyView!: CurrencyView;

    start() 
    {
        const playerModel = new PlayerModel(999999999);         // create player model and inject placeholder data
        const currencyVM  = new CurrencyViewModel(playerModel); // create currency VM and inject model
        this.currencyView.Bind(currencyVM.CurrencyObs);         // bind view to VM 
    }
}

class PlayerModel 
{
    public Currency: BehaviorSubject<number>;
    // TODO: current heroes
    // TODO: current buildings

    constructor(currency: number) {
        this.Currency = new BehaviorSubject<number>(currency);
      }
}

class CurrencyViewModel 
{
    public CurrencyObs  : Observable<number>;

    constructor(model:PlayerModel)
    {
        this.CurrencyObs = model.Currency.asObservable();
    }
}