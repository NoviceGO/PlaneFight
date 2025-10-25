import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScoreUI')
export class ScoreUI extends Component {
    @property(Label)
    scoreTotal:Label = null;

    // 处理炸弹数量变化 
    onScoreChange(num: number) {
        this.scoreTotal.string = num.toString();
    }
}


