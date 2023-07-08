import createEngine, { 
  DefaultLinkModel, 
  DefaultNodeModel,
  DiagramModel 
} from '@projectstorm/react-diagrams';

import {
  CanvasWidget
} from '@projectstorm/react-canvas-core';

import './App.css'
import { BoolNodeModel } from './boolNode/BoolNodeModel';
import { BoolNodeFactory } from './boolNode/BoolNodeFactory';
import { BoolLinkFactory } from './boolNode/BoolLinkFactory';
import { BoolLinkModel } from './boolNode/BoolLinkModel';

function App() {
const engine = createEngine()

engine.getNodeFactories().registerFactory(new BoolNodeFactory())
engine.getLinkFactories().registerFactory(new BoolLinkFactory())

//2) setup the diagram model
var model = new DiagramModel();

//3-A) create a default node
var node1 = new BoolNodeModel({
  name: 'Node 1',
  color: 'rgb(0,192,255)'
});
node1.setPosition(100, 100);
let port1 = node1.addOutPort('Out');

//3-B) create another default node
var node2 = new BoolNodeModel('Node 2', 'rgb(192,255,0)');
let port2 = node2.addInPort('In');
node2.setPosition(400, 100);

var node3 = new BoolNodeModel('Node 3', 'rgb(192,255,0)');
node3.setPosition(200, 150)
let port3 = node3.addOutPort('Out')
let port4 = node3.addInPort('In')

// link the ports
let link1 = port3.link<BoolLinkModel>(port2);
link1.getOptions().testName = 'Test';
// link1.addLabel('Hello World!');



//4) add the models to the root graph
model.addAll(node1, node2, node3, link1);

//5) load model into engine
engine.setModel(model);

  return (
    <CanvasWidget className="diagram-container" engine={engine} />
  ) 
}

export default App

