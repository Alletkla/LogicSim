import { BasePositionModelOptions, DeserializeEvent, ListenerHandle, NodeModel, NodeModelGenerics, PortModelAlignment } from "@projectstorm/react-diagrams";
import { BoolPortModel } from "../boolPort/BoolPortModel";
import * as _ from 'lodash'

export interface BoolNodeModelOptions extends BasePositionModelOptions {
    name?: string;
    color?: string;
    activationFun?: (portsIn: BoolPortModel[]) => boolean
}
export interface BoolNodeModelGenerics extends NodeModelGenerics {
    OPTIONS: BoolNodeModelOptions;
    PORT: BoolPortModel; //not used yet?
}

export enum BoolNodeModelActivFuncs {
    AND = 'and',
    OR = 'or',
    NOT = 'not',
}

export interface BoolNodeModelSerialized extends ReturnType<NodeModel['serialize']> {
    name: string,
    color: string,
    portsInOrder: BoolPortModel[],
    portsOutOrder: BoolPortModel[],
    activationFun: string,
}

export class BoolNodeModel<G extends BoolNodeModelGenerics = BoolNodeModelGenerics> extends NodeModel<G> {
    protected portsIn: BoolPortModel[];
    protected portsOut: BoolPortModel[];
    /**
     * @TODO : make it an object, with the id of the added port as key....
     */
    protected inPortListenerHandles: { [key: string]: ListenerHandle };

    static activationFuns = {
        [BoolNodeModelActivFuncs.AND]: (portsIn: BoolPortModel[]) => portsIn.every(el => el.isActive() === true),
        [BoolNodeModelActivFuncs.OR]: (portsIn: BoolPortModel[]) => !!portsIn.find((val) => val.isActive() === true),
        [BoolNodeModelActivFuncs.NOT]: (portsIn: BoolPortModel[]) => !portsIn[0].isActive()
    }
    constructor(name: string, color: string, activationFun: (portsIn: BoolPortModel[]) => boolean);
    constructor(options?: G['OPTIONS']);
    constructor(options: any = {}, color?: string, activationFun?: (portsIn: BoolPortModel[]) => boolean) {
        if (typeof options === 'string') {
            options = {
                name: options,
                color: color,
                activationFun: activationFun
            };
        }
        super(Object.assign(
            <BoolNodeModelOptions>{ type: 'bool', name: 'Untitled', color: 'rgb(0,192,255)', activationFun: () => false },
            options));
        this.portsOut = [];
        this.portsIn = [];
        this.inPortListenerHandles = {}
    }

    override doClone(lookupTable: {}, clone: any) {
        //ports need to be reseted in any case cause doClone calls addPort on super.getPorts(), where they are added again
        /**
         * @TODO investigate if this is really needed
         */
        clone.portsIn = [];
        clone.portsOut = [];
        super.doClone(lookupTable, clone);
    }

    override removePort(port: BoolPortModel) {
        super.removePort(port);
        if (port.getOptions().in) {
            port.deregisterListener(this.inPortListenerHandles[port.getID()])
            this.portsIn.splice(this.portsIn.indexOf(port), 1);
        }
        else {
            this.portsOut.splice(this.portsOut.indexOf(port), 1);
        }
    }

    override getOptions(): G['OPTIONS'] {
        return super.getOptions()
    }

    getActivationFun(): (portsIn: BoolPortModel[]) => boolean {
        return this.getOptions().activationFun
    }

    override addPort(port: BoolPortModel) {
        super.addPort(port);
        if (port.getOptions().in) {
            if (this.getActivationFun()) {
                Object.assign(this.inPortListenerHandles, {
                    [port.getID()] : port.registerListener({
                        'activeChanged': (obj) => {
                            const node = obj.entity as BoolPortModel
                            node.getParent().getOutPorts().forEach(port => port.setActive(this.getActivationFun()(node.getParent().getInPorts())))
                        }
                    })
                })
            }
            if (this.portsIn.indexOf(port) === -1) {
                this.portsIn.push(port);
            }
        }
        else {
            if (this.getActivationFun()) {
                port.setActive(this.getActivationFun()(this.getInPorts()))
            }
            if (this.portsOut.indexOf(port) === -1) {
                this.portsOut.push(port);
            }
        }
        return port;
    }


    addInPort(p: BoolPortModel, after?: boolean): ReturnType<BoolNodeModel['addPort']>;
    addInPort(label: string, after?: boolean): ReturnType<BoolNodeModel['addPort']>;
    addInPort(portOrLabel: string | BoolPortModel, after: boolean = true) {
        let p: BoolPortModel
        if (typeof portOrLabel === 'string') {
            const label = portOrLabel
            p = new BoolPortModel({
                in: true,
                name: label,
                label: label,
                alignment: PortModelAlignment.LEFT
            });
        } else {
            p = portOrLabel
        }
        if (!after) {
            this.portsIn.splice(0, 0, p);
        }

        return this.addPort(p);
    }
    addOutPort(p: BoolPortModel, after?: boolean): ReturnType<BoolNodeModel['addPort']>;
    addOutPort(label: string, after?: boolean): ReturnType<BoolNodeModel['addPort']>
    addOutPort(portOrLabel: string | BoolPortModel, after: boolean = true) {
        let p: BoolPortModel
        if (typeof portOrLabel === 'string') {
            const label = portOrLabel
            p = new BoolPortModel({
                in: false,
                name: label,
                label: label,
                alignment: PortModelAlignment.RIGHT
            });
        } else {
            p = portOrLabel
        }

        if (!after) {
            this.portsOut.splice(0, 0, p);
        }
        return this.addPort(p);
    }

    override getPort(name: string): BoolPortModel | null {
        return super.getPort(name) as BoolPortModel
    }

    getOutPorts(): BoolPortModel[] {
        return this.portsOut;
    }

    getInPorts(): BoolPortModel[] {
        return this.portsIn;
    }

    override deserialize(event: DeserializeEvent<this>) {
        //activationFun must be added first, cause its needed to activate the right Outputs while adding Ports
        //We are using indirect eval https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval?retiredLocale=de#never_use_eval!
        const desFunc = eval?.(event.data.activationFun);
        this.options.activationFun = desFunc
        super.deserialize(event);
        this.options.name = event.data.name;
        this.options.color = event.data.color;
        // the ports are added properly via .addPort() in the super.deserialize()
        // but the order is not preserved there, thats why this just sets directly
        this.portsIn = _.map(event.data.portsInOrder, (id) => {
            return this.getPortFromID(id);
        });
        this.portsOut = _.map(event.data.portsOutOrder, (id) => {
            return this.getPortFromID(id);
        });
    }
    override serialize(): BoolNodeModelSerialized {
        return Object.assign(Object.assign({}, super.serialize()), {
            name: this.options.name,
            color: this.options.color,
            portsInOrder: _.map(this.portsIn, (port) => {
                return port.getID();
            }),
            portsOutOrder: _.map(this.portsOut, (port) => {
                return port.getID();
            }), activationFun: this.options.activationFun?.toString()
        });
    }
}