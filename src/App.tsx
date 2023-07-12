import createEngine, {
  BaseModel, DiagramModel, LinkModel, NodeModel
} from '@projectstorm/react-diagrams';

import {
  CanvasWidget
} from '@projectstorm/react-canvas-core';

import './App.css'
import { BoolNodeFactory } from './bool/boolNode/BoolNodeFactory';
import { BoolLinkFactory } from './bool/boolLink/BoolLinkFactory';
import { BoolSourceNodeFactory } from './bool/boolSourceNode/BoolSourceNodeFactory';
import XOR from './bool/defaultBoolNodes/XOR.json'
import { BoolPortModelFactory } from './bool/boolPort/BoolPortModelFactory';
import { ChangeEvent, MouseEvent, useEffect, useReducer, useState } from 'react';
import * as _ from 'lodash'

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
  const [engine, setEngine] = useState(createEngine())
  const [model, setModel] = useState(new DiagramModel())
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  useEffect(() => {
    engine.getNodeFactories().registerFactory(new BoolNodeFactory())
    engine.getNodeFactories().registerFactory(new BoolSourceNodeFactory())
    engine.getLinkFactories().registerFactory(new BoolLinkFactory())
    engine.getPortFactories().registerFactory(new BoolPortModelFactory())

    model.deserializeModel(XOR as unknown as Serialize, engine)
    setModel(model)

    const style = document.createElement("link");
    style.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
    style.rel = "stylesheet"
    document.head.appendChild(style);
    document.body.setAttribute('data-bs-theme', 'dark')

  }, [])

  engine.setModel(model);

  // //3-A) create a default node
  // var node1 = new BoolSourceNodeModel({ name: 'Eingang', color: 'rgb(0,192,255)' });
  // node1.setPosition(100, 100);
  // let port1 = node1.addOutPort('Out');

  // var node2 = new BoolSourceNodeModel({ name: 'Eingang', color: 'rgb(0,192,255)' });
  // node2.setPosition(100, 200);
  // let port2 = node2.addOutPort('Out');

  // var { node: node3 } = not()
  // var { node: node4 } = not()

  // var { node: node5 } = and()
  // var { node: node6 } = and()

  // var { node: node7 } = or()

  // //3-B) create another default node
  // var nodeEnd = new BoolNodeModel({ name: 'Ausgang', color: 'rgb(0,255,192)' });
  // let portEnd = nodeEnd.addInPort('In');
  // nodeEnd.setPosition(550, 150);

  // // link the ports
  // model.addAll(
  //   // port1.link<BoolLinkModel>(port4),
  //   // port2.link<BoolLinkModel>(port5),
  //   // port3.link<BoolLinkModel>(portEnd),
  //   // port3.link<BoolLinkModel>(port6),
  //   // port1.link<BoolLinkModel>(port6),
  //   // port7.link<BoolLinkModel>(portEnd)
  // )

  // //4) add the models to the root graph
  // model.addAll(node1, node2, node3, node4, node5, node6, node7, nodeEnd);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const fileReader = new FileReader()
    fileReader.readAsText(e.target.files[0], 'UTF-8')
    fileReader.onload = event => {
      const newModel = new DiagramModel()
      newModel.deserializeModel(JSON.parse(event.target.result.toString()), engine)
      setModel(newModel)
    }
  }

  function handleSerialize(e: MouseEvent<HTMLButtonElement>) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(model.serialize()));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "Node.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  function cloneSelected() {
		let offset = { x: 100, y: 100 };
		let model = engine.getModel();

		let itemMap = {};
		_.forEach(model.getSelectedEntities(), (item: BaseModel<any>) => {
			let newItem = item.clone(itemMap);

			// offset the nodes slightly
			if (newItem instanceof NodeModel) {
				newItem.setPosition(newItem.getX() + offset.x, newItem.getY() + offset.y);
				model.addNode(newItem);
			} else if (newItem instanceof LinkModel) {
				// offset the link points
				newItem.getPoints().forEach((p) => {
					p.setPosition(p.getX() + offset.x, p.getY() + offset.y);
				});
				model.addLink(newItem);
			}
			(newItem as BaseModel).setSelected(false);
		});
    
    forceUpdate()
	}

  return (
    <>
    <div className="d-flex justify-content-around">
      <input type="file" onChange={handleChange} />
      <button onClick={handleSerialize}>serialize</button>
      <button onClick={cloneSelected}>Clone Selected</button>
      </div>
      <CanvasWidget className="diagram-container" engine={engine} />
    </>
  )
}

export default App

