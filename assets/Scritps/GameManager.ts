import { _decorator, Component } from 'cc';
import { BombUI } from './UI/BombUI';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    //单例模式
    private static instance: GameManager;

    @property
    private bombNumber: number = 0; //炸弹数量
    @property(BombUI)
    private bombUI: BombUI = null;

    public static getInstance(): GameManager {
        if (!GameManager.instance) {
            GameManager.instance = new GameManager();
        }   
        return GameManager.instance;
    }

    public  addBomb(count: number = 1): void {
        this.bombNumber += count;
        this.bombUI.onBombChange(this.bombNumber);
    }

    protected onLoad(): void {
        GameManager.instance = this;    // 初始化单例实例
    }

    public getBombNumber(): number {
        return this.bombNumber;
    }

    start() {
        
    }

    update(deltaTime: number) {
        
    }
}


