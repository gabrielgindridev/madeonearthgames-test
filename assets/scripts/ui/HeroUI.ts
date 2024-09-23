import { _decorator, Component, ProgressBar, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HeroToSprite') 
export class HeroToSprite 
{
    @property public Id = '';
    @property({ type: SpriteFrame }) public Sprite!:SpriteFrame;
}

@ccclass('HeroUI')
export class HeroUI extends Component 
{
    @property({ type: Sprite })         public hero!:       Sprite;
    @property({ type: Sprite })         public rank!:       Sprite;
    @property({ type: Sprite })         public element!:    Sprite;
    @property({ type: Sprite })         public highlight!:  Sprite;
    @property({ type: ProgressBar })    public bar!:        ProgressBar;

    @property([HeroToSprite]) public HeroSprites: HeroToSprite[]      = [];
    @property([HeroToSprite]) public RankSprites: HeroToSprite[]      = [];
    @property([HeroToSprite]) public ElementSprites: HeroToSprite[]   = [];

    public Initialize(hero:string, rank:string, element:string, bar?:boolean) 
    {
        this.hero.spriteFrame       = this.HeroSprites.find(info => info.Id == hero)!.Sprite;
        this.rank.spriteFrame       = this.RankSprites.find(info => info.Id == rank)!.Sprite;
        this.element.spriteFrame    = this.ElementSprites.find(info => info.Id == element)!.Sprite;
        if(bar) this.bar.progress   = 1;
    }

    public Reset()
    {
        this.hero.spriteFrame       = null;
        this.rank.spriteFrame       = null;
        this.element.spriteFrame    = null;
        if(this.bar != null) this.bar.progress = 0;
    }
}