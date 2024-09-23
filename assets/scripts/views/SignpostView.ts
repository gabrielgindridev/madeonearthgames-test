import { _decorator, Component, Label, Node } from 'cc';
import { SignpostViewModel } from '../viewModels/SignpostViewModel';
const { ccclass, property } = _decorator;

@ccclass('SignpostView')
export class SignpostView extends Component 
{
    @property({type: Node}) counterLabelContainer!:Node;
    @property({type: Label}) counterLabel!:Label;

    protected start(): void 
    {
        this.counterLabelContainer.active = false;    
    }

    public Bind(signpostVM: SignpostViewModel)
    {
        signpostVM.HeroesObs.subscribe(heroes => 
            {
                this.counterLabelContainer.active = true;
                this.counterLabel.string          = heroes.length.toString();
            });
    }
}


