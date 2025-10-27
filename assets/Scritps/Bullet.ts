import { _decorator, Component, Node } from 'cc';
import { PoolableObject } from './PoolableObject';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends PoolableObject {
    @property
    speed:number = 500;
    
    
    start() {

    }

    update(deltaTime: number) {
        const pos = this.node.getPosition();
        //deltaTime 是两帧之间的时间间隔
        this.node.setPosition(pos.x, pos.y + this.speed * deltaTime, pos.z);

        //判断子弹是否超出屏幕上方，超出则回收
        if(pos.y > 440){
            // this.node.destroy();
            this.recycle();
        }
        
    }

     // 碰撞时回收
    onCollisionEnter(): void {
        console.log("子弹碰撞回收！！！！！！！！！！！！！！！！！！！！");
        this.recycle();
    }
}


