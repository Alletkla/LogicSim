import { DefaultNodeModel, DefaultNodeModelOptions, DefaultPortModel, NodeModel, NodeModelGenerics, PortModel, PortModelAlignment, PortModelGenerics } from "@projectstorm/react-diagrams";
import { BoolPortModel } from "./BoolPortModel";

export interface BoolNodeModelGenerics {
    PORT: BoolPortModel;
}

export class BoolNodeModel extends DefaultNodeModel {

	constructor(name: string, color: string);
	constructor(options?: DefaultNodeModelOptions);
	constructor(options: any = {}, color?: string) {
        if (typeof options === 'string') {
            options = {
                name: options,
                color: color
            };
        }
        super(Object.assign({ type: 'bool', name: 'Untitled', color: 'rgb(0,192,255)' }, options));
    }

    addInPort(label, after = true) {
        const p = new BoolPortModel({
            in: true,
            name: label,
            label: label,
            alignment: PortModelAlignment.LEFT
        });
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
        if (!after) {
            this.portsOut.splice(0, 0, p);
        }
        return this.addPort(p);
    }

    getPort(name: string): BoolPortModel | null {
        return super.getPort(name) as BoolPortModel
    }
}