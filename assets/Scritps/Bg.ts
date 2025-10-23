import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bg')
export class Bg extends Component {

    @property(Node)
    bg1: Node | null = null;
    @property(Node)
    bg2: Node | null = null;
    @property
    speed:number = 20;

    start() {

    }

    update(deltaTime: number) {
        //1.移动背景
        let position1 = this.bg1.getPosition();
        let position2 = this.bg2.getPosition();
        position1.y -= this.speed * deltaTime;
        position2.y -= this.speed * deltaTime;
        this.bg1.setPosition(position1);
        this.bg2.setPosition(position2);
        //2.判断背景位置,实现无缝衔接,就是UI拼接
        if(position1.y <= -852){
            this.bg1.setPosition(position1.x,position2.y+852,position1.z);
        }
        if(position2.y <= -852){
            this.bg2.setPosition(position2.x,position1.y+852,position2.z);
        }
    }
}


