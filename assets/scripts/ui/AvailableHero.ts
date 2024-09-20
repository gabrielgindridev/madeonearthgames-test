import { _decorator, Component, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HeroToSprite') 
export class HeroToSprite 
{
    @property public Id = '';
    @property({ type: SpriteFrame }) public Sprite!:SpriteFrame;
}

@ccclass('AvailableHero')
export class AvailableHero extends Component {
    @property({ type: Sprite }) public hero!:       Sprite;
    @property({ type: Sprite }) public rank!:       Sprite;
    @property({ type: Sprite }) public element!:    Sprite;
    @property({ type: Sprite }) public highlight!:  Sprite;

    @property([HeroToSprite]) public HeroSprites: HeroToSprite[]      = [];
    @property([HeroToSprite]) public RankSprites: HeroToSprite[]      = [];
    @property([HeroToSprite]) public ElementSprites: HeroToSprite[]   = [];

    public Initialize(hero:string, rank:string, element:string) 
    {
        this.hero.spriteFrame       = this.HeroSprites.find(info => info.Id == hero)!.Sprite;
        this.rank.spriteFrame       = this.RankSprites.find(info => info.Id == rank)!.Sprite;
        this.element.spriteFrame    = this.ElementSprites.find(info => info.Id == element)!.Sprite;
    } 
}