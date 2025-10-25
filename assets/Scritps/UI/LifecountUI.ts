import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LifecountUI')
export class LifecountUI extends Component {

    @property(Label)
    lifeCount:Label = null;

    // 处理炸弹数量变化 
    onLifeChange(num: number) {
        this.lifeCount.string = num.toString();
    }

}


