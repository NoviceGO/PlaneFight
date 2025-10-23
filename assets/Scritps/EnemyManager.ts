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

    start() {
        this.schedule(() => this.getEnemyPrefab(this.enemy0), this.enemy0SpawnRate);
        this.schedule(() => this.getEnemyPrefab(this.enemy1), this.enemy1SpawnRate);
        this.schedule(() => this.getEnemyPrefab(this.enemy2), this.enemy2SpawnRate);
    }

    update(deltaTime: number) {
        
    }

    protected onDestroy(): void {
        this.unschedule(() => this.getEnemyPrefab(this.enemy0));
        this.unschedule(() => this.getEnemyPrefab(this.enemy1));
        this.unschedule(() => this.getEnemyPrefab(this.enemy2));
    }

    getEnemyPrefab(enemy:Prefab) {
        const enemyPrefab = instantiate(enemy);
        this.node.addChild(enemyPrefab);
        //设置敌机初始位置
        let posX: number;
        switch(enemy){
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
            default:
                console.log("没有该类型敌机");
                break;
        }
        
    }

}


