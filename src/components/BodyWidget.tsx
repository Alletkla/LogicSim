import * as _ from 'lodash';
import TrayWidget from './TrayWidget';
import TrayItemWidget from './TrayItemWidget';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import DemoCanvasWidget from '../helpers/DemoCanvasWidget';
import styled from '@emotion/styled';
import { PropsWithChildren, useEffect } from 'react';
import { useApplication } from '../ApplicationContext';
import and from '../bool/defaultBoolNodes/and';
import not from '../bool/defaultBoolNodes/not';
import or from '../bool/defaultBoolNodes/or';
import ModalDialog from './Modals/ModalDialog';

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

export default function BodyWidget(props: PropsWithChildren) {
	//not good practice but is necessary since library only updates object 
	const app = useApplication()
	const engine = app.getDiagramEngine()

	useEffect(() => {
		app.addBluePrintNodeModel(and().node)
		app.addBluePrintNodeModel(not().node)
		app.addBluePrintNodeModel(or().node)
	}, [])

	function handleDrop(event: React.DragEvent<HTMLDivElement>) {
		var id = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
		const model = app.getBluePrintModel(id)
		const clone = model.clone()

		var point = app.getDiagramEngine().getRelativeMousePoint(event);
		clone.setPosition(point);
		app.getDiagramEngine().getModel().addNode(clone);
	}

	const specialTrayItems = app.getBluePrintNodeModels().reduce((result, model) => {
		const type = model.getType()
		if (type === 'boolSource' || type === 'boolTarget') {
			result.push(<TrayItemWidget key={model.getID()} model={{ 'id': model.getID() }} name={model.getOptions().name} color={model.getOptions().color}></TrayItemWidget>)
		}
		return result
	}, [])

	const trayItems = app.getBluePrintNodeModels().reduce((result, model) => {
		const type = model.getType()
		if (type === 'boolSource' || type === 'boolTarget') {
			return result
		}
		result.push(<TrayItemWidget key={model.getID()} model={{ 'id': model.getID() }} name={model.getOptions().name} color={model.getOptions().color}></TrayItemWidget>)
		return result
	}, [])

	return (
		<S.Body>
			<div className='position-absolute bottom-0 start-0 m-3'>
				<ModalDialog id={"help"} title={"Help"}>
					You can select multiple nodes and especially links by pressing [SHIFT] while holding down the left mouse button.
				</ModalDialog>
				<button type="button" className={`fs-1 btn btn-primary me-2 rounded-circle`} data-bs-toggle="modal" data-bs-target={`#help`}>?</button>
			</div>
			<S.Content>
				<S.TrayContainer className="d-flex flex-column">
					<TrayWidget readOnly={true}>
						{specialTrayItems}
					</TrayWidget>
					<hr className="border-2" />
					<TrayWidget>
						{trayItems}
					</TrayWidget>
				</S.TrayContainer>
				<S.Layer
					onDrop={handleDrop}
					onDragOver={(event) => {
						event.preventDefault();
					}}
				>
					<DemoCanvasWidget>
						<CanvasWidget engine={engine} />
					</DemoCanvasWidget>
				</S.Layer>
			</S.Content>
		</S.Body>
	);
}
