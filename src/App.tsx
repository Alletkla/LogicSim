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
import TEST from './bool/defaultBoolNodes/test.json'
import { BoolPortModelFactory } from './bool/boolPort/BoolPortModelFactory';
import { ChangeEvent, MouseEvent, useEffect, useReducer, useState } from 'react';
import * as _ from 'lodash'
import { WrapperNodeFactory } from './wrapperNode/WrapperNodeFactory';
import { WrapperNodeModel } from './wrapperNode/WrapperNodeModel';
import { BoolSourceNodeModel } from './bool/boolSourceNode/BoolSourceNodeModel';
import not from './bool/defaultBoolNodes/not';
import and from './bool/defaultBoolNodes/and';
import or from './bool/defaultBoolNodes/or';
import { BoolNodeModel } from './bool/boolNode/BoolNodeModel';
import { BoolTargetNodeModel } from './bool/boolTargetNode/BoolTargetNodeModel';
import { BoolTargetNodeFactory } from './bool/boolTargetNode/BoolTargetNodeFactory';

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
  const [engine, ] = useState(createEngine())
  const [file, setFile] = useState<File>()
  const [model, setModel] = useState(new DiagramModel())
  const [isWrapper, setIsWrapper] = useState(false)
  const [loadDefault,] = useState(true)
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  useEffect(() => {
    engine.getNodeFactories().registerFactory(new BoolNodeFactory())
    engine.getNodeFactories().registerFactory(new BoolSourceNodeFactory())
    engine.getNodeFactories().registerFactory(new BoolTargetNodeFactory())
    engine.getNodeFactories().registerFactory(new WrapperNodeFactory())
    engine.getLinkFactories().registerFactory(new BoolLinkFactory())
    engine.getPortFactories().registerFactory(new BoolPortModelFactory())

    if (loadDefault) {
      model.deserializeModel(XOR as unknown as Serialize, engine)
    }
    if (isWrapper) {
      var outerModel = new DiagramModel()
      /**
       * @TODO non hardcoded Name
       */
      outerModel.addNode(new WrapperNodeModel('xor', 'rgb(0,100,100)', model))
      setModel(outerModel)

      var node1 = new BoolSourceNodeModel({ name: 'Eingang', color: 'rgb(0,192,255)' });
      node1.setPosition(100, 100);
      var node2 = new BoolSourceNodeModel({ name: 'Eingang', color: 'rgb(0,192,255)' });
      node2.setPosition(100, 200);
      var nodeEnd = new BoolTargetNodeModel({ name: 'Ausgang', color: 'rgb(0,255,192)' });
      nodeEnd.setPosition(550, 150);
      outerModel.addAll(node1, node2, nodeEnd)
    }

    if (model.getNodes().length === 0) {
      blankoInit()
    }

    const style = document.createElement("link");
    style.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
    style.rel = "stylesheet"
    document.head.appendChild(style);
    document.body.setAttribute('data-bs-theme', 'dark')
  }, [])

  function blankoInit() {
    //3-A) create a default node
    var node1 = new BoolSourceNodeModel({ name: 'Eingang', color: 'rgb(0,192,255)' });
    node1.setPosition(100, 100);

    var node2 = new BoolSourceNodeModel({ name: 'Eingang', color: 'rgb(0,192,255)' });
    node2.setPosition(100, 200);

    var { node: node3 } = not()
    var { node: node4 } = not()

    var { node: node5 } = and()
    var { node: node6 } = and()

    var { node: node7 } = or()

    //3-B) create another default node
    var nodeEnd = new BoolTargetNodeModel({ name: 'Ausgang', color: 'rgb(0,255,192)' });
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

  }

  engine.setModel(model);
  // console.log(engine.getModel(), engine.getModel().getNodes())

  function handleClick(e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) {
    const fileReader = new FileReader()
    fileReader.readAsText(file)
    fileReader.onload = event => {
      const newModel = new DiagramModel()
      newModel.deserializeModel(JSON.parse(event.target.result.toString()), engine)
      console.log(isWrapper)
      if (isWrapper) {
        var outerModel = new DiagramModel()
        outerModel.addNode(new WrapperNodeModel(file.name.split('.')[0], 'rgb(0,100,100)', newModel))
        setModel(outerModel)
      } else {
        setModel(newModel)
      }

    }
  }

  function handleSerialize(e: MouseEvent<HTMLButtonElement>) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(model.serialize()));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
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
      <div className="d-flex justify-content-around mb-2 mt-2 flex-wrap">
        <div className="d-flex justify-content-start align-items-center">
          <div className="me-2 w-50">
            {/* <label htmlFor="formFileSm" className="form-label">Load File:</label> */}
            <input className="form-control form-control-sm" id="formFileSm" type="file" onChange={e => setFile(e.target.files[0])}/>
          </div>
          <div className="form-check me-2">
            <input className="form-check-input" type="checkbox" value="" onChange={e => setIsWrapper(e.target.checked)} id="flexCheckDefault" />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              Load wrapped
            </label>
          </div>
          <button className="btn btn-primary" onClick={handleClick}>load element</button>
        </div>
        <button className='btn btn-secondary ms-auto me-2' onClick={handleSerialize}>serialize</button>
        <button className='btn btn-secondary' onClick={cloneSelected}>Clone Selected</button>
      </div>
      <CanvasWidget className="diagram-container" engine={engine} />
    </>
  )
}

export default App

