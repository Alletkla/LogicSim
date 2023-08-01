import './index.scss'
import ReactDOM from 'react-dom/client'
import BodyWidget from './components/BodyWidget'
import Header from './components/Header'
import { ToastProvider } from './components/Toast/ToastContext'
import ApplicationProvider from './ApplicationContext'
import createEngine from '@projectstorm/react-diagrams'
import * as SRD from '@projectstorm/react-diagrams';
import { BoolLinkFactory } from './bool/boolLink/BoolLinkFactory'
import { BoolNodeFactory } from './bool/boolNode/BoolNodeFactory'
import { BoolPortModelFactory } from './bool/boolPort/BoolPortModelFactory'
import { BoolSourceNodeFactory } from './bool/boolSourceNode/BoolSourceNodeFactory'
import { BoolTargetNodeFactory } from './bool/boolTargetNode/BoolTargetNodeFactory'
import { WrapperNodeFactory } from './wrapperNode/WrapperNodeFactory'

const diagramEngine = createEngine()
diagramEngine.getNodeFactories().registerFactory(new BoolNodeFactory())
diagramEngine.getNodeFactories().registerFactory(new BoolSourceNodeFactory())
diagramEngine.getNodeFactories().registerFactory(new BoolTargetNodeFactory())
diagramEngine.getNodeFactories().registerFactory(new WrapperNodeFactory())
diagramEngine.getLinkFactories().registerFactory(new BoolLinkFactory())
diagramEngine.getPortFactories().registerFactory(new BoolPortModelFactory())
/**
 * 
 * @TODO Sidebar with all loaded nodes, clone the clicked node and add it to canvas
 * @TODO Right Click Support for editing Sidebar Nodes
 * @TODO wrapped Node doenst activate properly
 */

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  // <App />
  <ApplicationProvider engine={diagramEngine} model={new SRD.DiagramModel}>
    <ToastProvider>
      <Header></Header>
      <BodyWidget/>
    </ToastProvider>
  </ApplicationProvider>
  // </React.StrictMode>,
)
