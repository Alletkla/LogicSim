import {
	DefaultPortLabel,
	DiagramEngine,
} from "@projectstorm/react-diagrams";
import { ChangeEvent, Component } from "react";
import styled from '@emotion/styled';
import * as _ from 'lodash'
import { BoolTargetNodeModel } from "./BoolTargetNodeModel";
import BoolPortLabelWidget from "../boolPort/BoolPortLabelWidget";
import BoolNodeWidget from "../boolNode/BoolNodeWidget";

namespace S {
	export const Node = styled.div<{ background: string; selected: boolean }>`
		background-color: ${(p) => p.background};
		border-radius: 5px;
		font-family: sans-serif;
		color: white;
		border: solid 2px black;
		overflow: visible;
		font-size: 11px;
		border: solid 2px ${(p) => (p.selected ? 'rgb(0,192,255)' : 'black')};
	`;

	export const Title = styled.div`
		background: rgba(0, 0, 0, 0.3);
		display: flex;
		white-space: nowrap;
		justify-items: center;
	`;

	export const TitleName = styled.div`
		flex-grow: 1;
		padding: 5px 5px;
	`;

	export const Ports = styled.div`
		display: flex;
		background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2));
	`;

	export const PortsContainer = styled.div`
		flex-grow: 1;
		display: flex;
		flex-direction: column;

		&:first-of-type {
			margin-right: 10px;
		}

		&:only-child {
			margin-right: 0px;
		}
	`;

	export const PortContainer = styled.div`
		display: flex;
	`
}

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
