import { _decorator, Component, Node, instantiate, Label, tween, Vec3, Color } from 'cc';
import { Observable } from 'rxjs';
const { ccclass, property } = _decorator;

@ccclass('CurrencyView')
export class CurrencyView extends Component {
    @property({type: Label})  public label!:   Label;
    @property({type: Node})  public effect!:   Node;

    lastCurrency = 0;

    public Bind(currencyObs: Observable<number>) 
    {
        // bind text to property. Probably should bind to context and avoid manual bind
        currencyObs.subscribe(v => {
            this.label.string = v.toString();

            if(this.lastCurrency > v)
            {
                const newEffect = instantiate(this.effect);
                newEffect.active = true;
                newEffect.parent = this.label.node;
                newEffect.setPosition(Vec3.ZERO);
                const effectLabel = newEffect.getComponent(Label);
                effectLabel!.string = (v - this.lastCurrency).toString();

                tween(newEffect).to(1, { position: new Vec3(0, -200, 0),  }, { onComplete: () => newEffect.destroy() }).start();
                tween(effectLabel!).to(1, { color: new Color(255, 255, 255, 0)}).start();
            }
            this.lastCurrency = v;
        });
    }
}