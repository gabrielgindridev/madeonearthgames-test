import { _decorator, Button, Component, instantiate, Node, Prefab } from 'cc';
import { HeroUI } from './HeroUI';
import { HireButton } from './HireButton';
import { Hero } from '../settings/Settings';
const { ccclass, property } = _decorator;

@ccclass('HireHeroesUI')
export class HireHeroesUI extends Component {
    @property({ type: Node })           public AvailableHeroesParent!:  Node;
    @property({ type: Prefab })         public AvailableHeroesPrefab!:  Prefab;
    @property([HeroUI])                 public AviableHeroes:           HeroUI[] = [];
    @property({ type: HireButton })     public HireBtn!:                HireButton;

    public Initialize(heroes: Hero[], validate: (h:Hero) => boolean, hire: (h:Hero) => void)
    {
        heroes.forEach(hero =>
            {
                const prefab = instantiate(this.AvailableHeroesPrefab);
                prefab.parent = this.AvailableHeroesParent;
                const comp = prefab.getComponent(HeroUI);
                comp!.Initialize(hero.id, hero.rank, hero.type);
                this.AviableHeroes.push(comp!);
                comp?.node.on(Node.EventType.MOUSE_DOWN, () => 
                    { this.SelectHero(comp, hero.cost, validate(hero)); }, true);

                this.HireBtn.node.on(Button.EventType.CLICK, () =>
                {
                    if (comp?.highlight.enabledInHierarchy) {
                        hire(hero);
                        this.SelectHero(comp, hero.cost, validate(hero));
                    }
                }, this);
            });
    }

    SelectHero(selected: HeroUI, cost:number, valid:boolean)
    {
        selected.highlight.node.active = true;
        this.HireBtn.UpdateCost(cost, valid);

        this.AviableHeroes.filter(h => h != selected)
        .forEach(h => { h.highlight.node.active = false; });
    }
}