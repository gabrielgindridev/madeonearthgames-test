import { _decorator, Component } from 'cc';
import { CurrencyView } from './views/CurrencyView';
import { BehaviorSubject, Observable } from 'rxjs';
import { BuildingSettings, BuildingsSettings, HeroesSettings, MapBuildings } from './settings/Settings';
import buildingsJson from '../settings/buildings.json';
import heroesJson from '../settings/heroes.json';

const { ccclass, property } = _decorator;

@ccclass('TaskExercise')
export class TaskExercise extends Component 
{
    @property({ type: CurrencyView })   public currencyView!:   CurrencyView;
    @property([MapBuildings])           public buildings:       MapBuildings[] = [];

    start() 
    {
        const playerModel = new PlayerModel(999999999);         // create player model and inject placeholder data
        const currencyVM  = new CurrencyViewModel(playerModel); // create currency VM and inject model
        this.currencyView.Bind(currencyVM.CurrencyObs);         // bind view to VM

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const heroesSettings: HeroesSettings = heroesJson;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const buildingSettings: BuildingsSettings = buildingsJson;
        
        // create building based on settings
        buildingSettings.buildings.forEach(building => 
        {
            // match setting and map building
            const match = this.buildings.find(i => i.id == building.id);
            if(match != null)
            {
                // create model with settings data
                const buildingModel = new BuildingModel(building, heroesSettings);
                const buildingVM    = new BuildingViewModel(buildingModel, playerModel);
                
                // bind building view and vm
                match.building.Bind(buildingVM); 
            }
        });
    }
}

class PlayerModel 
{
    public Currency: BehaviorSubject<number>;
    // TODO: current heroes
    // TODO: current buildings

    constructor(currency: number) {
        this.Currency = new BehaviorSubject<number>(currency);
      }
}

class CurrencyViewModel 
{
    public CurrencyObs  : Observable<number>;

    constructor(model:PlayerModel)
    {
        this.CurrencyObs = model.Currency.asObservable();
    }
}

class BuildingModel
{
    public BuildingSettings:        BehaviorSubject<BuildingSettings>;
    public AvaiableHeroesSettings:  BehaviorSubject<HeroesSettings>;
    
    constructor(buildingSettings: BuildingSettings, heroesSettings:HeroesSettings)
    {
        this.BuildingSettings       = new BehaviorSubject<BuildingSettings>(buildingSettings);
        this.AvaiableHeroesSettings = new BehaviorSubject<HeroesSettings>(heroesSettings);
    }
}

export class BuildingViewModel
{
    public BuildingsObs:     Observable<BuildingSettings>;
    public AvaiableHerosObs: Observable<HeroesSettings>;

    playerModel: PlayerModel;

    constructor(buildingModel: BuildingModel, playerModel:PlayerModel)
    {
        this.playerModel      = playerModel;
        this.BuildingsObs     = buildingModel.BuildingSettings.asObservable();
        this.AvaiableHerosObs = buildingModel.AvaiableHeroesSettings.asObservable();
    }

    public ValidateHireCost(cost:number): boolean
    {
        return this.playerModel.Currency.getValue() >= cost;
    }
}