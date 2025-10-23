import { _decorator, Component, Enum, EventTouch, Input, input, instantiate, Node, Prefab, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

enum ShootType{
    SHOOT_ONE = 1, //单发
    SHOOT_TWO = 2, //双发
}

@ccclass('Player')
export class Player extends Component {
    @property
    shootRate:number = 0.5; //子弹发射频率，单位秒
    @property(Node)
    bulletParent: Node | null = null; //子弹的父节点

    @property(Prefab)
    bullet1Prefab: Node | null = null; //子弹预制体
    @property(Prefab)
    bullet2Prefab: Node | null = null; //子弹预制体

    //单发子弹发射位置节点
    @property(Node)
    bullet1Position: Node | null = null; 

    //双发子弹发射位置节点
    @property(Node)
    bullet2_1Position: Node | null = null;
    @property(Node)
    bullet2_2Position: Node | null = null;

    @property({ type: Enum(ShootType) })
    shootType:ShootType = ShootType.SHOOT_ONE; //默认单发



    private shootTimer:number = 0; //发射计时器
   



    protected onLoad(): void {
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }
    
    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    onTouchMove(event: EventTouch) {
        const p = this.node.getPosition();
        //获取触摸移动的距离，event.getDelta() 返回的是一个 Vec2 对象，作用是获取触摸点相对于上一个触摸点的位移
        let targetPos = new Vec3(p.x + event.getDeltaX(), p.y + event.getDeltaY(), p.z);
        
        //限制玩家的移动范围
        if(targetPos.x <-240){
            targetPos.x = -240;
        }
        if(targetPos.x >240){
            targetPos.x = 240;
        }
        if(targetPos.y < -380){
            targetPos.y = -380;
        }
        if(targetPos.y > 380){
            targetPos.y = 380;
        }
        this.node.setPosition(targetPos);
    }

    protected update(dt: number): void {
        switch(this.shootType){
            case ShootType.SHOOT_ONE:
                this.oneShoot(dt);
                break;
            case ShootType.SHOOT_TWO:
                this.twoShoot(dt);
                break;
        }
    }

    

    oneShoot(dt:number){
        this.shootTimer += dt; //累加时间
        if (this.shootTimer >= this.shootRate) {   //达到发射频率   
            this.shootTimer = 0; //重置计时器
            const bullet1 = instantiate(this.bullet1Prefab); //实例化子弹, 相当于克隆预制体中的子弹 
            this.bulletParent.addChild(bullet1); //将子弹添加到父节点下
            //设置子弹位置为发射位置,使用世界坐标,避免层级关系带来的位置偏移, 否则子弹位置会有偏差
            bullet1.setWorldPosition(this.bullet1Position.getWorldPosition());
        }
    }

    twoShoot(dt: number) {
        this.shootTimer += dt; //累加时间
        if(this.shootTimer >= this.shootRate){   //达到发射频率
            this.shootTimer = 0; //重置计时器
            const bullet1 = instantiate(this.bullet1Prefab);
            const bullet2 = instantiate(this.bullet2Prefab);
            this.bulletParent.addChild(bullet1);
            this.bulletParent.addChild(bullet2);
            // //设置子弹位置为发射位置,使用世界坐标,避免层级关系带来的位置偏移, 否则子弹位置会有偏差
            bullet1.setWorldPosition(this.bullet2_1Position.getWorldPosition());
            bullet2.setWorldPosition(this.bullet2_2Position.getWorldPosition());
        }


    }
} 


