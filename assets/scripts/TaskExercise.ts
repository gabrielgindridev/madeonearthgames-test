import { _decorator, Component } from 'cc';
import { CurrencyView } from './views/CurrencyView';
import { BuildingsSettings, HeroesSettings, MapBuildings } from './settings/Settings';
import buildingsJson from '../settings/buildings.json';
import heroesJson from '../settings/heroes.json';
import { BuildingViewModel } from './viewModels/BuildingViewModel';
import { CurrencyViewModel } from './viewModels/CurrencyViewModel';
import { PlayerModel } from './models/PlayerModel';
import { BuildingModel } from './models/BuildingModel';
import { SignpostView } from './views/SignpostView';
import { SignpostViewModel } from './viewModels/SignpostViewModel';

const { ccclass, property } = _decorator;

@ccclass('TaskExercise')
export class TaskExercise extends Component 
{
    @property({ type: CurrencyView })   public currencyView!:   CurrencyView;
    @property({ type: SignpostView })   public signpostView!:   SignpostView;
    @property([MapBuildings])           public buildings:       MapBuildings[] = [];

    start() 
    {
        const playerModel = new PlayerModel(999999999);         // create player model and inject placeholder data
        const currencyVM  = new CurrencyViewModel(playerModel); // create currency VM and inject model
        this.currencyView.Bind(currencyVM.CurrencyObs);         // bind view to VM

        const signpostVM  = new SignpostViewModel(playerModel); // create signpost VM and inject model
        this.signpostView.Bind(signpostVM);                     // bind

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