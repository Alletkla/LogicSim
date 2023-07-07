import { DefaultNodeModel, DefaultPortModel, NodeModel, NodeModelGenerics, PortModel, PortModelAlignment, PortModelGenerics } from "@projectstorm/react-diagrams";
import { BoolPortModel } from "./BoolPortModel";

export interface BoolNodeModelGenerics {
    PORT: BoolPortModel;
}

export class BoolNodeModel extends DefaultNodeModel {
    constructor() {
        super({
            type: 'bool'
        })
        this.addPort(new BoolPortModel(PortModelAlignment.BOTTOM))
    }

    getPort(name: string): BoolPortModel | null {
        return super.getPort(name) as BoolPortModel
    }
}