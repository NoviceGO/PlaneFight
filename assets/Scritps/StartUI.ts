import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Status')
export class Status extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    public onStartButtonClicked() {
        console.log("点击开始按钮！！！");
        // Add your logic to start the game here
        director.loadScene("002-GameScene");
    }
}

