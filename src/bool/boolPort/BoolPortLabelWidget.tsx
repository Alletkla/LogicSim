import * as React from 'react';
import { DiagramEngine, PortWidget } from '@projectstorm/react-diagrams-core';
import styled from '@emotion/styled';
import { BoolPortModel } from './BoolPortModel';

interface BoolPortLabelWidgetProps extends React.PropsWithChildren<any> {
	port: BoolPortModel,
	engine: DiagramEngine,
	manual?: boolean,
}

namespace S {
	export const PortLabel = styled.div`
		display: flex;
		margin-top: 1px;
		align-items: center;
	`;

	export const Label = styled.div`
		padding: 0 5px;
		flex-grow: 1;
	`;

	export const Port = styled.div`
		width: 15px;
		height: 15px;
		background: rgba(255, 255, 255, 0.1);

		&:hover {
			background: rgb(192, 255, 0);
		}
	`;
}

export default function BoolPortLabelWidget({
	port,
	engine,
	manual = false
}: BoolPortLabelWidgetProps) {

	function handleChange(
		event: React.ChangeEvent<HTMLInputElement>,
		port: BoolPortModel | null
	) {
		if (!port) {
			return;
		}
		port.setActive(event.currentTarget.checked)
	}

	const portWidget = (
		<PortWidget engine={engine} port={port}>
			<S.Port />
		</PortWidget>
	);
	const label = <S.Label>{port.getOptions().label}</S.Label>;

	const checkbox =
		(<input
			onChange={(e) =>
				handleChange(
					e,
					port
				)
			}
			type={"checkbox"}
		>
		</input>)

	return (
		<S.PortLabel>
			{manual && checkbox}
			{port.getOptions().in ? portWidget : label}
			{port.getOptions().in ? label : portWidget}
		</S.PortLabel>
	);
}


// export class BoolPortLabelWidget extends React.Component<BoolPortLabelWidgetProps> {

// 	constructor(props: BoolPortLabelWidgetProps){
// 		const testObj = Object.assign({manual: false}, props)
// 		console.log(testObj)
// 		super(testObj)
// 	}

// 	handleChange(
// 		event: React.ChangeEvent<HTMLInputElement>,
// 		port: BoolPortModel | null
// 	) {
// 		if (!port) {
// 			return;
// 		}

// 		port.setActive(event.currentTarget.checked)
// 	}

// 	render() {
// 		const port = (
// 			<PortWidget engine={this.props.engine} port={this.props.port}>
// 				<S.Port />
// 			</PortWidget>
// 		);
// 		const label = <S.Label>{this.props.port.getOptions().label}</S.Label>;

// 		const checkbox =
// 			(<input
// 				onChange={(e) =>
// 					this.handleChange(
// 						e,
// 						this.props.port
// 					)
// 				}
// 				type={"checkbox"}
// 			>
// 			</input>)

// 		return (
// 			<S.PortLabel>
// 				{this.props.manual && checkbox}
// 				{this.props.port.getOptions().in ? port : label}
// 				{this.props.port.getOptions().in ? label : port}
// 			</S.PortLabel>
// 		);
// 	}
// }