import { _decorator, Component, instantiate, Node, Prefab, tween } from 'cc';
import { HeroUI } from '../ui/HeroUI';
import { range } from 'rxjs';
import { Hero } from '../settings/Settings';
const { ccclass, property } = _decorator;

@ccclass('SummonQueueUI')
export class SummonQueueUI extends Component {
    @property({ type: Node })           public SummonHeroesParent!: Node;
    @property({ type: Prefab })         public SummonHeroesPrefab!: Prefab;
    @property([HeroUI])                 public SummonHeroes:        HeroUI[] = [];

    inProgress = false;

    public Initialize(slots: number)
    {
        range(1, slots).subscribe({
            next: () => {
                const prefab = instantiate(this.SummonHeroesPrefab);
                prefab.parent = this.SummonHeroesParent;
                const comp = prefab.getComponent(HeroUI);
                this.SummonHeroes.push(comp!);
            }
        });
    }

    public UpdateSlots(queue: Hero[])
    {
        this.SummonHeroes.map((h, i) => [h, queue[i]] as [HeroUI, Hero?]).forEach(v => {
            if(v[1] != null) v[0].Initialize(v[1].id, v[1].rank, v[1].type, true);
            else             v[0].Reset();
        });

        if(queue.length > 0 && !this.inProgress) 
        {
            this.inProgress = true;

            tween(this.SummonHeroes[0].bar).to(queue[0].summonCooldown - 0.1, {progress: 0},
            {
                onStart: () => this.SummonHeroes[0].bar!.progress = 1,
                onComplete: () => { this.inProgress = false; }
            }).start();
        }
    }
}