import { _decorator, Component } from 'cc';
import { CurrencyView } from './views/CurrencyView';
import { BehaviorSubject, Observable } from 'rxjs';
import { BuildingsSettings, MapBuildings } from './settings/Settings';
import buildingsJson from '../settings/buildings.json';

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
        const buildingSettings: BuildingsSettings = buildingsJson;
        
        // create building based on settings
        buildingSettings.buildings.forEach(building => 
        {
            // match setting and map building
            const match = this.buildings.find(i => i.id == building.id);
            if(match != null)
            {
                // create model with settings data
                const buildingModel = new BuildingModel(building.id, building.name, building.description, building.cost, building.hireSlots);
                
                // bind building view and vm
                match.building.Bind(buildingModel.Name, buildingModel.Description); 
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
    public Id:          string;
    public Name:        string;
    public Description: string;
    public Cost:        number;
    public HireSlots:   number;

    constructor(id:string, name:string, desc:string, cost:number, hireSlots:number)
    {
        this.Id             = id;
        this.Name           = name;
        this.Description    = desc;
        this.Cost           = cost;
        this.HireSlots      = hireSlots;
    }
}