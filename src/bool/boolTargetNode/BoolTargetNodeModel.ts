import { BoolNodeModel, BoolNodeModelOptions } from "../boolNode/BoolNodeModel";
import { BoolPortModel } from "../boolPort/BoolPortModel";


export interface BoolTargetModelOptions extends BoolNodeModelOptions {
}

export class BoolTargetNodeModel extends BoolNodeModel {

    constructor(name: string, color: string);
    constructor(options?: BoolTargetModelOptions);
    constructor(nameOrOptions: string | BoolTargetModelOptions, color?: string) {
        let options: BoolTargetModelOptions = {}
        if (typeof nameOrOptions === 'string') {
            options = {
                name: nameOrOptions,
                color: color,
            };
        } else {
            options = <BoolTargetModelOptions>nameOrOptions
        }
        super({
            type: 'boolTarget',
            name: 'Untitled',
            color: 'rgb(0,192,255)',
            activationFun: (portsIn: BoolPortModel[]) => portsIn[0]?.active || false,
            ...options
        });
        this.addInPort('In')
        this.addOutPort('Out')
    }

    override addInPort(label, after = true) {
        if (this.getInPorts().length >= 1) {
            throw new Error("A BoolTargetNode can't have more than 1 input port, since inPorts need to be forwared to outputs for programmatically handling e.g. for wrappers")
        }
        return super.addInPort(label, after)
    }

    override addOutPort(label, after = true) {
        if (this.getOutPorts().length >= 1) {
            throw new Error("A BoolTargetNode can't have more than 1 output port, since the only Outpurt is meant for programmatically forwarding signals e.g. for wrappers")
        }
        return super.addOutPort(label, after)
    }
}