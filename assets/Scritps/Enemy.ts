import { _decorator, Animation, AudioClip, Collider2D, Component, Contact2DType, Node, Sprite } from 'cc';
import { GameManager } from './GameManager';
import { EnemyManager } from './EnemyManager';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {

    @property
    speed: number = 300;
    @property(Animation)
    animation: Animation | null = null;

    @property
    hp:number = 1;

    @property
    animationHit: string = '';
    @property
    animationDown: string = '';
    @property
    score:number = 10;

    haveDead:boolean = false;
    collider:Collider2D = null;
    @property(AudioClip)
    enemyAudio:AudioClip = null;

    start() {
        // this.animation.play();
        // 这里可以添加敌机出生时的逻辑,例如播放出生动画等
        this.collider = this.getComponent(Collider2D);
        // 监听碰撞事件
        if(this.collider){
            this.collider.on(Contact2DType.BEGIN_CONTACT,this.onBeginContact, this);
        }
            
    }

    onBeginContact( selfCollider: Collider2D, otherCollider: Collider2D, contact?: any ) {
        // 处理碰撞逻辑
        this.hp -= 1;
        
        if(otherCollider.getComponent('Bullet')){
            // 碰撞到子弹
            otherCollider.enabled = false; // 禁用碰撞体，防止重复碰撞
            otherCollider.getComponent(Sprite).enabled = false; // 隐藏子弹
            //  otherCollider.node.destroy(); // 销毁子弹节点
        }

        if(this.hp>0){
            this.animation.play(this.animationHit);
        }else{
            this.dead();
        }
    }

    update(deltaTime: number) {
        if(this.hp > 0) { 
            const p = this.node.getPosition();
            this.node.setPosition(p.x, p.y - this.speed * deltaTime, p.z);
        }

        //判断敌机是否超出屏幕下方，超出则销毁
        if(this.node.position.y < -520){
            this.node.destroy();
        }
    }

    protected onDestroy(): void {
        // 移除碰撞事件监听
        if(this.collider){
            this.collider.off(Contact2DType.BEGIN_CONTACT,this.onBeginContact, this);
        }
        EnemyManager.getInstance().removeEnemy(this.node);
    }

    dead():void{
        if(this.haveDead) return;
        this.animation.play(this.animationDown);
        // 播放完爆炸动画后销毁敌机节点
        if(this.collider) this.collider.enabled = false; // 禁用碰撞体，防止重复碰撞
        this.scheduleOnce(()=>{
            this.node.destroy();
        }, 1); // 等待动画播放完毕后销毁节点
        AudioMgr.inst.play(this.enemyAudio,0.8);
        GameManager.getInstance().addScoreTotal(this.score);
        this.haveDead = true;
    }

    killNow():void{
        if(this.hp<=0) return;
        this.dead();

    }
}


