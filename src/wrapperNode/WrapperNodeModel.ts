import { DeserializeEvent, DiagramModel } from "@projectstorm/react-diagrams";
import { BoolNodeModel, BoolNodeModelGenerics, BoolNodeModelOptions, BoolNodeModelSerialized } from "../bool/boolNode/BoolNodeModel";
import { BoolPortModel } from "../bool/boolPort/BoolPortModel";
import { BoolSourceNodeModel } from "../bool/boolSourceNode/BoolSourceNodeModel";
import * as _ from "lodash"
import { generateDiagramEngine } from "../helpers/generalEnv";

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
        super(Object.assign({ type: 'wrapper', name: 'Untitled', color: 'rgb(0,192,255)', activationFun: null, wrappee: new DiagramModel() }, options));

        this.constructFromWrappee(this.getOptions().wrappee, this)
    }

    constructFromWrappee(wrappee: DiagramModel, wrapper: WrapperNodeModel) {
        wrappee.getNodes().filter(
            node => node.getOptions().type === 'boolSource'
        ).reduce((nodes, curNode) => {
            return nodes.concat((<BoolSourceNodeModel>curNode).getInPorts())
        }, <BoolPortModel[]>[]
        ).map(
            port => {
                //needs to be in this way since listeners rely on parents and if the inner port is directly set as the outer parent gets overwritten
                const wrapperPort = new BoolPortModel(port.getOptions().in, port.getParent().getOptions().name, port.getParent().getOptions().name)
                wrapperPort.registerListener({"activeChanged": (event) => port.setActive(event.isActive)})
                wrapper.addInPort(wrapperPort)
            }
        )

        wrappee.getNodes().filter(
            node => node.getOptions().type === 'boolTarget'
        ).reduce((acc, curNode) => {
            return acc.concat((<BoolSourceNodeModel>curNode).getOutPorts())
        }, <BoolPortModel[]>[]).map(
            port => {
                 //needs to be in this way since listeners rely on parents and if the inner port is directly set as the outer parent gets overwritten
                const wrapperPort = new BoolPortModel(port.getOptions().in, port.getParent().getOptions().name, port.getParent().getOptions().name)
                port.registerListener({"activeChanged": (event) => wrapperPort.setActive(event.isActive)})
                wrapper.addOutPort(wrapperPort)
            }
        )
    }

    // /**
    //  * Overwrite addPort behaviour because outPorts active state is handled by the internal model
    //  * @param port 
    //  * @returns 
    //  */
    // override addPort(port: BoolPortModel) {
    //     super.addPort(port)
    //     return port;
    // }

    /**
     * WrapperNodeModel doens't create new Ports to keep reference to wrapped Port Nodes. 
     * Therefore Label and After are mandatory in this ovverride to give a user a first glance
     * when trying to use it with only a label
     * @param p Port to add
     * @param label Not Supported
     * @param after Wether to add it after (true) or in front of (false) the existing ports
     * @returns 
     */
    override addInPort(p: BoolPortModel, after?: boolean): ReturnType<BoolNodeModel['addPort']>;
    override addInPort(label: string, after: boolean): ReturnType<BoolNodeModel['addPort']>;
    override addInPort(portOrLabel: string | BoolPortModel, after: boolean = true) {
        if (typeof portOrLabel === 'string') {
            throw new Error("Wrapper Node is only meant to forward ports and not to create new ones. Use a existing port.")
        }
        const p = portOrLabel
        if (!after) {
            this.portsIn.splice(0, 0, p);
        }
        return this.addPort(p);
    }
    /**
     * WrapperNodeModel doens't create new Ports to keep reference to wrapped Port Nodes. 
     * Therefore Label and After are mandatory in this ovverride to give a user a first glance
     * when trying to use it with only a label
     * @param p Port to add
     * @param label Not Supported
     * @param after Wether to add it after (true) or in front of (false) the existing ports
     * @returns 
     */

    override addOutPort(p: BoolPortModel, after?: boolean): ReturnType<BoolNodeModel['addPort']>;
    override addOutPort(label: string, after: boolean): ReturnType<BoolNodeModel['addPort']>
    override addOutPort(portOrLabel: string | BoolPortModel, after: boolean = true) {
        if (typeof portOrLabel === 'string') {
            throw new Error("Wrapper Node is only meant to forward ports and not to create new ones. Use a existing port.")
        }
        const p = portOrLabel
        if (!after) {
            this.portsOut.splice(0, 0, p);
        }
        return this.addPort(p);
    }

    override serialize(): WrapperNodeModelSerialized {
        return Object.assign(Object.assign({}, super.serialize()), { wrappee: this.getOptions().wrappee.serialize() });
    }

    override deserialize(event: DeserializeEvent<this>): void {
        super.deserialize(event)

        let model = new DiagramModel()
        let engine = generateDiagramEngine()

        model.deserializeModel(event.data.wrappee, engine)
        this.options.wrappee = model
    }

    override doClone(lookupTable: {}, clone: WrapperNodeModel): void {
        super.doClone(lookupTable, clone)
        //clear ports since cloning the node copies them
        clone.getOptions().wrappee = this.getOptions().wrappee.clone()
        clone.ports = {}
        clone.portsIn = []
        clone.portsOut = []
        this.constructFromWrappee(clone.getOptions().wrappee, clone);
    }
}