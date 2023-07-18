import { AbstractReactFactory, DiagramEngine, GenerateModelEvent, GenerateWidgetEvent } from "@projectstorm/react-diagrams";
import BoolTargetNodeWidget from "./BoolTargetNodeWidget";
import { BoolTargetNodeModel } from "./BoolTargetNodeModel";

export class BoolTargetNodeFactory extends AbstractReactFactory<BoolTargetNodeModel, DiagramEngine>{
    constructor() {
        super('boolTarget')
    }

    generateReactWidget(event: GenerateWidgetEvent<BoolTargetNodeModel>): JSX.Element {
        return <BoolTargetNodeWidget engine={this.engine} node={event.model} />
    }
    generateModel(event: GenerateModelEvent): BoolTargetNodeModel {
        return new BoolTargetNodeModel()
    }
}