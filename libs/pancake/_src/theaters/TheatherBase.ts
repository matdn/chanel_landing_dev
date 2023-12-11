export class TheaterBase {

    protected _theaterId: string;
    protected _placcementId: number;
    protected _viewsList = new Set<string>();
    protected _siblingViewsList = new Set<string>();

    constructor(theaterId: string, placementId: number) {
        this._theaterId = theaterId;
        this._placcementId = placementId;
    }

    public init(): void {
        // 
    }

    public reset(): void {
        // 
    }

    //#region getter/setter
    public get theaterId(): string { return this._theaterId; }
    public get placementId(): number { return this._placcementId; }
    public get viewsList(): Set<string> { return this._viewsList; }
    public get siblingViewsList(): Set<string> { return this._siblingViewsList; }
    //#endregion

}