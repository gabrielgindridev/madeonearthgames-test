import { BehaviorSubject, delay, first } from "rxjs";
import { BuildingSettings, Hero, HeroesSettings } from "../settings/Settings";
import { Nullable } from "../utils/Nullable";

export class BuildingModel
{
    public BuildingSettings:        BehaviorSubject<BuildingSettings>;
    public AvaiableHeroesSettings:  BehaviorSubject<HeroesSettings>;
    public HeroesQueue:             BehaviorSubject<Hero[]>;
    public Summoning:               BehaviorSubject<Nullable<Hero>>;

    constructor(buildingSettings: BuildingSettings, heroesSettings:HeroesSettings)
    {
        this.BuildingSettings       = new BehaviorSubject<BuildingSettings>(buildingSettings);
        this.AvaiableHeroesSettings = new BehaviorSubject<HeroesSettings>(heroesSettings);
        this.HeroesQueue            = new BehaviorSubject<Hero[]>([]);
        this.Summoning              = new BehaviorSubject<Nullable<Hero>>(null);

        this.HeroesQueue.asObservable().subscribe(
            (heroes) => { console.log("heroes observable -> " + heroes.map(h => h.name).join(', ')); }
        )
    }

    public QueueHero(hero:Hero)
    {
        console.log("QueueHero " + hero.name);

        const queue = this.HeroesQueue.getValue().concat(hero);
        this.HeroesQueue.next(queue);
        if(queue.length == 1) this.Summon(hero);
    }

    Summon(hero:Hero)
    {
        this.Summoning.asObservable().pipe(first(), delay(hero.summonCooldown * 1000))
        .subscribe(
           () => {
                console.log("Summoning finished for" + hero.name);
                const next = this.HeroesQueue.getValue().slice(1);
                this.HeroesQueue.next(next);

                if(next.length > 0) this.Summon(next[0]);
            }
       );
    }
}