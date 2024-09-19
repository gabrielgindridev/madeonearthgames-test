import { _decorator, Component, Label } from 'cc';
import { Observable } from 'rxjs';
const { ccclass, property } = _decorator;

@ccclass('CurrencyView')
export class CurrencyView extends Component {
    @property({type: Label}) label!:Label;

    public Bind(obs: Observable<number>) 
    {
        // bind text to property. Probably should bind to context and avoid manual bind
        obs.subscribe(v => this.label.string = v.toString());
    }
}