import { _decorator, Button, Component, instantiate, Label, Node, Prefab, Tween, tween, TweenEasing, UITransform, Vec3 } from 'cc';
import { HeroUI } from '../ui/HeroUI';
import { HireButton } from '../ui/HireButton';
import { BuildingViewModel } from '../viewModels/BuildingViewModel';
import { SummonQueueUI } from '../ui/SummonQueueUI';
const { ccclass, property } = _decorator;

@ccclass('BuildingView')
export class BuildingView extends Component 
{
    @property({ type: Node })           public base!:                   Node;
    @property({ type: UITransform })    public uiTransform!:            UITransform;
    @property({ type: UITransform })    public closeTransform!:         UITransform;
    @property({ type: Label })          public titleLabel!:             Label;
    @property({ type: Label })          public descrLabel!:             Label;
    @property({ type: HireButton })     public HireBtn!:                HireButton;

    @property({ type: Node })           public AvailableHeroesParent!:  Node;
    @property({ type: Prefab })         public AvailableHeroesPrefab!:  Prefab;
    @property([HeroUI])                 public AviableHeroes:           HeroUI[] = [];

    @property({ type: SummonQueueUI })  public SummonUI!: SummonQueueUI;


    start() 
    {
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

        buildingVM.AvaiableHerosObs.subscribe(heroes => 
        {
            heroes.heroes.forEach(hero =>
            {
                const prefab = instantiate(this.AvailableHeroesPrefab);
                prefab.parent = this.AvailableHeroesParent;
                const comp = prefab.getComponent(HeroUI);
                comp!.Initialize(hero.id, hero.rank, hero.type);
                this.AviableHeroes.push(comp!);
                comp?.node.on(Node.EventType.MOUSE_DOWN, () => 
                    { this.HireSelected(comp, hero.cost, buildingVM.ValidateHireCost(hero.cost)); }, true);

                this.HireBtn.node.on(Button.EventType.CLICK, () =>
                {
                    if (comp?.highlight.enabledInHierarchy) {
                        buildingVM.Hire(hero);
                        this.HireSelected(comp, hero.cost, buildingVM.ValidateHireCost(hero.cost));
                    }
                }, this);
            });
        });

        buildingVM.HerosQueueObs.subscribe(queue =>
        {
            this.SummonUI.UpdateSlots(queue);
        });

        this.base.on(Node.EventType.MOUSE_DOWN, () => { this.show(); }, this);
    }

    HireSelected(selected: HeroUI, cost:number, valid:boolean)
    {
        selected.highlight.node.active = true;
        this.HireBtn.UpdateCost(cost, valid);

        this.AviableHeroes.filter(h => h != selected)
        .forEach(h => { h.highlight.node.active = false; });
    }

    Hire()
    {
        console.log("hire");
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