export class Machine {
    public stockLevel = 10;
    public id: string;

    public stockWarningFired = false;
    public stockLevelOkFired = true;

    constructor(id: string) {
        this.id = id;
    }
}
