import * as React from 'react';
import styled from '@emotion/styled';

export interface TrayItemWidgetProps extends React.PropsWithChildren {
	model: { id: string };
	color?: string;
	name: string;
}

namespace S {
	export const Tray = styled.div<{ color: string }>`
		color: white;
		font-family: Helvetica, Arial;
		padding: 5px;
		margin: 0px 10px;
		border: solid 1px ${(p) => p.color};
		border-radius: 5px;
		margin-bottom: 2px;
		cursor: pointer;
	`;
}

export default function TrayItemWidget(props: TrayItemWidgetProps) {
	return (
		<S.Tray
			color={props.color}
			draggable={true}
			onDragStart={(event) => {
				event.dataTransfer.setData('storm-diagram-node', JSON.stringify(props.model.id));
			}}
			className="tray-item"
		>
			{props.name}
		</S.Tray>
	);
}
