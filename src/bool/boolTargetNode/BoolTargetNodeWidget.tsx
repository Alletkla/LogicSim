import {
	DiagramEngine,
} from "@projectstorm/react-diagrams";
import * as _ from 'lodash'
import { BoolTargetNodeModel } from "./BoolTargetNodeModel";
import BoolNodeWidget from "../boolNode/BoolNodeWidget";

export interface BoolTargetNodeWidgetProps {
	node: BoolTargetNodeModel;
	engine: DiagramEngine;
	size?: number;
}

export interface BoolTargetNodeWidgetProps {
	node: BoolTargetNodeModel;
	engine: DiagramEngine;
}

export default function BoolTargetNodeWidget(props: BoolTargetNodeWidgetProps) {
	const { node, engine } = props
	const renderIns = true, renderOuts = false, manualActivate = false

	return (<BoolNodeWidget node={node} engine={engine} renderIns={renderIns} renderOuts={renderOuts} manualActivate={manualActivate} > </BoolNodeWidget>)
}
