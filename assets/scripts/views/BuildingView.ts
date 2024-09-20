import { _decorator, Component, instantiate, Label, Node, Prefab, Tween, tween, TweenEasing, UITransform, Vec3 } from 'cc';
import { range } from 'rxjs';
import { AvailableHero } from '../ui/AvailableHero';
import { HireButton } from '../ui/HireButton';
import { BuildingViewModel } from '../TaskExercise';
const { ccclass, property } = _decorator;

@ccclass('BuildingView')
export class BuildingView extends Component 
{
    @property({ type: Node })           public building!:               Node;
    @property({ type: UITransform })    public buildingTrans!:          UITransform;
    @property({ type: UITransform })    public closeTrans!:             UITransform;
    @property({ type: Label })          public titleLabel!:             Label;
    @property({ type: Label })          public descrLabel!:             Label;

    @property({ type: Node })           public AvailableHeroesParent!:  Node;
    @property({ type: Prefab })         public AvailableHeroesPrefab!:  Prefab;
    @property([AvailableHero])          public AviableHeroes: AvailableHero[] = [];

    @property({ type: Node })           public SummonHeroesParent!:  Node;
    @property({ type: Prefab })         public SummonHeroesPrefab!:  Prefab;
    @property([AvailableHero])          public SummonHeroes: AvailableHero[] = [];

    @property({ type: HireButton })     public HireBtn!: HireButton;


    start() 
    {
        this.buildingTrans.node.position = new Vec3(0, -this.buildingTrans.height, 0);
        this.node.active = false;
    }

    public Bind(buildingVM: BuildingViewModel) 
    {
        buildingVM.BuildingsObs.subscribe(build => {
            this.titleLabel.string = build.name;
            this.descrLabel.string = build.description;
            
            range(1, build.hireSlots).subscribe({
                next: v => {
                    const prefab = instantiate(this.SummonHeroesPrefab);
                    prefab.parent = this.SummonHeroesParent;
                    const comp = prefab.getComponent(AvailableHero);
                    this.SummonHeroes.push(comp!);
                }
            });
        });

        buildingVM.AvaiableHerosObs.subscribe(heroes => 
        {
            heroes.heroes.forEach(hero =>
            {
                const prefab = instantiate(this.AvailableHeroesPrefab);
                prefab.parent = this.AvailableHeroesParent;
                const comp = prefab.getComponent(AvailableHero);
                comp!.Initialize(hero.id, hero.rank, hero.type);
                this.AviableHeroes.push(comp!);
                comp?.node.on(Node.EventType.MOUSE_DOWN, () => 
                    { this.HireSelected(comp, hero.cost, buildingVM.ValidateHireCost(hero.cost)); }, true);

            });

            this.AvailableHeroesParent.setPosition(new Vec3(0,0,0)); 
        });

        this.building.on(Node.EventType.MOUSE_DOWN, () => { this.show(); }, this);
    }

    HireSelected(selected: AvailableHero, cost:number, valid:boolean)
    {
        selected.highlight.node.active = true;
        this.HireBtn.UpdateCost(cost, valid);

        this.AviableHeroes.filter(h => h != selected)
        .forEach(h => { h.highlight.node.active = false; });
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