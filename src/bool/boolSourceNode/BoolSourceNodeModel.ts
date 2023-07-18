import { BoolNodeModel, BoolNodeModelActivFuncs, BoolNodeModelOptions } from "../boolNode/BoolNodeModel";
import { BoolPortModel } from "../boolPort/BoolPortModel";

export interface BoolSourceModelOptions {
    name?: string;
    color?: string;
}
export class BoolSourceNodeModel extends BoolNodeModel {

    constructor(name: string, color: string);
    constructor(options?: BoolSourceModelOptions);
    constructor(nameOrOptions: string | BoolSourceModelOptions, color?: string) {
        let options: BoolSourceModelOptions = {};
        if (typeof nameOrOptions === 'string') {
            options = {
                name: nameOrOptions,
                color: color,
            };
        }else {
            options = <BoolSourceModelOptions>nameOrOptions
        }
        super({
            type: 'boolSource',
            name: "Untitled",
            color: "rgb(0,192,255)",
            activationFun: (portsIn: BoolPortModel[]) => portsIn[0]?.active || false,
            ...options
        })
        this.addInPort('In')
        this.addOutPort('Out')
    }

    addInPort(label, after = true) {
        if (this.getInPorts().length >= 1) {
            throw new Error("An BoolSourceNode can't have more than 1 input port, since the only Input is meant for programmatically forwarding signals e.g. from wrappers")
        }
        return super.addInPort(label, after)
    }
}