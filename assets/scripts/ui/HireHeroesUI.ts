import { _decorator, Button, Component, instantiate, Node, Prefab } from 'cc';
import { HeroUI } from './HeroUI';
import { HireButton } from './HireButton';
import { Hero } from '../settings/Settings';
import { Subject } from 'rxjs';
const { ccclass, property } = _decorator;

@ccclass('HireHeroesUI')
export class HireHeroesUI extends Component {
    @property({ type: Node })           public AvailableHeroesParent!:  Node;
    @property({ type: Prefab })         public AvailableHeroesPrefab!:  Prefab;
    @property([HeroUI])                 public AviableHeroes:           HeroUI[] = [];
    @property({ type: HireButton })     public HireBtn!:                HireButton;

    public selectedHero = new Subject<Hero>();

    public Initialize(heroes: Hero[], hire: (h:Hero) => void)
    {
        // create and intialize slots for hired heroes
        heroes.forEach(hero =>
            {
                const prefab = instantiate(this.AvailableHeroesPrefab);
                prefab.parent = this.AvailableHeroesParent;
                const ui = prefab.getComponent(HeroUI);
                ui!.Initialize(hero.id, hero.rank, hero.type);
                this.AviableHeroes.push(ui!);

                // hero selection
                ui!.node.on(Node.EventType.MOUSE_DOWN, () => { this.UpdateSelection(ui!, hero); }, true);

                // hero hire
                this.HireBtn.node.on(Button.EventType.CLICK, () => { 
                    if (ui?.highlight.enabledInHierarchy) { hire(hero); } }, this);
            });
    }

    UpdateSelection(selected: HeroUI, hero:Hero)
    {
        selected.highlight.node.active = true;
        this.AviableHeroes.filter(h => h != selected)
        .forEach(h => { h.highlight.node.active = false; });

        this.selectedHero.next(hero);
    }

    public UpdateValidation(cost: number, valid: boolean)
    {
        this.HireBtn.UpdateCost(cost, valid);
    }
}