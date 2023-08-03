import { PropsWithChildren, createContext, useContext, useEffect, useReducer, useState } from "react";
import * as RD from '@projectstorm/react-diagrams';
import { BoolNodeModel } from "./bool/boolNode/BoolNodeModel";
import { BoolSourceNodeModel } from "./bool/boolSourceNode/BoolSourceNodeModel";
import { BoolTargetNodeModel } from "./bool/boolTargetNode/BoolTargetNodeModel";

interface ApplicationContextProps {
    resetModel: () => void
    getActiveDiagram: () => RD.DiagramModel
    getDiagramEngine: () => RD.DiagramEngine
    setModel: (model: RD.DiagramModel) => void
    addBluePrintNodeModel: (nodeModel: BoolNodeModel) => void,
    removeBluePrintModel: (id: string) => void,
    getBluePrintModel: (id: string) => BoolNodeModel,
    getBluePrintNodeModels: () => BoolNodeModel[]
}

const ApplicationContext = createContext<ApplicationContextProps>(null)

export default function ApplicationProvider({ children, engine, model }: PropsWithChildren & { engine: RD.DiagramEngine, model: RD.DiagramModel }) {
    const [bluePrintNodeModels, setBluePrintModels] = useState<BoolNodeModel[]>([
        new BoolSourceNodeModel({ name: 'Eingang', color: 'rgb(0,192,255)' }),
        new BoolTargetNodeModel({ name: 'Ausgang', color: 'rgb(0,255,192)' })
    ])
    const [activeModel, setActiveModel] = useState<RD.DiagramModel>(engine.getModel())
    const [diagramEngine, setDiagramEngine] = useState(engine)
    //not good practice but is necessary since library only updates object and therefore no statechange happens
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        setActiveModelAndListen(model)
    }, [])


    function setActiveModelAndListen(model: RD.DiagramModel) {
        model.registerListener({
            'nodesUpdated': () => {
                forceUpdate()
            }
        })
        setActiveModel(model)
        diagramEngine.setModel(model)
    }


    function resetModel() {
        setActiveModelAndListen(new RD.DiagramModel())
        diagramEngine.setModel(activeModel)
    }

    function getActiveDiagram(): RD.DiagramModel {
        return activeModel
    }

    function getDiagramEngine(): RD.DiagramEngine {
        return diagramEngine
    }

    function setModel(model: RD.DiagramModel) {
        if (!model) {
            throw new Error("Model must not be null")
        }
        diagramEngine.setModel(model)
        setActiveModelAndListen(model)
    }

    function getBluePrintNodeModels() {
        return bluePrintNodeModels
    }

    function getBluePrintModel(id: string) {
        return bluePrintNodeModels.find(model => model.getID() === id)
    }

    function addBluePrintNodeModel(nodeModel: BoolNodeModel) {
        if (!nodeModel) {
            throw new Error('NodeModel must not be null')
        }
        setBluePrintModels(prev => [...prev, nodeModel])
    }

    function removeBluePrintModel(id: string) {
        setBluePrintModels(prevModels => prevModels.filter((node) => node.getID() !== id))
    }

    const contextValue = {
        resetModel,
        getActiveDiagram,
        getDiagramEngine,
        setModel,
        addBluePrintNodeModel,
        removeBluePrintModel,
        getBluePrintModel,
        getBluePrintNodeModels,
    }

    return (
        <ApplicationContext.Provider value={contextValue}>
            {!!diagramEngine.getModel() && children}
        </ApplicationContext.Provider>
    )
}

export function useApplication() {
    const context = useContext(ApplicationContext)
    if (!context) {
        throw new Error('useApplication must be used within a ApplicationContext')
    }
    return context
}