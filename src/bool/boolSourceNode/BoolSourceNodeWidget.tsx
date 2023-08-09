import {
	DiagramEngine,
} from "@projectstorm/react-diagrams";
import { BoolSourceNodeModel } from "./BoolSourceNodeModel";
import * as _ from 'lodash'
import BoolNodeWidget from "../boolNode/BoolNodeWidget";

export interface BoolSourceNodeWidgetProps {
	node: BoolSourceNodeModel;
	engine: DiagramEngine;
}

export default function BoolSourceNodeWidget(props: BoolSourceNodeWidgetProps) {
	const { node, engine } = props
	const renderIns = false, renderOuts = true, manualActivate = true
	return (<BoolNodeWidget node={node} engine={engine} renderIns={renderIns} renderOuts={renderOuts} manualActivate={manualActivate} > </BoolNodeWidget>)
}