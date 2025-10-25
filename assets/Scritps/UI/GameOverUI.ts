import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameOverUI')
export class GameOverUI extends Component {
    @property(Label)
    hightestScore:Label = null;
    @property(Label)
    currentScore:Label = null;

    showGameOverUI(hightest:number,current:number):void{
        this.node.active = true;

        this.hightestScore.string = hightest.toString();
        this.currentScore.string = current.toString();
    }

}


