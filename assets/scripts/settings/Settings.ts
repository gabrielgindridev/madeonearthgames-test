import { _decorator } from 'cc';
import { BuildingView } from '../views/BuildingView';
const { ccclass, property } = _decorator;

@ccclass('MapBuildings')
export class MapBuildings {
    @property
    id = '';
    @property({ type: BuildingView }) public building!: BuildingView;
}

@ccclass('BuildingsSettings')
export class BuildingsSettings 
{
    public buildings: BuildingSettings[] = [];
}

@ccclass('BuildingSettings')
export class BuildingSettings 
{
    @property public id            = '';
    @property public name          = '';
    @property public description   = '';
    @property public cost          = 0;
    @property public hireSlots     = 0;
}

@ccclass('HeroesSettings')
export class HeroesSettings 
{
    public heroes: Hero[] = [];
}

@ccclass('HeroSettings') 
export class Hero 
{
    @property public id             = '';
    @property public name           = '';
    @property public description    = '';
    @property public cost           = 0;
    @property public summonCooldown = 0;
    @property public type           = '';
    @property public rank           = '';
}