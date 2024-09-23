import { Observable } from 'rxjs';
import { BuildingSettings, Hero, HeroesSettings } from '../settings/Settings';
import { Nullable } from '../utils/Nullable';
import { BuildingModel } from '../models/BuildingModel';
import { PlayerModel } from '../models/PlayerModel';

export class BuildingViewModel
{
    public BuildingsObs:     Observable<BuildingSettings>;
    public AvaiableHerosObs: Observable<HeroesSettings>;
    public HerosQueueObs:    Observable<Hero[]>;

    playerModel: PlayerModel;
    buildingModel: BuildingModel;

    constructor(buildingModel: BuildingModel, playerModel:PlayerModel)
    {
        this.playerModel      = playerModel;
        this.buildingModel    = buildingModel;
        this.BuildingsObs     = buildingModel.BuildingSettings.asObservable();
        this.AvaiableHerosObs = buildingModel.AvaiableHeroesSettings.asObservable();
        this.HerosQueueObs    = buildingModel.HeroesQueue.asObservable();
        
        this.buildingModel.Summoning.asObservable().subscribe((v:Nullable<Hero>) => 
        {
            if(v != null) console.log("Summoned hero: " + v.name);
        });
    }

    public ValidateHireCost(cost:number): boolean
    {
        return this.playerModel.Currency.getValue() >= cost 
        && this.buildingModel.HeroesQueue.getValue().length < this.buildingModel.BuildingSettings.getValue().hireSlots;
    }

    public Hire(hero:Hero)
    {
        this.buildingModel.QueueHero(hero);
        this.playerModel.Consume(hero.cost);
    }
}