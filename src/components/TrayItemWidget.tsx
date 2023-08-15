import styled from '@emotion/styled';
import { KeyboardEvent, PropsWithChildren, useState } from 'react';
import { BoolNodeModel } from '../bool/boolNode/BoolNodeModel';

export interface TrayItemWidgetProps extends PropsWithChildren {
	model: BoolNodeModel;
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

	const modelOptions = props.model.getOptions()

	const [editMode, setEditMode] = useState(false)
	const [name, setName] = useState(modelOptions.name)
	
	const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
		const val = e.currentTarget.value

		modelOptions.name = val
		setName(val)
	}
	const handleKeyDown = (e:KeyboardEvent) => {
		if (e.key === 'Enter') {
			setEditMode(false)
		}
	}

	let child: React.JSX.Element
	if (editMode) {
		child = <input autoFocus className='w-100' value={name} onChange={handleChange} onKeyDown={handleKeyDown} onBlur={() => setEditMode(false)}></input>
	} else {
		child = <span>{name}</span>
	}

	return (
		<S.Tray
			color={modelOptions.color}
			draggable={true}
			onDragStart={(event) => {
				event.dataTransfer.setData('storm-diagram-node', JSON.stringify(modelOptions.id));
			}}
			onDoubleClick={(e) => { setEditMode(true)}}
			className="tray-item"
		>
			{child}
		</S.Tray>
	);
}
