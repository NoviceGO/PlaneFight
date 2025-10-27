import { _decorator, Component } from 'cc';
import { ObjectPoolManager } from './ObjectPoolManager';
const { ccclass } = _decorator;

@ccclass('PoolableObject')
export class PoolableObject extends Component {
    
    protected poolName: string = '';

    /**
     * 设置对象所属的对象池名称
     */
    setPoolName(poolName: string): void {
        this.poolName = poolName;
    }

    /**
     * 当对象被回收到对象池时调用
     */
    unuse(): void {
        // 重置节点状态
        this.node.active = false;
        this.node.setPosition(0, 0, 0);
        this.node.setScale(1, 1, 1);
        this.node.angle = 0;
        
        console.log(`对象 ${this.node.name} 被回收`);
    }

    /**
     * 当对象从对象池中取出复用时调用
     */
    reuse(): void {
        // 激活节点
        this.node.active = true;
        console.log(`对象 ${this.node.name} 被复用`);
    }

    /**
     * 回收自己到对象池
     */
    recycle(): void {
        if (this.poolName) {
            ObjectPoolManager.instance.put(this.poolName, this.node);
        } else {
            this.node.destroy();
        }
    }

    /**
     * 延迟回收
     * @param delay 延迟时间（秒）
     */
    recycleDelayed(delay: number): void {
        this.scheduleOnce(() => {
            this.recycle();
        }, delay);
    }
}