import {
  DefaultPortLabel,
  DiagramEngine,
} from "@projectstorm/react-diagrams";
import { ChangeEvent, Component } from "react";
import { BoolNodeModel } from "./BoolNodeModel";
import { BoolPortModel } from "../boolPort/BoolPortModel";
import styled from '@emotion/styled';
import * as _ from 'lodash'

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

export interface BoolNodeWidgetProps {
  node: BoolNodeModel;
  engine: DiagramEngine;
  size?: number;
}

export class BoolNodeWidget extends Component<BoolNodeWidgetProps> {
  
  handleChange(
    event: ChangeEvent<HTMLInputElement>,
    port: BoolPortModel | null
  ) {
    if (!port) {
      return;
    }

    port.setActive(event.currentTarget.checked)
  }

  generatePort = (port) => {
		return (<DefaultPortLabel engine={this.props.engine} port={port} key={port.getID()} />);
	};

	render() {
		return (
			<S.Node
				data-default-node-name={this.props.node.getOptions().name}
				selected={this.props.node.isSelected()}
				background={this.props.node.getOptions().color}
			>
				<S.Title>
					<S.TitleName>{this.props.node.getOptions().name}</S.TitleName>
				</S.Title>
				<S.Ports>
					<S.PortsContainer>{_.map(this.props.node.getInPorts(), this.generatePort)}</S.PortsContainer>
					<S.PortsContainer>{_.map(this.props.node.getOutPorts(), this.generatePort)}</S.PortsContainer>
				</S.Ports>
			</S.Node>
		);
	}
}
