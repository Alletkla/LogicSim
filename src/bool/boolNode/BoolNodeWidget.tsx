import { DiagramEngine, } from "@projectstorm/react-diagrams";
import { BoolNodeModel } from "./BoolNodeModel";
import styled from '@emotion/styled';
import * as _ from 'lodash'
import BoolPortLabelWidget from "../boolPort/BoolPortLabelWidget";

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
}

export interface BoolNodeWidgetProps extends React.PropsWithChildren<any> {
	node: BoolNodeModel;
	engine: DiagramEngine;
	renderIns?: boolean;
	renderOuts?: boolean;
	manualActivate?: boolean;
	className?: string
}

export default function BoolNodeWidget(props: BoolNodeWidgetProps) {
	const { node, engine, renderIns = true, renderOuts = true, manualActivate = false, className } = props

	function generatePort(port) {
		return (<BoolPortLabelWidget engine={engine} port={port} key={port.getID()} manual={manualActivate} />);
	}

	return (
		<S.Node
			data-default-node-name={node.getOptions().name}
			selected={node.isSelected()}
			background={node.getOptions().color}
			className={className}
		>
			<S.Title>
				<S.TitleName>{node.getOptions().name}</S.TitleName>
			</S.Title>
			<S.Ports>
				<S.PortsContainer>{renderIns && _.map(node.getInPorts(), generatePort)}</S.PortsContainer>
				<S.PortsContainer>{renderOuts && _.map(node.getOutPorts(), generatePort)}</S.PortsContainer>
			</S.Ports>
		</S.Node>
	);
}
