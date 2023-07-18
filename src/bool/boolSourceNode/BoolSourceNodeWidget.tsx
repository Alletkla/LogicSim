import {
	DefaultPortLabel,
	DiagramEngine,
} from "@projectstorm/react-diagrams";
import { ChangeEvent, Component } from "react";
import { BoolSourceNodeModel } from "./BoolSourceNodeModel";
import styled from '@emotion/styled';
import * as _ from 'lodash'
import BoolPortLabelWidget from "../boolPort/BoolPortLabelWidget";
import BoolNodeWidget, { BoolNodeWidgetProps } from "../boolNode/BoolNodeWidget";
import { BoolNodeModel } from "../boolNode/BoolNodeModel";

export interface BoolSourceNodeWidgetProps {
	node: BoolSourceNodeModel;
	engine: DiagramEngine;
}

export default function BoolSourceNodeWidget(props: BoolSourceNodeWidgetProps) {
	const { node, engine } = props
	const renderIns = false, renderOuts = true, manualActivate = true 
	return (<BoolNodeWidget node={node} engine={engine} renderIns={renderIns} renderOuts={renderOuts} manualActivate={manualActivate} > </BoolNodeWidget>)
}