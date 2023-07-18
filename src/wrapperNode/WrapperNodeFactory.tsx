import { AbstractReactFactory, DiagramEngine, GenerateModelEvent, GenerateWidgetEvent } from "@projectstorm/react-diagrams";
import { WrapperNodeModel } from "./WrapperNodeModel";
import { WrapperNodeWidget } from "./WrapperNodeWidget";

export class WrapperNodeFactory extends AbstractReactFactory<WrapperNodeModel, DiagramEngine>{
    constructor() {
        super('wrapper')
    }

    generateReactWidget(event: GenerateWidgetEvent<WrapperNodeModel>): JSX.Element {
        return <WrapperNodeWidget engine={this.engine} node={event.model} />
    }
    generateModel(event: GenerateModelEvent): WrapperNodeModel {
        return new WrapperNodeModel()
    }
}