import { _decorator, Component, Node, Prefab, instantiate, NodePool, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ObjectPoolManager')
export class ObjectPoolManager extends Component {
    
    private static _instance: ObjectPoolManager = null;
    private _pools: Map<string, NodePool> = new Map();
    private _prefabs: Map<string, Prefab> = new Map();
    
    public static get instance(): ObjectPoolManager {
        return ObjectPoolManager._instance;
    }
    

    onLoad() {
        if (ObjectPoolManager._instance === null) {
            ObjectPoolManager._instance = this;
            // 设置为常驻节点，切换场景时不会被销毁
            director.addPersistRootNode(this.node);
            console.log('对象池管理器初始化完成');
        } else {
            this.node.destroy();
        }
    }

    /**
     * 注册对象池
     * @param poolName 对象池名称
     * @param prefab 预制体
     * @param initialCount 初始数量
     * @param componentType 组件类型（用于处理 reuse/unuse）
     */
    registerPool(
        poolName: string, 
        prefab: Prefab, 
        initialCount: number = 5,
        componentType?: any
    ): void {
        console.log("-**---------------------------");
        if (this._pools.has(poolName)) {
            console.warn(`对象池 ${poolName} 已存在`);
            return;
        }

        const pool = componentType ? new NodePool(componentType) : new NodePool();
        this._prefabs.set(poolName, prefab);
        
        // 预创建对象
        for (let i = 0; i < initialCount; i++) {
            const node = instantiate(prefab);
            pool.put(node);
        }

        this._pools.set(poolName, pool);
        console.log(`对象池 ${poolName} 创建成功，初始数量: ${initialCount}`);
    }

    /**
     * 从对象池获取对象
     * @param poolName 对象池名称
     */
    get(poolName: string): Node | null {
        const pool = this._pools.get(poolName);
        if (!pool) {
            console.error(`对象池 ${poolName} 不存在`);
            return null;
        }

        let node: Node;
        if (pool.size() > 0) {
            node = pool.get();
            console.log(`从对象池 ${poolName} 获取对象，剩余: ${pool.size()}`);
        } else {
            // 池为空，创建新对象
            const prefab = this._prefabs.get(poolName);
            if (prefab) {
                node = instantiate(prefab);
                console.log(`对象池 ${poolName} 为空，创建新对象`);
            } else {
                console.error(`对象池 ${poolName} 为空且未找到prefab`);
                return null;
            }
        }

        return node;
    }

    /**
     * 将对象放回对象池
     * @param poolName 对象池名称
     * @param node 要回收的节点
     */
    put(poolName: string, node: Node): void {
        const pool = this._pools.get(poolName);
        console.log("当前对象池："+poolName);
        if (!pool) {
            console.error(`对象池 ${poolName} 不存在`);
            node.destroy();
            return;
        }

        pool.put(node);
        console.log(`对象回收到 ${poolName}，当前数量: ${pool.size()}`);
    }

    /**
     * 获取对象池当前大小
     * @param poolName 对象池名称
     */
    getPoolSize(poolName: string): number {
        const pool = this._pools.get(poolName);
        return pool ? pool.size() : 0;
    }

    /**
     * 检查对象池是否存在
     * @param poolName 对象池名称
     */
    hasPool(poolName: string): boolean {
        return this._pools.has(poolName);
    }

    /**
     * 清空特定对象池
     * @param poolName 对象池名称
     */
    clearPool(poolName: string): void {
        const pool = this._pools.get(poolName);
        if (pool) {
            pool.clear();
            this._pools.delete(poolName);
            this._prefabs.delete(poolName);
            console.log(`对象池 ${poolName} 已清空`);
        }
    }

    /**
     * 清空所有对象池
     */
    clearAll(): void {
        this._pools.forEach((pool, poolName) => {
            pool.clear();
        });
        this._pools.clear();
        this._prefabs.clear();
        console.log('所有对象池已清空');
    }

    onDestroy() {
        this.clearAll();
        if (ObjectPoolManager._instance === this) {
            ObjectPoolManager._instance = null;
        }
    }
}