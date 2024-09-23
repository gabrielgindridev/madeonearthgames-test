import { _decorator, Button, Component, instantiate, Label, Node, Prefab, Tween, tween, TweenEasing, UITransform, Vec3 } from 'cc';
import { range } from 'rxjs';
import { HeroUI } from '../ui/HeroUI';
import { HireButton } from '../ui/HireButton';
import { BuildingViewModel } from '../viewModels/BuildingViewModel';
import { Hero } from '../settings/Settings';
const { ccclass, property } = _decorator;

@ccclass('BuildingView')
export class BuildingView extends Component 
{
    @property({ type: Node })           public building!:               Node;
    @property({ type: UITransform })    public buildingTrans!:          UITransform;
    @property({ type: UITransform })    public closeTrans!:             UITransform;
    @property({ type: Label })          public titleLabel!:             Label;
    @property({ type: Label })          public descrLabel!:             Label;
    @property({ type: HireButton })     public HireBtn!:                HireButton;

    @property({ type: Node })           public AvailableHeroesParent!:  Node;
    @property({ type: Prefab })         public AvailableHeroesPrefab!:  Prefab;
    @property([HeroUI])                 public AviableHeroes:           HeroUI[] = [];

    @property({ type: Node })           public SummonHeroesParent!: Node;
    @property({ type: Prefab })         public SummonHeroesPrefab!: Prefab;
    @property([HeroUI])                 public SummonHeroes:        HeroUI[] = [];


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
                    const comp = prefab.getComponent(HeroUI);
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

            this.AvailableHeroesParent.setPosition(new Vec3(0,0,0)); 
        });

        let playing = false;

        buildingVM.HerosQueueObs.subscribe(queue =>
        {
            this.SummonHeroes.map((h, i) => [h, queue[i]] as [HeroUI, Hero]).forEach(v => {
                if(v[1] != null) v[0].Initialize(v[1].id, v[1].rank, v[1].type, true);
                else             v[0].Reset();
            });

            if(queue.length > 0 && !playing) 
            {
                playing = true;

                const progress = new NumberTarget();
                tween(progress).to(queue[0].summonCooldown - 0.1, {number: 1},
                {
                    onUpdate: (target:NumberTarget) => {this.SummonHeroes[0].bar.progress = 1 - target.number; },
                    onComplete: () => { playing = false;  console.log("finished -> " + queue[0].name) }
                }).start();
            }
        });

        this.building.on(Node.EventType.MOUSE_DOWN, () => { this.show(); }, this);
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

class NumberTarget {
    number = 0;
}