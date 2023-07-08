import { AbstractReactFactory, DiagramEngine, GenerateModelEvent, GenerateWidgetEvent } from "@projectstorm/react-diagrams";
import { BoolNodeModel } from "./BoolNodeModel";
import { BoolNodeWidget } from "./BoolNodeWidget";

export class BoolNodeFactory extends AbstractReactFactory<BoolNodeModel, DiagramEngine>{
    constructor() {
        super('bool')
    }

    generateReactWidget(event: GenerateWidgetEvent<BoolNodeModel>): JSX.Element {
        return <BoolNodeWidget engine={this.engine} node={event.model} />
    }
    generateModel(event: GenerateModelEvent): BoolNodeModel {
        return new BoolNodeModel()
    }
}