import { _decorator, Animation, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {

    @property
    speed: number = 300;
    @property(Animation)
    animation: Animation | null = null;

    start() {
        // this.animation.play();
    }

    update(deltaTime: number) {
        const p = this.node.getPosition();
        this.node.setPosition(p.x, p.y - this.speed * deltaTime, p.z);

        //判断敌机是否超出屏幕下方，超出则销毁
        if(p.y < -500){
            this.node.destroy();
        }
    }
}


