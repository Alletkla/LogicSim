import { PropsWithChildren, createContext, useContext, useEffect } from "react";
import * as RD from '@projectstorm/react-diagrams';
import { BoolNodeModel } from "./bool/boolNode/BoolNodeModel";

interface ApplicationContextProps {
    resetModel: () => void
    getActiveDiagram: () => RD.DiagramModel
    getDiagramEngine: () => RD.DiagramEngine
    setModel: (model: RD.DiagramModel) => void
}

const ApplicationContext = createContext<ApplicationContextProps>(null)

//put the fields in a closure, that they cant be directly modified
function createApplicationProvider(){
 let activeModel: RD.DiagramModel
 let diagramEngine: RD.DiagramEngine
 let bluePrintNodeModels: BoolNodeModel[]

 const provider = ({children, engine, model}:PropsWithChildren & {engine: RD.DiagramEngine, model: RD.DiagramModel}) => {
    diagramEngine = engine
    diagramEngine.setModel(model)
    
    function resetModel(){
        activeModel = new RD.DiagramModel()
        diagramEngine.setModel(activeModel)
    }

    function getActiveDiagram(): RD.DiagramModel {
        return activeModel
    }

    function getDiagramEngine(): RD.DiagramEngine {
        return diagramEngine
    }

    function setModel(model: RD.DiagramModel) {
        if (!model){
            throw new Error("Model must not be null")
        }
        this.activeModel = model
    }

    function getBluePrintNodeModels(){
        return bluePrintNodeModels
    }

    function addBluePrintNodeModel(nodeModel: BoolNodeModel){
        if (!nodeModel){
            throw new Error('NodeModel must not be null')
        }
        bluePrintNodeModels.push(nodeModel)
    }

    const contextValue = {
        resetModel,
        getActiveDiagram,
        getDiagramEngine,
        setModel,
        getBluePrintNodeModels,
        addBluePrintNodeModel
    }

    return (
        <ApplicationContext.Provider value={contextValue}>
            {children}
        </ApplicationContext.Provider>
    )
 }

 return provider
}

export function useApplication(){
    const context = useContext(ApplicationContext)
    if (!context) {
        throw new Error('useApplication must be used within a ApplicationContext')
    }
    return context
}

const ApplicationProvider = createApplicationProvider()
export default ApplicationProvider