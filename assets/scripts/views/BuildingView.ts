import { _decorator, Component, Label, Node, Tween, tween, TweenEasing, UITransform, Vec3 } from 'cc';
import { BuildingViewModel } from '../viewModels/BuildingViewModel';
import { SummonQueueUI } from '../ui/SummonQueueUI';
import { HireHeroesUI } from '../ui/HireHeroesUI';
const { ccclass, property } = _decorator;

@ccclass('BuildingView')
export class BuildingView extends Component 
{
    @property({ type: Node })           public base!:               Node;           // building base
    @property({ type: UITransform })    public uiTransform!:        UITransform;    // ui root
    @property({ type: UITransform })    public closeTransform!:     UITransform;    // area to hide ui
    @property({ type: Label })          public titleLabel!:         Label;
    @property({ type: Label })          public descrLabel!:         Label;

    @property({ type: SummonQueueUI })  public SummonUI!:   SummonQueueUI;
    @property({ type: HireHeroesUI })   public HireUI!:     HireHeroesUI;


    start() 
    {
        // start ui hidden
        this.uiTransform.node.position = new Vec3(0, -this.uiTransform.height, 0);      
        this.node.active = false;
    }

    public Bind(buildingVM: BuildingViewModel) 
    {
        buildingVM.BuildingsObs.subscribe(build => {
            this.titleLabel.string = build.name;
            this.descrLabel.string = build.description;
            this.SummonUI.Initialize(build.hireSlots);
        });

        buildingVM.AvaiableHerosObs.subscribe(heroes => {
            this.HireUI.Initialize(heroes.heroes, h => { return buildingVM.ValidateHireCost(h.cost)}, h => { buildingVM.Hire(h)});
        });

        buildingVM.HerosQueueObs.subscribe(queue => {
            this.SummonUI.UpdateSlots(queue);
        });

        this.base.on(Node.EventType.MOUSE_DOWN, () => { this.show(); }, this);
    }

    show()
    {
        this.node.active = true;
        this.slideTween(0, "quadIn");
        this.closeTransform.node.once(Node.EventType.MOUSE_DOWN, () => { this.hide(); }, this.closeTransform.node, false);
    }

    hide()
    {
        this.slideTween(-this.uiTransform.height, "backOut", () => { this.node.active = false; });
    }

    slideTween(height: number, easing: TweenEasing, complete?: () => void)
    {
        Tween.stopAllByTarget(this.uiTransform.node.position);

        tween(this.uiTransform.node.position).to(0.25, new Vec3(0, height, 0), 
        {
            easing: easing,
            onUpdate: (target) => {this.uiTransform.node.position = target as Vec3; },
            onComplete: () => { complete?.(); }
        }).start();
    }
}