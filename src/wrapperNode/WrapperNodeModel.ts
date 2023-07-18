import { BasePositionModelOptions, DiagramModel, NodeModel, PortModelAlignment } from "@projectstorm/react-diagrams";
import { BoolNodeModelGenerics } from "../bool/boolNode/BoolNodeModel";
import { BoolPortModel } from "../bool/boolPort/BoolPortModel";
import { BoolSourceNodeModel } from "../bool/boolSourceNode/BoolSourceNodeModel";

export interface WrapperNodeModelOptions extends BasePositionModelOptions {
    name?: string;
    color?: string;
    wrapee: DiagramModel
}

export class WrapperNodeModel extends NodeModel<BoolNodeModelGenerics> {
    protected portsIn: BoolPortModel[];
    protected portsOut: BoolPortModel[];

    constructor(name: string, color: string, wrappee: DiagramModel);
    constructor(options?: WrapperNodeModelOptions);
    constructor(options: any = {}, color?: string, wrappee?: DiagramModel) {
        if (typeof options === 'string') {
            options = {
                name: options,
                color: color,
                wrappee: wrappee
            };
        }
        super(Object.assign({ type: 'wrapper', name: 'Untitled', color: 'rgb(0,192,255)', }, options));
        this.portsOut = [];
        this.portsIn = [];
        
        wrappee.getNodes().filter(
            node => node.getOptions().type === 'boolSource'
        ).reduce((acc, curNode) => {
            return acc.concat((<BoolSourceNodeModel>curNode).getInPorts())
        }, <BoolPortModel[]>[]).map(
            port => this.addInPort(port)
        )

        wrappee.getNodes().filter(
            node => node.getOptions().type === 'boolTarget'
        ).reduce((acc, curNode) => {
            return acc.concat((<BoolSourceNodeModel>curNode).getOutPorts())
        }, <BoolPortModel[]>[]).map(
            port => this.addOutPort(port)
        )

    }
    addPort(port) {
        super.addPort(port);
        if (port.getOptions().in) {
            if (this.portsIn.indexOf(port) === -1) {
                this.portsIn.push(port);
            }
        }
        else {
            if (this.portsOut.indexOf(port) === -1) {
                this.portsOut.push(port);
            }
        }
        return port;
    }

    /**
     * WrapperNodeModel doens't create new Ports to keep reference to wrapped Port Nodes
     * @param p Port to add
     * @param after Wether to add it after (true) or in front of (false) the existing ports
     * @returns 
     */
    addInPort(p: BoolPortModel, after = true) {
        if (!after) {
            this.portsIn.splice(0, 0, p);
        }
        return this.addPort(p);
    }
    /**
     * WrapperNodeModel doens't create new Ports to keep reference to wrapped Port Nodes
     * @param p Port to add
     * @param after Wether to add it after (true) or in front of (false) the existing ports
     * @returns 
     */
    addOutPort(p: BoolPortModel, after = true) {
        if (!after) {
            this.portsOut.splice(0, 0, p);
        }
        return this.addPort(p);
    }

    getOutPorts(): BoolPortModel[] {
        return this.portsOut;
    }

    getInPorts(): BoolPortModel[] {
        return this.portsIn;
    }
}