import { BaseEvent, BaseListener, DefaultPortModel, PortModelAlignment } from "@projectstorm/react-diagrams";
import { BoolLinkModel } from "./BoolLinkModel";

export interface BoolPortModelListener extends BaseListener {
    activeStateChanged?(event: BaseEvent & {
        isActive: boolean;
    }): void;
}

export class BoolPortModel extends DefaultPortModel{
    active: boolean

    constructor(alignment: PortModelAlignment) {
        super({
            type: 'bool',
            name: alignment,
            alignment: alignment
        })
        this.active = false
    }

    createLinkModel(): BoolLinkModel {
        return new BoolLinkModel();
    }

    getLinks(): { [id: string]: BoolLinkModel; } {
        return super.getLinks() as {[id: string]: BoolLinkModel}
    }

    setActive(isActive: boolean) {
        this.active = isActive
        Object.entries(this.getLinks()).forEach(([key, linkModel]) => 
        linkModel.fireEvent(
            {isActive}, 'portActiveStateChanged', 
        )) 
    }
    
    isActive(){
        return this.active
    }
}