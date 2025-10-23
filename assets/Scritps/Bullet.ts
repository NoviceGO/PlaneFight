import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    @property
    speed:number = 500;
    
    start() {

    }

    update(deltaTime: number) {
        const pos = this.node.getPosition();
        //deltaTime 是两帧之间的时间间隔
        this.node.setPosition(pos.x, pos.y + this.speed * deltaTime, pos.z);

        //判断子弹是否超出屏幕上方，超出则销毁
        if(pos.y > 440){
            this.node.destroy();
        }

    }
}


