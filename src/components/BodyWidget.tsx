import * as _ from 'lodash';
import TrayWidget from './TrayWidget';
import { TrayItemWidget } from './TrayItemWidget';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import DemoCanvasWidget from '../helpers/DemoCanvasWidget';
import styled from '@emotion/styled';
import { PropsWithChildren, useReducer } from 'react';
import and from '../bool/defaultBoolNodes/and';
import not from '../bool/defaultBoolNodes/not';
import or from '../bool/defaultBoolNodes/or';
import { BoolNodeModel } from '../bool/boolNode/BoolNodeModel';
import { BoolSourceNodeModel } from '../bool/boolSourceNode/BoolSourceNodeModel';
import { BoolTargetNodeModel } from '../bool/boolTargetNode/BoolTargetNodeModel';
import { useApplication } from '../ApplicationContext';

namespace S {
	export const Body = styled.div`
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		min-height: 100%;
	`;

	export const Content = styled.div`
		display: flex;
		flex-grow: 1;
	`;

	export const Layer = styled.div`
		position: relative;
		flex-grow: 1;
	`;

	export const TrayContainer = styled.div`
		max-width: 200px;
	`
}

export default function BodyWidget(props:PropsWithChildren) {
	//not good practice but is necessary from the library
	const [, forceUpdate] = useReducer(x => x + 1, 0);
	const app = useApplication()

	return (
		<S.Body>
			<S.Content>
				<S.TrayContainer className="d-flex flex-column">
					<TrayWidget>
						<TrayItemWidget model={{ type: 'in' }} name="Eingang" color='rgb(0,192,255)' />
						<TrayItemWidget model={{ type: 'out' }} name="Ausgang" color='rgb(0,255,192)' />
					</TrayWidget>
					<hr className="border-2"/>
					<TrayWidget>
						<TrayItemWidget model={{ type: 'and' }} name="AND" color="rgb(192,255,0)" />
						<TrayItemWidget model={{ type: 'not' }} name="NOT" color="rgb(192,255,0)" />
						<TrayItemWidget model={{ type: 'or' }} name="OR" color="rgb(192,255,0)" />
					</TrayWidget>
				</S.TrayContainer>
				<S.Layer
					onDrop={(event) => {
						var data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));

						var node: BoolNodeModel = null;

						switch (data.type) {
							case 'and':
								({ node } = and())
								break;
							case 'not':
								({ node } = not())
								break;
							case 'or':
								({ node } = or())
								break;
							case 'in':
								node = new BoolSourceNodeModel({ name: 'Eingang', color: 'rgb(0,192,255)' });
								break;
							case 'out':
								node = new BoolTargetNodeModel({ name: 'Ausgang', color: 'rgb(0,255,192)' });
								break;
							default:
								break;
						}

						var point = app.getDiagramEngine().getRelativeMousePoint(event);
						node.setPosition(point);
						app.getDiagramEngine().getModel().addNode(node);
						forceUpdate();
					}}
					onDragOver={(event) => {
						event.preventDefault();
					}}
				>
					<DemoCanvasWidget>
						<CanvasWidget engine={app.getDiagramEngine()} />
					</DemoCanvasWidget>
				</S.Layer>
			</S.Content>
		</S.Body>
	);
}
