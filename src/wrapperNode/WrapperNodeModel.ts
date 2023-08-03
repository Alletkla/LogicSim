import createEngine, { DeserializeEvent, DiagramModel } from "@projectstorm/react-diagrams";
import { BoolNodeModel, BoolNodeModelGenerics, BoolNodeModelOptions, BoolNodeModelSerialized } from "../bool/boolNode/BoolNodeModel";
import { BoolPortModel } from "../bool/boolPort/BoolPortModel";
import { BoolSourceNodeModel } from "../bool/boolSourceNode/BoolSourceNodeModel";
import * as _ from "lodash"
import { BoolNodeFactory } from "../bool/boolNode/BoolNodeFactory";
import { BoolLinkFactory } from "../bool/boolLink/BoolLinkFactory";
import { BoolPortModelFactory } from "../bool/boolPort/BoolPortModelFactory";
import { BoolSourceNodeFactory } from "../bool/boolSourceNode/BoolSourceNodeFactory";
import { BoolTargetNodeFactory } from "../bool/boolTargetNode/BoolTargetNodeFactory";
import { WrapperNodeFactory } from "./WrapperNodeFactory";

export interface WrapperNodeModelGenerics extends BoolNodeModelGenerics {
    OPTIONS: WrapperNodeModelOptions
}

export interface WrapperNodeModelOptions extends BoolNodeModelOptions {
    wrappee: DiagramModel
}
export interface WrapperNodeModelSerialized extends BoolNodeModelSerialized {
    wrappee: ReturnType<DiagramModel['serialize']>,
}

export class WrapperNodeModel extends BoolNodeModel<WrapperNodeModelGenerics> {
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
        super(Object.assign({ type: 'wrapper', name: 'Untitled', color: 'rgb(0,192,255)', activationFun: null, wrappee: new DiagramModel()}, options));

        this.constructFromWrappee(this.getOptions().wrappee)
    }

    constructFromWrappee(wrappee: DiagramModel) {
        wrappee.getNodes().filter(
            node => node.getOptions().type === 'boolSource'
        ).reduce((acc, curNode) => {
            return acc.concat((<BoolSourceNodeModel>curNode).getInPorts())
        }, <BoolPortModel[]>[]).map(
            (port, index) => {
                port.getOptions().name = `In${index}`
                port.getOptions().label = `In${index}`
                this.addInPort(port)
            }
        )

        wrappee.getNodes().filter(
            node => node.getOptions().type === 'boolTarget'
        ).reduce((acc, curNode) => {
            return acc.concat((<BoolSourceNodeModel>curNode).getOutPorts())
        }, <BoolPortModel[]>[]).map(
            (port, index) => {
                port.getOptions().name = `Out${index}`
                port.getOptions().label = `Out${index}`
                this.addOutPort(port)
            }
        )
    }

    /**
     * Overwrite addPort behvaiour because outPorts active state is handled by the internal model
     * @param port 
     * @returns 
     */
    override addPort(port: BoolPortModel) {
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
    override addInPort(p: BoolPortModel, after = true) {
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
    override addOutPort(p: BoolPortModel, after = true) {
        if (!after) {
            this.portsOut.splice(0, 0, p);
        }
        return this.addPort(p);
    }

    serialize(): WrapperNodeModelSerialized {
        return Object.assign(Object.assign({}, super.serialize()), {wrappee: this.getOptions().wrappee.serialize()});
    }

    deserialize(event: DeserializeEvent<this>): void {
        super.deserialize(event)

        let model = new DiagramModel()
        let engine = createEngine()
        console.log(engine.getFactoryForLayer('diagram-links'))
        engine.getNodeFactories().registerFactory(new BoolNodeFactory())
        engine.getNodeFactories().registerFactory(new BoolSourceNodeFactory())
        engine.getNodeFactories().registerFactory(new BoolTargetNodeFactory())
        engine.getNodeFactories().registerFactory(new WrapperNodeFactory())
        engine.getLinkFactories().registerFactory(new BoolLinkFactory())
        engine.getPortFactories().registerFactory(new BoolPortModelFactory())

        model.deserializeModel(event.data.wrappee, engine)
        this.options.wrappee = model
    }
}