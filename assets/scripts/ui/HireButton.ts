import { _decorator, Button, Color, Component, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HireButton')
export class HireButton extends Component {
    @property({ type: Button }) public button!:     Button;
    @property({ type: Label })  public costLabel!:  Label;

    start(): void {
        this.button.interactable = false;
    }

    public UpdateCost(cost:number, available:boolean)
    {
        this.button.interactable = available;
        this.costLabel.node.active = true;
        this.costLabel.string = "$" + cost;
        this.costLabel.color = available ? Color.GREEN : Color.RED;
    }
}