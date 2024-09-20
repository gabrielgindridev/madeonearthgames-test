import { _decorator, Component, Label, Node, Tween, tween, TweenEasing, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BuildingView')
export class BuildingView extends Component 
{
    @property({ type: Node })           public building!:       Node;
    @property({ type: UITransform })    public buildingTrans!:  UITransform;
    @property({ type: UITransform })    public closeTrans!:     UITransform;
    @property({ type: Label })          public titleLabel!:     Label;
    @property({ type: Label })          public descrLabel!:     Label;

    start() 
    {
        this.buildingTrans.node.position = new Vec3(0, -this.buildingTrans.height, 0);
        this.node.active = false;
    }

    public Bind(name:string, desc:string) 
    {
        this.titleLabel.string = name;
        this.descrLabel.string = desc;

        this.building.on(Node.EventType.MOUSE_DOWN, () => { this.show(); }, this);
    }

    show()
    {
        this.node.active = true;
        this.slideTween(0, "quadIn");
        this.closeTrans.node.once(Node.EventType.MOUSE_DOWN, () => { this.hide(); }, this.closeTrans.node, false);
    }

    hide()
    {
        this.slideTween(-this.buildingTrans.height, "backOut", () => { this.node.active = false; });
    }

    slideTween(height: number, easing: TweenEasing, complete?: () => void)
    {
        Tween.stopAllByTarget(this.buildingTrans.node.position);

        tween(this.buildingTrans.node.position).to(0.25, new Vec3(0, height, 0), 
        {
            easing: easing,
            onUpdate: (target:Vec3) => {this.buildingTrans.node.position = target; },
            onComplete: () => { complete?.(); }
        }).start();
    }
}