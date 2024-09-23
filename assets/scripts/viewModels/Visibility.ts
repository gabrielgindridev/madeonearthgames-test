import { BehaviorSubject } from "rxjs";

export class Visibility
{
    public Visible: BehaviorSubject<boolean>;

    constructor()
    {
        this.Visible = new BehaviorSubject<boolean>(false);
    }
}