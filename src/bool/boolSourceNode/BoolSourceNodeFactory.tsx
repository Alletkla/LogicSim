import { AbstractReactFactory, DiagramEngine, GenerateModelEvent, GenerateWidgetEvent } from "@projectstorm/react-diagrams";
import { BoolSourceNodeModel } from "./BoolSourceNodeModel";
import BoolSourceNodeWidget from "./BoolSourceNodeWidget";

export class BoolSourceNodeFactory extends AbstractReactFactory<BoolSourceNodeModel, DiagramEngine>{
    constructor() {
        super('boolSource')
    }

    generateReactWidget(event: GenerateWidgetEvent<BoolSourceNodeModel>): JSX.Element {
        return <BoolSourceNodeWidget engine={this.engine} node={event.model} />
    }
    generateModel(event: GenerateModelEvent): BoolSourceNodeModel {
        return new BoolSourceNodeModel()
    }
}