import { BasePositionModelOptions, NodeModel, NodeModelGenerics, PortModelAlignment } from "@projectstorm/react-diagrams";
import { BoolPortModel } from "../boolPort/BoolPortModel";
import * as _ from 'lodash'

export interface BoolNodeModelOptions extends BasePositionModelOptions {
    name?: string;
    color?: string;
    activationFun?: BoolNodeModelActivFuncs
}
export interface BoolNodeModelGenerics extends NodeModelGenerics {
    OPTIONS: BoolNodeModelOptions;
}

export enum BoolNodeModelActivFuncs {
    DEFAULT = 'default',
    AND = 'and',
    OR = 'or',
    NOT = 'not',
}

export class BoolNodeModel extends NodeModel<BoolNodeModelGenerics> {  
    protected portsIn: BoolPortModel[];
    protected portsOut: BoolPortModel[];

    static activationFuns = {
        [BoolNodeModelActivFuncs.DEFAULT] : (portsIn: BoolPortModel[]) => true,
        [BoolNodeModelActivFuncs.AND] : (portsIn: BoolPortModel[]) => portsIn.every(el => el.active === true),
        [BoolNodeModelActivFuncs.OR] : (portsIn: BoolPortModel[]) => !!portsIn.find((val) => val.active === true),
        [BoolNodeModelActivFuncs.NOT] : (portsIn: BoolPortModel[]) => !portsIn[0].active
    }
    constructor(name: string, color: string, activationFun: BoolNodeModelActivFuncs);
    constructor(options?: BoolNodeModelOptions);
    constructor(options: any = {}, color?: string, activationFun?: BoolNodeModelActivFuncs) {
        if (typeof options === 'string') {
            options = {
                name: options,
                color: color,
                activationFun: activationFun
            };
        }
        super(Object.assign({ type: 'bool', name: 'Untitled', color: 'rgb(0,192,255)', activationFun:BoolNodeModelActivFuncs.DEFAULT }, options));
        this.portsOut = [];
        this.portsIn = [];
    }

    doClone(lookupTable, clone) {
        clone.portsIn = [];
        clone.portsOut = [];
        super.doClone(lookupTable, clone);
    }

    removePort(port) {
        super.removePort(port);
        if (port.getOptions().in) {
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
        return BoolNodeModel.activationFuns[this.getOptions().activationFun]
    }

    addPort(port) {
        super.addPort(port);
        if (port.getOptions().in) {
            port.registerListener({
                'activeChanged': () => {
                    this.getOutPorts().forEach(port => port.setActive(this.getActivationFun()(this.getInPorts())))
                    // this.getOutPorts().forEach(port => console.log(this.getActivationFun()))
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

    deserialize(event) {
        //activationFun must be added first, cause its needed to activate the right Outputs while adding Ports
        this.options.activationFun = event.data.activationFun;
        super.deserialize(event);
        this.options.name = event.data.name;
        this.options.color = event.data.color;
    }
    serialize() {
        return Object.assign(Object.assign({}, super.serialize()), { name: this.options.name, color: this.options.color, portsInOrder: _.map(this.portsIn, (port) => {
            return port.getID();
        }), portsOutOrder: _.map(this.portsOut, (port) => {
            return port.getID();
        }), activationFun: this.options.activationFun });
    }
}