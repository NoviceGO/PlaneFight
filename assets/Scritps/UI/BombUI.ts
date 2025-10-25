import { _decorator, Component, Label } from 'cc';
import { GameManager } from '../GameManager';
const { ccclass, property } = _decorator;

@ccclass('BombUI')
export class BombUI extends Component {

    @property(Label)
    bombNumber:Label = null;

    // 处理炸弹数量变化 
    onBombChange(num: number) {
        this.bombNumber.string = num.toString();
    }
}


