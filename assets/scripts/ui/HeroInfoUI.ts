import { _decorator, Component, Label } from 'cc';
import { HeroUI } from './HeroUI';
const { ccclass, property } = _decorator;

@ccclass('HeroInfoUI')
export class HeroInfoUI extends Component 
{
    @property({type: Label})    public title!:        Label;
    @property({type: Label})    public description!:  Label;
    @property({type: Label})    public rank!:         Label;
    @property({type: Label})    public type!:         Label;
    @property({type: Label})    public cost!:         Label;
    @property({type: Label})    public time!:         Label;
    @property({ type: HeroUI }) public frame!:        HeroUI;


    public Initialize(hero: string, name:string, description:string, rank:string, type:string, cost:number, time:number) 
    {
        this.frame.Initialize(hero, rank, type);
        this.title.string = name;
        this.description.string = description;
        this.rank.string = "Rank: " + rank;
        this.type.string = "Type: " + type;
        this.cost.string = "Cost: " +cost.toString();
        this.time.string = "Summon Time: " + time.toString() + "s";
    }
}