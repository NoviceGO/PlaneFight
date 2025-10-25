import { _decorator, Animation, AudioClip, Collider2D, Component, Contact2DType, Enum, EventTouch, Input, input, instantiate, Node, Prefab, Sprite, Vec3 } from 'cc';
import { Reward, RewardType } from './Reward';
import { GameManager } from './GameManager';
import { LifecountUI } from './UI/LifecountUI';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

enum ShootType{
    SHOOT_ONE = 1, //单发
    SHOOT_TWO = 2, //双发
    None = 3 //无发射
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
    

    @property
    lifeCount:number = 3;
    @property
    invincibleTime:number = 2; //无敌时间，单位秒

    @property
    twoShootDuration:number = 5; //双发持续时间，单位秒
    twoShootTimer:number = 0; //双发计时器

    isInvincible:boolean = false; //是否处于无敌状态
    invincibleTimer:number = 0; //无敌计时器

    @property(Animation)
    animation: Animation | null = null;
    @property
    animationHit: string = '';
    @property
    animationDown: string = '';
    @property(LifecountUI)
    lifeCountUI:LifecountUI = null;
    @property(AudioClip)
    bulletAudio:AudioClip = null;
    @property(AudioClip)
    getBombAudio:AudioClip = null;
    @property(AudioClip)
    getTwoShootAudio:AudioClip = null;


    collider:Collider2D = null;
    private shootTimer:number = 0; //发射计时器
    lastReward:Reward = null;
    private _isPause: boolean = false;

    public get isPause(): boolean {
        return this._isPause;
    }

    public set isPause(value: boolean) {
        this._isPause = value;
    }

    protected onLoad(): void {
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);

        this.collider = this.node.getChildByName("Body").getComponent(Collider2D);   
        // 监听碰撞事件
        if(this.collider){
            this.collider.on(Contact2DType.BEGIN_CONTACT,this.onBeginContact, this);
        }
        this.lifeCountUI.onLifeChange(this.lifeCount);
                

    }
    onBeginContact( selfCollider: Collider2D, otherCollider: Collider2D, contact?: any ) {
        
        const reward = otherCollider.getComponent(Reward);
        if(reward){
            this.onContactToReward(reward);
        }else{
            this.onContactToEnemy();
        }
        
    }

    //单独处理血量，可以添加回血包等道具
    onChangeLife(number:number){
        this.lifeCount += number;
        this.lifeCountUI.onLifeChange(this.lifeCount);
    }
  
    onContactToEnemy(){
        if(this.isInvincible) return; //处于无敌状态，忽略碰撞
        this.isInvincible = true;
        this.invincibleTimer = 0; //重置计时器
        // 处理碰撞逻辑
        this.onChangeLife(-1);
        
        if(this.lifeCount>0){
            this.animation.play(this.animationHit);
           
        }else{
            this.shootType = ShootType.None; //停止发射
            this.animation.play(this.animationDown);
            this.scheduleOnce(()=>{
                GameManager.getInstance().gameOver();
            },0.4);
            // 播放完爆炸动画后销毁敌机节点
            if(this.collider) this.collider.enabled = false; // 禁用碰撞体，防止重复碰撞
        }
    }
    onContactToReward(reward:Reward){
        if(this.lastReward === reward) return; //已经处理过该奖励，忽略
        this.lastReward = reward;
        // 碰撞到奖励
        switch(reward.rewardType){
            case 0:
                AudioMgr.inst.play(this.getTwoShootAudio,1);
                this.transitionToTwoShoot();
                break;
            case 1:
                AudioMgr.inst.play(this.getBombAudio,1);
                GameManager.getInstance().addBomb();
                break;
        }

        reward.getComponent(Collider2D).enabled = false; // 禁用碰撞体，防止重复碰撞
        reward.getComponent(Sprite).enabled = false; // 隐藏奖励
    }


    transitionToOneShoot(){
        //切换为单发模式
        this.shootType = ShootType.SHOOT_ONE;
    }
    transitionToTwoShoot(){
        //切换为双发模式
        this.shootType = ShootType.SHOOT_TWO;
        this.twoShootTimer = 0; //重置计时器
    }
    transitionToBomb(){}

    
    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
         if(this.collider){
            this.collider.off(Contact2DType.BEGIN_CONTACT,this.onBeginContact, this);
        }
    }

    onTouchMove(event: EventTouch) {
        if(this.lifeCount <= 0 || this.isPause) return; // 玩家已死亡，禁止移动,
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

        //无敌计时
        if(this.isInvincible){
            this.collider.enabled = false; //禁用碰撞体
            this.invincibleTimer += dt; //累加时间
            if(this.invincibleTimer >= this.invincibleTime){
                this.isInvincible = false; //结束无敌状态
                this.collider.enabled = true; //禁用碰撞体
            }
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
            AudioMgr.inst.play(this.bulletAudio,0.7);
        }
    }

    twoShoot(dt: number) {
        
        this.twoShootTimer += dt; //累加时间
        if(this.twoShootTimer >= this.twoShootDuration){
            //双发时间到，切换回单发 
            this.transitionToOneShoot();
            return
        }
        
        //以下是子弹发射间隔逻辑
        this.shootTimer += dt; //累加时间
        if(this.shootTimer >= this.shootRate){   //达到发射频率
            this.shootTimer = 0; //重置计时器
            const bullet1 = instantiate(this.bullet2Prefab);
            const bullet2 = instantiate(this.bullet2Prefab);
            this.bulletParent.addChild(bullet1);
            this.bulletParent.addChild(bullet2);
            // //设置子弹位置为发射位置,使用世界坐标,避免层级关系带来的位置偏移, 否则子弹位置会有偏差
            bullet1.setWorldPosition(this.bullet2_1Position.getWorldPosition());
            bullet2.setWorldPosition(this.bullet2_2Position.getWorldPosition());
            AudioMgr.inst.play(this.bulletAudio,0.7);
        }


    }
} 


