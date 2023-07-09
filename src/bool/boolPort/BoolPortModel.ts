import { BaseEvent, BaseListener, DefaultPortModel, DefaultPortModelOptions, LinkModel, LinkModelGenerics, ListenerHandle, PortModelAlignment, PortModelListener } from "@projectstorm/react-diagrams";
import { BoolLinkModel } from "../boolLink/BoolLinkModel";

export interface BoolPortModelListener extends BaseListener {
    activeChanged?(event: BaseEvent & {
        isActive: boolean;
    }): void;
}

//dont Extend Defualt Portmodel... copy and use Generics
export class BoolPortModel extends DefaultPortModel {
    active: boolean

    constructor(isIn: boolean, name?: string, label?: string); //fist overload
    constructor(options: DefaultPortModelOptions); //second overload
    constructor(options: DefaultPortModelOptions | boolean, name?: string, label?: string) { //combined constructor
        //If name is not falsy (given) constructor 1: and therefore options is the parameter "isIn"
        if (!!name) {
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
        this.active = false
    }

    createLinkModel(): BoolLinkModel {
        return new BoolLinkModel();
    }

    addLink(link: BoolLinkModel): void {
        super.addLink(link)

        if (this.getOptions().in) {
            this.active = link.getOptions().active
            link.registerListener({
                'targetPortChanged': (event) => {
                    if (event.port === this) {
                        /**
                         * @TODO deregister old Listener. Where to safe the handle?
                         */
                        // link.deregisterListener(listener)
                        link.registerListener({
                            'activeChanged': (event) => {
                                event.isActive !== this.active && this.setActive(event.isActive)
                            }
                        })
                    }
                }
            })
        }else{
            link.getOptions().active = this.active
        }
    }

    getLinks(): { [id: string]: BoolLinkModel; } {
        return super.getLinks() as { [id: string]: BoolLinkModel }
    }

    setActive(isActive: boolean) {
        this.active = isActive
        this.fireEvent(
            { isActive: isActive }, 'activeChanged'
        )
        Object.entries(this.getLinks()).forEach(([_, linkModel]) => linkModel.setActive(isActive))
    }

    isActive() {
        return this.active
    }

    registerListener(listener: BoolPortModelListener): ListenerHandle {
        return super.registerListener(listener)
    }
}