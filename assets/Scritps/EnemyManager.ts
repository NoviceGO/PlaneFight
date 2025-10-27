import { _decorator, AudioClip, Component, EventTouch, Input, input, instantiate, math, Node, Prefab } from 'cc';
import { GameManager } from './GameManager';
import { Enemy } from './Enemy';
import { AudioMgr } from './AudioMgr';
import { ObjectPoolManager } from './ObjectPoolManager';
import { PoolableObject } from './PoolableObject';
const { ccclass, property } = _decorator;

@ccclass('EnemyManager')
export class EnemyManager extends Component {

    private static instance:EnemyManager = null;
    public static getInstance(): EnemyManager {
        if (!EnemyManager.instance) {
            EnemyManager.instance = new EnemyManager();
        }   
        return EnemyManager.instance;
    }


    @property(Prefab)
    enemy0:Prefab | null = null;
    @property
    enemy0SpawnRate:number = 0.5; //敌机生成频率，单位秒

    @property(Prefab)
    enemy1:Prefab | null = null;
    @property
    enemy1SpawnRate:number = 1; //敌机生成频率，单位秒

    @property(Prefab)
    enemy2:Prefab | null = null;
    @property
    enemy2SpawnRate:number = 3; //敌机生成频率，单位秒

    @property(Prefab)
    reward1:Prefab | null = null;
    @property(Prefab)
    reward2:Prefab | null = null;
    @property
    rewardSpawnRate:number = 3; //奖励生成频率，单位秒
    @property(AudioClip)
    bombMusic:AudioClip = null;
    

    private doubleClickThreshold: number = 0.2;
    private lastClickTime: number = 0;
    @property([Node])
    protected enemyArray:Node[] = [];

    initObjectPools(): void {
        // 注册敌机0对象池
        ObjectPoolManager.instance.registerPool('enemies0', this.enemy0, 10, Enemy);
        // 注册敌机1对象池
        ObjectPoolManager.instance.registerPool('enemies1', this.enemy1, 10, Enemy);
        // 注册敌机2对象池
        ObjectPoolManager.instance.registerPool('enemies2', this.enemy2, 10, Enemy);
        
    }


    protected onLoad(): void {
        this.initObjectPools();
        EnemyManager.instance = this;
        input.on(Input.EventType.TOUCH_END, this.onTouchStart, this);
    }


    private onTouchStart(event: EventTouch) {
        const currentTime = Date.now();
        const timeDiff = (currentTime - this.lastClickTime)/1000; //转换成秒
        if(timeDiff < this.doubleClickThreshold){
            this.onDoubleClick(event);
        }
        this.lastClickTime = currentTime;
    }
    onDoubleClick(event: EventTouch) {
        if(GameManager.getInstance().isHaveBomb()===false) return;
        GameManager.getInstance().addBomb(-1);
        AudioMgr.inst.play(this.bombMusic,1);
        for(let e of this.enemyArray){
            const enemy = e.getComponent(Enemy);
            enemy.killNow();
        }
    }
    removeEnemy(n:Node):void{
        let index = this.enemyArray.indexOf(n);
        if(index !== -1){
            this.enemyArray.splice(index,1);
        }
    }

    start() {
        this.schedule(() => this.getEnemyPrefab('enemies0'), this.enemy0SpawnRate);
        this.schedule(() => this.getEnemyPrefab('enemies1'), this.enemy1SpawnRate);
        this.schedule(() => this.getEnemyPrefab('enemies2'), this.enemy2SpawnRate);
        this.schedule(() => this.getEnemyPrefab("reward"), this.rewardSpawnRate);
    }

    update(deltaTime: number) {
        
    }

    protected onDestroy(): void {
        this.unschedule(() => this.getEnemyPrefab('enemies0'));
        this.unschedule(() => this.getEnemyPrefab('enemies1'));
        this.unschedule(() => this.getEnemyPrefab('enemies2'));
        this.unschedule(() => this.getEnemyPrefab("reward"));
        input.off(Input.EventType.TOUCH_END, this.onTouchStart, this);
    }

    getEnemyPrefab(name:string) {
        let prefabToSpawn: Prefab | null = null;
        // 如果是奖励，则随机选择一种奖励生成,否则生成对应的敌机 
        if (name === "reward") {
            if (this.reward1 == null && this.reward2 == null) {
                console.log("没有奖励可用");
                return;
            }
            // 随机选择奖励类型
            prefabToSpawn = (math.random() < 0.5) ? (this.reward1 ?? this.reward2) : (this.reward2 ?? this.reward1);
        } 
        const enemyPrefab = name === "reward"?instantiate(prefabToSpawn):ObjectPoolManager.instance.get(name);
        if(name!=="reward") {
            const poolable1 = enemyPrefab.getComponent(PoolableObject);
            poolable1.setPoolName(name);
        }
        //设置敌机初始位置
        let posX: number;
        switch(name){
            case 'enemies0':
                posX = math.randomRangeInt(-215,215);
                enemyPrefab.setPosition(posX,450,0);
                this.enemyArray.push(enemyPrefab);
                break;
            case 'enemies1':
                posX = math.randomRangeInt(-205,203);
                enemyPrefab.setPosition(posX,470,0);
                this.enemyArray.push(enemyPrefab);
                break;
            case 'enemies2':
                posX = math.randomRangeInt(-158,156);
                enemyPrefab.setPosition(posX,550,0);
                this.enemyArray.push(enemyPrefab);
                break;
            case 'reward':
                posX = math.randomRangeInt(-207,207);
                enemyPrefab.setPosition(posX,477,0);
                break;
            default:
                break;
        }
        this.node.addChild(enemyPrefab);
    }

}


