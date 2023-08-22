import { BaseEntityEvent, BaseEvent, BaseListener, DefaultPortModel, DefaultPortModelOptions, DeserializeEvent, ListenerHandle, NodeModel, NodeModelGenerics, PortModelAlignment } from "@projectstorm/react-diagrams";
import { BoolLinkModel } from "../boolLink/BoolLinkModel";
import { BoolNodeModel } from "../boolNode/BoolNodeModel";

export interface BoolPortModelListener extends BaseListener {
    activeChanged?(event: BaseEntityEvent & {
        isActive: boolean;
    }): void;
}

//dont Extend Defualt Portmodel... copy and use Generics

export interface BoolPortModelSerialized extends ReturnType<DefaultPortModel['serialize']> {
    active: boolean
}
export class BoolPortModel extends DefaultPortModel {
    private active: boolean

    constructor(isIn: boolean, name?: string, label?: string); //fist overload
    constructor(options: DefaultPortModelOptions); //second overload
    constructor(options: DefaultPortModelOptions | boolean, name?: string, label?: string) { //combined constructor
        //If name is not falsy (given) constructor 1: and therefore options is the parameter "isIn"
        if (typeof options === "boolean") {
            options = {
                in: !!options,
                name: name,
                label: label
            };
        }

        options = options as DefaultPortModelOptions;
        super({
            label: options.label || options.name,
            alignment: options.in ? PortModelAlignment.LEFT : PortModelAlignment.RIGHT,
            type: 'bool',
            ...options
        });
        this.options.name = this.options.name || this.getID()
        this.active = false
    }

    override createLinkModel(): BoolLinkModel {
        return new BoolLinkModel();
    }

    override getLinks(): { [id: string]: BoolLinkModel; } {
        return super.getLinks() as { [id: string]: BoolLinkModel }
    }

    setActive(isActive: boolean) {
        this.active = isActive

        if (this.getOptions().in === false) {
            Object.entries(this.getLinks()).forEach(([_, linkModel]) => linkModel.setActive(isActive))
        }
        this.fireEvent(
            { isActive: isActive }, 'activeChanged'
        )
    }

    isActive() {
        return this.active
    }

    override registerListener(listener: BoolPortModelListener): ListenerHandle {
        return super.registerListener(listener)
    }

    //Ports dont need to deserialize the link, since its deserialized in the link layer and the ports are 
    //added respectivly 
    override deserialize(event: DeserializeEvent<this>) {
        super.deserialize(event);
        this.setActive(event.data.active);
    }
    override serialize(): BoolPortModelSerialized {
        return Object.assign(Object.assign({}, super.serialize()), {
            active: this.active
        });
    }

    override getParent(): BoolNodeModel {
        return super.getParent() as BoolNodeModel
    }
}