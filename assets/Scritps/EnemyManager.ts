import { _decorator, Component, instantiate, math, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EnemyManager')
export class EnemyManager extends Component {
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

    start() {
        this.schedule(() => this.getEnemyPrefab(this.enemy0), this.enemy0SpawnRate);
        this.schedule(() => this.getEnemyPrefab(this.enemy1), this.enemy1SpawnRate);
        this.schedule(() => this.getEnemyPrefab(this.enemy2), this.enemy2SpawnRate);
        this.schedule(() => this.getEnemyPrefab("reward"), this.rewardSpawnRate);
    }

    update(deltaTime: number) {
        
    }

    protected onDestroy(): void {
        this.unschedule(() => this.getEnemyPrefab(this.enemy0));
        this.unschedule(() => this.getEnemyPrefab(this.enemy1));
        this.unschedule(() => this.getEnemyPrefab(this.enemy2));
        this.unschedule(() => this.getEnemyPrefab("reward"));
    }

    getEnemyPrefab(enemy:Prefab| string) {
        let prefabToSpawn: Prefab | null = null;
        // 如果是奖励，则随机选择一种奖励生成,否则生成对应的敌机 
        if (enemy === "reward") {
            if (this.reward1 == null && this.reward2 == null) {
                console.log("没有奖励可用");
                return;
            }
            // 随机选择奖励类型
            prefabToSpawn = (math.random() < 0.5) ? (this.reward1 ?? this.reward2) : (this.reward2 ?? this.reward1);
        } else {
            prefabToSpawn = enemy as Prefab;
        }
    
        if (!prefabToSpawn) {
            console.log("没有该类型敌机或奖励或 prefab 为 null");
            return;
        }
    
        const enemyPrefab = instantiate(prefabToSpawn);
        //设置敌机初始位置
        let posX: number;
        switch(prefabToSpawn){
            case this.enemy0:
                posX = math.randomRangeInt(-215,215);
                enemyPrefab.setPosition(posX,450,0);
                break;
            case this.enemy1:
                posX = math.randomRangeInt(-205,203);
                enemyPrefab.setPosition(posX,470,0);
                break;
            case this.enemy2:
                posX = math.randomRangeInt(-158,156);
                enemyPrefab.setPosition(posX,550,0);
                break;
            case this.reward1:
            case this.reward2:
                posX = math.randomRangeInt(-207,207);
                enemyPrefab.setPosition(posX,477,0);
                break;
            default:
                break;
        }
        this.node.addChild(enemyPrefab);
    }

}


