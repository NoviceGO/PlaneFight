import { _decorator, Component, Enum, Node } from 'cc';
const { ccclass, property } = _decorator;
export enum RewardType{
    TwoShoot=0,
    Bomb=1
}

@ccclass('Reward')
export class Reward extends Component {

    
    @property
    speed: number = 120;

    @property({ type: Enum(RewardType) })
    rewardType:RewardType = RewardType.TwoShoot;

    start() {

    }

    update(deltaTime: number) {
        const p = this.node.getPosition();
        this.node.setPosition(p.x, p.y - this.speed * deltaTime, p.z);

        if(this.node.position.y < -520){
            this.node.destroy();
        }
    }
}


