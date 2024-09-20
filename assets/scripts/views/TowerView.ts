import { _decorator, Component, Node, Tween, tween, TweenEasing, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TowerView')
export class TowerView extends Component 
{
    @property({ type: Node })           public tower!:          Node;
    @property({ type: UITransform })    public towerTrans!:     UITransform;
    @property({ type: UITransform })    public closeTrans!:     UITransform;

    start() 
    {
        this.towerTrans.node.position = new Vec3(0, -this.towerTrans.height, 0);
        this.tower.on(Node.EventType.MOUSE_DOWN, () => { this.show(); }, this);
        this.node.active = false;
    }

    show()
    {
        this.node.active = true;
        this.slideTween(0, "quadIn");
        this.closeTrans.node.once(Node.EventType.MOUSE_DOWN, () => { this.hide(); }, this.closeTrans.node, false);
    }

    hide()
    {
        this.slideTween(-this.towerTrans.height, "backOut", () => { this.node.active = false; });
    }

    slideTween(height: number, easing: TweenEasing, complete?: () => void)
    {
        Tween.stopAllByTarget(this.towerTrans.node.position);

        tween(this.towerTrans.node.position).to(0.25, new Vec3(0, height, 0), 
        {
            easing: easing,
            onUpdate: (target:Vec3) => {this.towerTrans.node.position = target; },
            onComplete: () => { complete?.(); }
        }).start();
    }
}