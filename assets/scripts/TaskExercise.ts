import { _decorator, Component } from 'cc';
import { CurrencyView } from './views/CurrencyView';
import { BuildingsSettings, HeroesSettings, MapBuildings, PlayerSettings } from './settings/Settings';
import buildingsJson from '../settings/buildings.json';
import heroesJson from '../settings/heroes.json';
import playerJson from '../settings/initial_state.json';
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
    // views...
    @property({ type: CurrencyView })   public currencyView!:   CurrencyView;
    @property({ type: SignpostView })   public signpostView!:   SignpostView;
    @property([MapBuildings])           public buildings:       MapBuildings[] = [];

    start() 
    {
        // settings
        const playerSettings:   PlayerSettings      = playerJson;
        const heroesSettings:   HeroesSettings      = heroesJson;
        const buildingSettings: BuildingsSettings   = buildingsJson;

        const playerModel = new PlayerModel(playerSettings);    // create player model and inject settings
        const currencyVM  = new CurrencyViewModel(playerModel); // create currency VM and inject model
        this.currencyView.Bind(currencyVM.CurrencyObs);         // "bind" view to VM

        const signpostVM  = new SignpostViewModel(playerModel); // create signpost VM and inject model
        this.signpostView.Bind(signpostVM);                     // bind...
        
        // create building based on settings
        buildingSettings.buildings.forEach(building => 
        {
            // match settings with map building and player settings
            const match = this.buildings.find(i => i.id == building.id && playerSettings.state.buildings.find(b => b == i.id) != null);
            if(match != null)
            {
                // create model with settings data
                const buildingModel = new BuildingModel(building, heroesSettings);
                const buildingVM    = new BuildingViewModel(buildingModel, playerModel);
                
                // acting as mediator between VMs
                signpostVM.Visibility.Visible.asObservable().subscribe(v => { if(v) buildingVM.Visibility.Visible.next(false)}); 
                
                // bind building view and vm
                match.building.Bind(buildingVM); 
            }
        });
    }
}