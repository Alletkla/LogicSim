import createEngine, {
  DiagramModel
} from '@projectstorm/react-diagrams';

import {
  CanvasWidget
} from '@projectstorm/react-canvas-core';

import './App.css'
import { BoolNodeModel } from './bool/boolNode/BoolNodeModel';
import { BoolNodeFactory } from './bool/boolNode/BoolNodeFactory';
import { BoolLinkFactory } from './bool/boolLink/BoolLinkFactory';
import { BoolLinkModel } from './bool/boolLink/BoolLinkModel';
import { BoolSourceNodeFactory } from './bool/boolSourceNode/BoolSourceNodeFactory';
import { BoolSourceNodeModel } from './bool/boolSourceNode/BoolSourceNodeModel';
import or from './bool/defaultBoolNodes/or';
import not from './bool/defaultBoolNodes/not';
import and from './bool/defaultBoolNodes/and';
import XOR from './bool/defaultBoolNodes/XOR.json'
import { BoolPortModelFactory } from './bool/boolPort/BoolPortModelFactory';

interface Serialize {
  offsetX: number;
  offsetY: number;
  zoom: number;
  gridSize: number;
  layers: {
      isSvg: boolean;
      transformed: boolean;
      models: {
          [x: string]: {
              type: string;
              selected: boolean;
              extras: any;
              id: string;
              locked: boolean;
          };
      };
      type: string;
      selected: boolean;
      extras: any;
      id: string;
      locked: boolean;
  }[];
  id: string;
  locked: boolean;
}

function App() {
  const engine = createEngine()

  engine.getNodeFactories().registerFactory(new BoolNodeFactory())
  engine.getNodeFactories().registerFactory(new BoolSourceNodeFactory())
  engine.getLinkFactories().registerFactory(new BoolLinkFactory())
  engine.getPortFactories().registerFactory(new BoolPortModelFactory())

  //2) setup the diagram model
  var model = new DiagramModel();

  //3-A) create a default node
  var node1 = new BoolSourceNodeModel({ name: 'Eingang', color: 'rgb(0,192,255)' });
  node1.setPosition(100, 100);
  let port1 = node1.addOutPort('Out');

  var node2 = new BoolSourceNodeModel({ name: 'Eingang', color: 'rgb(0,192,255)' });
  node2.setPosition(100, 200);
  let port2 = node2.addOutPort('Out');

  var { node: node3 } = not()
  var { node: node4 } = not()

  var { node: node5 } = and()
  var { node: node6 } = and()

  var { node: node7 } = or()

  //3-B) create another default node
  var nodeEnd = new BoolNodeModel({ name: 'Ausgang', color: 'rgb(0,255,192)' });
  let portEnd = nodeEnd.addInPort('In');
  nodeEnd.setPosition(550, 150);

  // link the ports
  model.addAll(
    // port1.link<BoolLinkModel>(port4),
    // port2.link<BoolLinkModel>(port5),
    // port3.link<BoolLinkModel>(portEnd),
    // port3.link<BoolLinkModel>(port6),
    // port1.link<BoolLinkModel>(port6),
    // port7.link<BoolLinkModel>(portEnd)
  )

  //4) add the models to the root graph
  model.addAll(node1, node2, node3, node4, node5, node6, node7, nodeEnd);

  const model2 = new DiagramModel()

  model2.deserializeModel(XOR as unknown as Serialize, engine)

  //5) load model into engine
  engine.setModel(model2);

  return (
    <>
      <textarea id='text'></textarea>
      <button onClick={() => console.log(JSON.stringify(model.serialize()))}>serialize</button>
      <CanvasWidget className="diagram-container" engine={engine} />
    </>
  )
}

export default App

