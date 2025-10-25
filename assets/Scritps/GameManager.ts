import { _decorator, AudioClip, Component, director, Node} from 'cc';
import { BombUI } from './UI/BombUI';
import { ScoreUI } from './UI/ScoreUI';
import { Player } from './Player';
import { GameOverUI } from './UI/GameOverUI';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    //单例模式
    private static instance: GameManager;

    @property
    private bombNumber: number = 0; //炸弹数量
    @property(BombUI)
    private bombUI: BombUI = null;
    @property(ScoreUI)
    private scoreUI:ScoreUI = null;
    @property
    private score:number = 0;
    @property(Player)
    private player:Player = null;
    @property(Node)
    private pause:Node = null;
    @property(Node)
    private resume:Node = null;
    @property(GameOverUI)
    private gameOverUI:GameOverUI = null;
    @property(AudioClip)
    buttonMusic:AudioClip = null;
    @property(AudioClip)
    gameMusic:AudioClip = null;
    @property(AudioClip)
    gameOverMusic:AudioClip = null;

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

    protected start(): void {
        AudioMgr.inst.play(this.gameMusic,0.15,true);
    }

    public getBombNumber(): number {
        return this.bombNumber;
    }

    public addScoreTotal(num:number):void{
        this.score += num;
        this.scoreUI.onScoreChange(this.score);
    }

    public onPause():void{
        //时间帧暂停
        
        director.pause();
        AudioMgr.inst.play(this.buttonMusic,1);
        AudioMgr.inst.pause();;
        this.player.isPause = true;
        this.pause.active = false;
        this.resume.active = true;
    }

    public onResume():void{
        
        director.resume();
        AudioMgr.inst.resume();
        AudioMgr.inst.play(this.buttonMusic,1);
        this.player.isPause = false;
        this.pause.active = true;
        this.resume.active = false;
    }

    public gameOver():void{
        this.onPause();
        AudioMgr.inst.play(this.gameOverMusic,1);
        let hScore = localStorage.getItem("HighestScore");
        let hScoreInt = 0;

        if(hScore!=null) hScoreInt = parseInt(hScore,10);

        if(this.score > hScoreInt) localStorage.setItem("HighestScore",this.score.toString());

        //显示gameover ui 更新分数 
        this.gameOverUI.showGameOverUI(hScoreInt,this.score);
    }

    public onRestart():void{
        AudioMgr.inst.play(this.buttonMusic,1);
        director.loadScene(director.getScene().name);
        this.onResume();
    }

    public isHaveBomb():boolean{
        return this.bombNumber>0;
    }

    public onQuit():void{

    }

}


