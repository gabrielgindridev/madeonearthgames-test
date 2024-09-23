import { _decorator, Component, Label, Node, Sprite, Tween, tween, TweenEasing, UITransform, Vec3 } from 'cc';
import { BuildingViewModel } from '../viewModels/BuildingViewModel';
import { SummonQueueUI } from '../ui/SummonQueueUI';
import { HireHeroesUI } from '../ui/HireHeroesUI';
import { combineLatestWith } from 'rxjs';
const { ccclass, property } = _decorator;

@ccclass('BuildingView')
export class BuildingView extends Component 
{
    @property({ type: Node })           public base!:               Node;           // building base
    @property({ type: Sprite })         public baseQueueWarning!:   Sprite;         // building base queue active warning
    
    @property({ type: UITransform })    public uiTransform!:        UITransform;    // ui root
    @property({ type: UITransform })    public closeTransform!:     UITransform;    // interactive area to hide ui
    @property({ type: Label })          public titleLabel!:         Label;
    @property({ type: Label })          public descrLabel!:         Label;

    // view components
    @property({ type: SummonQueueUI })  public SummonUI!:   SummonQueueUI;
    @property({ type: HireHeroesUI })   public HireUI!:     HireHeroesUI;


    start() 
    {
        // start ui hidden
        this.uiTransform.node.position = new Vec3(0, -this.uiTransform.height, 0);      
        this.node.active = false;
        this.baseQueueWarning.enabled = false;
    }

    public Bind(buildingVM: BuildingViewModel) 
    {
        buildingVM.Visibility.Visible.asObservable().subscribe(v =>{ this.setVisible(v); }); // update visibility

        // initialize summon slots
        buildingVM.BuildingsObs.subscribe(build => {
            this.titleLabel.string = build.name;
            this.descrLabel.string = build.description;
            this.SummonUI.Initialize(build.hireSlots);
        });

        // initialize available hire heroes
        buildingVM.AvaiableHerosObs.subscribe(heroes => {
            this.HireUI.Initialize(heroes.heroes, h => { buildingVM.Hire(h)});
        });

        // update hero summon queue slots and validate
        buildingVM.HerosQueueObs.pipe(combineLatestWith(this.HireUI.selectedHero.asObservable()))
        .subscribe(v => {
            const queue = v[0];
            this.SummonUI.UpdateSlots(queue);
            this.baseQueueWarning.enabled = queue.length > 0;
            this.HireUI.UpdateValidation(v[1].cost, buildingVM.ValidateHireCost(v[1].cost));
        });

        this.base.on(Node.EventType.MOUSE_DOWN, () => { this.show(); }, this);

        this.HireUI.selectedHero.asObservable().subscribe(h => { this.HireUI.UpdateValidation(h.cost, buildingVM.ValidateHireCost(h.cost)); });
    }

    setVisible(value: boolean)
    {
        if(value) this.show();
        else      this.hide();
    }

    show()
    {
        this.node.active = true;
        this.slideTween(0, "quadIn");
        this.closeTransform.node.once(Node.EventType.MOUSE_DOWN, () => { this.hide(); }, this.closeTransform.node, false);
        this.baseQueueWarning.node.active = false;
    }

    hide()
    {
        this.slideTween(-this.uiTransform.height, "backOut", () => { this.node.active = false; });
        this.baseQueueWarning.node.active = true;
    }

    slideTween(height: number, easing: TweenEasing, complete?: () => void)
    {
        Tween.stopAllByTarget(this.uiTransform.node.position);

        tween(this.uiTransform.node).to(0.25, { position: new Vec3(0, height, 0) }, 
        {
            easing: easing,
            onComplete: () => { complete?.(); }
        }).start();
    }
}