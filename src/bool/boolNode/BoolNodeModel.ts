import { BasePositionModelOptions, ListenerHandle, NodeModel, NodeModelGenerics, PortModelAlignment } from "@projectstorm/react-diagrams";
import { BoolPortModel } from "../boolPort/BoolPortModel";
import * as _ from 'lodash'

export interface BoolNodeModelOptions extends BasePositionModelOptions {
    name?: string;
    color?: string;
    activationFun?: (portsIn: BoolPortModel[]) => boolean
}
export interface BoolNodeModelGenerics extends NodeModelGenerics {
    OPTIONS: BoolNodeModelOptions;
    PORT: BoolPortModel;
}

export enum BoolNodeModelActivFuncs {
    AND = 'and',
    OR = 'or',
    NOT = 'not',
}

export class BoolNodeModel extends NodeModel<BoolNodeModelGenerics> {
    protected portsIn: BoolPortModel[];
    protected portsOut: BoolPortModel[];
    /**
     * @TODO : make it an object, with the id of the added port as key....
     */
    protected inPortListenerHandle: ListenerHandle;

    static activationFuns = {
        [BoolNodeModelActivFuncs.AND]: (portsIn: BoolPortModel[]) => portsIn.every(el => el.active === true),
        [BoolNodeModelActivFuncs.OR]: (portsIn: BoolPortModel[]) => !!portsIn.find((val) => val.active === true),
        [BoolNodeModelActivFuncs.NOT]: (portsIn: BoolPortModel[]) => !portsIn[0].active
    }
    constructor(name: string, color: string, activationFun: (portsIn: BoolPortModel[]) => boolean);
    constructor(options?: BoolNodeModelOptions);
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
    }

    doClone(lookupTable, clone) {
        clone.portsIn = [];
        clone.portsOut = [];
        super.doClone(lookupTable, clone);
    }

    removePort(port: BoolPortModel) {
        super.removePort(port);
        if (port.getOptions().in) {
            port.deregisterListener(this.inPortListenerHandle)
            this.portsIn.splice(this.portsIn.indexOf(port), 1);
        }
        else {
            this.portsOut.splice(this.portsOut.indexOf(port), 1);
        }
    }

    getOptions(): BoolNodeModelOptions {
        return super.getOptions()
    }

    getActivationFun(): (portsIn: BoolPortModel[]) => boolean {
        return this.getOptions().activationFun
    }

    addPort(port: BoolPortModel) {
        super.addPort(port);
        if (port.getOptions().in) {
            this.inPortListenerHandle = port.registerListener({
                'activeChanged': () => {
                    this.getOutPorts().forEach(port => port.setActive(this.getActivationFun()(this.getInPorts())))
                }
            })
            if (this.portsIn.indexOf(port) === -1) {
                this.portsIn.push(port);
            }
        }
        else {
            port.setActive(this.getActivationFun()(this.getInPorts()))
            if (this.portsOut.indexOf(port) === -1) {
                this.portsOut.push(port);
            }
        }
        return port;
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

    getOutPorts(): BoolPortModel[] {
        return this.portsOut;
    }

    getInPorts(): BoolPortModel[] {
        return this.portsIn;
    }

    setInPorts(ports: BoolPortModel[]) {
        this.portsIn = []
        console.log(ports)
        ports.forEach(port => this.addInPort(port))
    }

    setOutPorts(ports: BoolPortModel[]) {
        this.portsOut = []
        ports.forEach(port => this.addOutPort(port))
    }

    deserialize(event) {
        //activationFun must be added first, cause its needed to activate the right Outputs while adding Ports
        //We are using indirect eval https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval?retiredLocale=de#never_use_eval!
        const desFunc = eval?.(event.data.activationFun);
        this.options.activationFun = desFunc
        super.deserialize(event);
        this.options.name = event.data.name;
        this.options.color = event.data.color;
        //the ports are added properly via .addPrt() in the super.deserialize()
        //but the order is not preserved there, thats why this just sets directly
        this.portsIn = _.map(event.data.portsInOrder, (id) => {
            return this.getPortFromID(id);
        });
        this.portsOut = _.map(event.data.portsOutOrder, (id) => {
            return this.getPortFromID(id);
        });
    }
    serialize() {
        return Object.assign(Object.assign({}, super.serialize()), {
            name: this.options.name,
            color: this.options.color,
            portsInOrder: _.map(this.portsIn, (port) => {
                return port.getID();
            }),
            portsOutOrder: _.map(this.portsOut, (port) => {
                return port.getID();
            }), activationFun: this.options.activationFun.toString()
        });
    }
}