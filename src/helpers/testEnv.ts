import createEngine, { BaseModel, CanvasEngine, DeserializeEvent } from '@projectstorm/react-diagrams'
import { BoolLinkFactory } from '../bool/boolLink/BoolLinkFactory';
import { BoolNodeFactory } from '../bool/boolNode/BoolNodeFactory';
import { BoolNodeModel } from '../bool/boolNode/BoolNodeModel';
import { BoolPortModelFactory } from '../bool/boolPort/BoolPortModelFactory';
import { BoolSourceNodeFactory } from '../bool/boolSourceNode/BoolSourceNodeFactory';
import { BoolTargetNodeFactory } from '../bool/boolTargetNode/BoolTargetNodeFactory';
import { WrapperNodeFactory } from '../wrapperNode/WrapperNodeFactory';

export function NodeSerializeCycle<T extends BoolNodeModel>(type: (new (...args: any[]) => T), node: T) {
    //dont know why this extra typecast is neccessary since T is of Type T and return Tyoe of T.serialize is ReturnType<T['serialize']>, 
    //but it is
    const serializedNode = node.serialize() as ReturnType<T['serialize']>
    const deserializedNode = deserializeNode<T>(type, serializedNode, diagramEngine)

    return { serializedNode, deserializedNode }
}

export function deserializeNode<T extends BoolNodeModel>(type: (new (...args: any[]) => T), data: ReturnType<T['serialize']>, engine: CanvasEngine) {
    const models: {
        [id: string]: BaseModel;
    } = {};
    const promises: {
        [id: string]: Promise<BaseModel>;
    } = {};
    const resolvers: {
        [id: string]: (model: BaseModel) => any;
    } = {};

    const event: DeserializeEvent = {
        data: data,
        engine: engine,
        registerModel: (model: BaseModel) => {
            models[model.getID()] = model;
            if (resolvers[model.getID()]) {
                resolvers[model.getID()](model);
            }
        },
        getModel<T extends BaseModel>(id: string): Promise<T> {
            if (models[id]) {
                return Promise.resolve(models[id]) as Promise<T>;
            }
            if (!promises[id]) {
                promises[id] = new Promise((resolve) => {
                    resolvers[id] = resolve;
                });
            }
            return promises[id] as Promise<T>;
        }
    };

    const newModel = new type()
    newModel.deserialize(event)
    return newModel
}

export function purgeIds(object: any) {
    const purgedObj = { ...object }
    for (let [key, val] of Object.entries(purgedObj)) {
        if (typeof val === 'object') {
            purgedObj[key] = purgeIds(val)
        }
        if (key === 'id') {
            purgedObj[key] = 'purged';
            continue
        }
        if (typeof val === 'string' && !!val.match(/[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{8}/i)) {
            purgedObj[key] = 'purged'
        }
    }
    return purgedObj
}

export const diagramEngine = createEngine()
diagramEngine.getNodeFactories().registerFactory(new BoolNodeFactory())
diagramEngine.getNodeFactories().registerFactory(new BoolSourceNodeFactory())
diagramEngine.getNodeFactories().registerFactory(new BoolTargetNodeFactory())
diagramEngine.getNodeFactories().registerFactory(new WrapperNodeFactory())
diagramEngine.getLinkFactories().registerFactory(new BoolLinkFactory())
diagramEngine.getPortFactories().registerFactory(new BoolPortModelFactory())