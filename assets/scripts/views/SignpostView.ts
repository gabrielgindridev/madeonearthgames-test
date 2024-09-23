import { _decorator, Button, Component, instantiate, Label, Node, Prefab } from 'cc';
import { SignpostViewModel } from '../viewModels/SignpostViewModel';
import { HeroInfoUI } from '../ui/HeroInfoUI';
const { ccclass, property } = _decorator;

@ccclass('SignpostView')
export class SignpostView extends Component 
{
    @property({type: Node})     openInfo!:              Node;
    @property({type: Button})   closeInfo!:             Button;
    @property({type: Node})     infoContainer!:         Node;
    @property({type: Node})     counterLabelContainer!: Node;
    @property({type: Label})    counterLabel!:          Label;
    @property({type: Node})     infoParent!:            Node;
    @property({type: Prefab})   infoPrefab!:            Prefab;

    infos: HeroInfoUI[] = [];

    protected start(): void 
    {
        this.counterLabelContainer.active = false;
        this.infoContainer.active         = false;
    }

    public Bind(signpostVM: SignpostViewModel)
    {
        // visibility update
        this.openInfo.on(Node.EventType.MOUSE_DOWN, () => { signpostVM.Visibility.Visible.next(true); this.infoContainer.active = true; }, this);
        this.closeInfo.node.on(Button.EventType.CLICK, () => { signpostVM.Visibility.Visible.next(false); this.infoContainer.active = false; }, this);

        signpostVM.HeroesObs.subscribe(heroes => 
        {
            // update counter acording the number of heroes
            this.counterLabelContainer.active = true;
            this.counterLabel.string          = heroes.length.toString();
            
            // update heroes info list as they get added
            heroes.slice(this.infos.length - heroes.length).forEach(h => {
                const infoInstance = instantiate(this.infoPrefab);
                infoInstance.parent = this.infoParent;
                const infoUI = infoInstance.getComponent(HeroInfoUI);
                infoUI!.Initialize(h.id, h.name, h.description, h.rank, h.type, h.cost, h.summonCooldown);
                this.infos.push(infoUI!);
            });
        });
    }
}