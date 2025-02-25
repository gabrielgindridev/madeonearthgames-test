import { Observable } from 'rxjs';
import { BuildingSettings, Hero, HeroesSettings } from '../settings/Settings';
import { BuildingModel } from '../models/BuildingModel';
import { PlayerModel } from '../models/PlayerModel';
import { Visibility } from './Visibility';

export class BuildingViewModel
{
    public BuildingsObs:     Observable<BuildingSettings>;
    public AvaiableHerosObs: Observable<HeroesSettings>;
    public HerosQueueObs:    Observable<Hero[]>;
    
    public Visibility = new Visibility();

    playerModel: PlayerModel;
    buildingModel: BuildingModel;

    constructor(buildingModel: BuildingModel, playerModel:PlayerModel)
    {
        this.playerModel      = playerModel;
        this.buildingModel    = buildingModel;
        this.BuildingsObs     = buildingModel.BuildingSettings.asObservable();
        this.AvaiableHerosObs = buildingModel.AvaiableHeroesSettings.asObservable();
        this.HerosQueueObs    = buildingModel.HeroesQueue.asObservable();
        
        // update summoned heroes
        this.buildingModel.Summoning.asObservable().subscribe(hero => { if(hero != null) this.playerModel.SummonHero(hero); });
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