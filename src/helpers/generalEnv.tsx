import createEngine, { DiagramEngine } from '@projectstorm/react-diagrams'
import { BoolLinkFactory } from "../bool/boolLink/BoolLinkFactory"
import { BoolNodeFactory } from "../bool/boolNode/BoolNodeFactory"
import { BoolPortModelFactory } from "../bool/boolPort/BoolPortModelFactory"
import { BoolSourceNodeFactory } from "../bool/boolSourceNode/BoolSourceNodeFactory"
import { BoolTargetNodeFactory } from "../bool/boolTargetNode/BoolTargetNodeFactory"
import { WrapperNodeFactory } from "../wrapperNode/WrapperNodeFactory"

let engine: DiagramEngine
export const generateDiagramEngine = () => {

    if (engine) {
        return engine
    }
    engine = createEngine()
    engine.getNodeFactories().registerFactory(new BoolNodeFactory())
    engine.getNodeFactories().registerFactory(new BoolSourceNodeFactory())
    engine.getNodeFactories().registerFactory(new BoolTargetNodeFactory())
    engine.getNodeFactories().registerFactory(new WrapperNodeFactory())
    engine.getLinkFactories().registerFactory(new BoolLinkFactory())
    engine.getPortFactories().registerFactory(new BoolPortModelFactory())

    return engine
}

export const DEFAULT_COLOR = 'rgb(168,61,6)'