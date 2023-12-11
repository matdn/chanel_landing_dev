type FuncType<TArgs extends any[], TResult> = (...args: TArgs) => TResult;
type ActionType<TArgs extends any[]> = FuncType<TArgs, any>;


export class Action<T extends any[]>{

    private _funcList = new Array<ActionType<T>>();
    private _num: number = 0;

    public add(func: ActionType<T>): void {
        const index = this._funcList.indexOf(func);
        if (index < 0) {
            this._funcList.push(func);
        }
        this._num = this._funcList.length;

    }

    public remove(func: ActionType<T>): void {
        const index = this._funcList.indexOf(func);
        if (index > -1) {
            this._funcList.splice(index, 1);
        }
        this._num = this._funcList.length;
    }

    public execute(...args: T): void {
        for (let i = this._num - 1; i >= 0; i--) {
            this._funcList[i](...args);
        }
    }

}