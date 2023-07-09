import { DefaultNodeModel, DefaultNodeModelOptions, PortModelAlignment } from "@projectstorm/react-diagrams";
import { BoolPortModel } from "../boolPort/BoolPortModel";

export interface BoolNodeModelGenerics {
    PORT: BoolPortModel;
}

export interface BoolNodeModelOptions extends DefaultNodeModelOptions {
    activationFun?: (inputPorts: BoolPortModel[]) => boolean
}

export class BoolNodeModel extends DefaultNodeModel {
    constructor(name: string, color: string, activationFun: (inputPorts: BoolPortModel[]) => boolean);
    constructor(options?: BoolNodeModelOptions);
    constructor(options: any = {}, color?: string, activationFun?: (inputPorts: BoolPortModel[]) => boolean) {
        if (typeof options === 'string') {
            options = {
                name: options,
                color: color,
                activationFun: activationFun
            };
        }
        super(Object.assign({ type: 'bool', name: 'Untitled', color: 'rgb(0,192,255)', activationFun: () => true }, options));
    }

    getOptions(): BoolNodeModelOptions {
        return super.getOptions()
    }


    addInPort(label, after = true) {
        const p = new BoolPortModel({
            in: true,
            name: label,
            label: label,
            alignment: PortModelAlignment.LEFT
        });
        p.registerListener({
            'activeChanged': () => {
                this.getOutPorts().forEach(port => port.setActive(this.getOptions().activationFun(this.getInPorts())))
            }
        })
        if (!after) {
            this.portsIn.splice(0, 0, p);
        }
        return this.addPort(p);
    }
    addOutPort(label, after = true) {
        const p = new BoolPortModel({
            in: false,
            name: label,
            label: label,
            alignment: PortModelAlignment.RIGHT
        });
        
        p.setActive(this.getOptions().activationFun([...this.getInPorts(),p]))
        if (!after) {
            this.portsOut.splice(0, 0, p);
        }
        return this.addPort(p);
    }

    getPort(name: string): BoolPortModel | null {
        return super.getPort(name) as BoolPortModel
    }

    getOutPorts(): BoolPortModel[] {
        return super.getOutPorts() as BoolPortModel[]
    }

    getInPorts(): BoolPortModel[] {
        return super.getInPorts() as BoolPortModel[]
    }
}