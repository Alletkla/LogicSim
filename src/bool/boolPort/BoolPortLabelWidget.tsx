import { DiagramEngine, PortWidget } from '@projectstorm/react-diagrams-core';
import styled from '@emotion/styled';
import { BoolPortModel } from './BoolPortModel';
import { PropsWithChildren, useEffect, useState } from 'react';

interface BoolPortLabelWidgetProps extends PropsWithChildren {
	port: BoolPortModel,
	engine: DiagramEngine,
	manual?: boolean,
}

namespace S {
	export const PortLabel = styled.div`
		display: flex;
		margin-top: 2px;
		margin-bottom: 2px;
		align-items: center;
	`;

	export const Label = styled.div`
		padding: 0 5px;
		flex-grow: 1;
	`;

	//rightshift, down, blur, spread
	export const Port = styled.div`
		width: 20px;
		height: 20px;
		background: rgba(255, 255, 255, 0.5);

		&:hover {
			background: rgb(192, 255, 0);
		}
		&.active {
			box-shadow: 10px 0px 10px -1px #00FF00FF;
		}
	`;
}

export default function BoolPortLabelWidget({
	port,
	engine,
	manual = false
}: BoolPortLabelWidgetProps) {

	const [active, setActive] = useState(port.isActive())

	function handleChange(
		event: React.ChangeEvent<HTMLInputElement>,
		port: BoolPortModel | null
	) {
		if (!port) {
			return;
		}
		port.setActive(event.currentTarget.checked)
		setActive(event.currentTarget.checked)
	}

	const portWidget = (
		<PortWidget engine={engine} port={port}>
			<S.Port className={active ? "active" : ""}/>
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