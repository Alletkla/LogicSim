import * as _ from 'lodash';
import TrayWidget from './TrayWidget';
import TrayItemWidget from './TrayItemWidget';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import DemoCanvasWidget from '../helpers/DemoCanvasWidget';
import styled from '@emotion/styled';
import { PropsWithChildren, useEffect } from 'react';
import { useApplication } from '../ApplicationContext';
import ModalDialog from './Modals/ModalDialog';
import { useToast } from './Toast/ToastContext';
import { useTranslation } from 'react-i18next';
import TwoStateSwitcher from './Locale/TwoStateSwitcher';

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
	const toast = useToast()
	const engine = app.getDiagramEngine()
	const { t } = useTranslation()

	useEffect(() => {
		toast.addToast(t('toasts.touch_warning'), "warning", 5000)
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
			result.push(<TrayItemWidget key={model.getID()} model={model}></TrayItemWidget>)
		}
		return result
	}, [])

	const trayItems = app.getBluePrintNodeModels().reduce((result, model) => {
		const type = model.getType()
		if (type === 'boolSource' || type === 'boolTarget') {
			return result
		}
		result.push(<TrayItemWidget key={model.getID()} model={model}></TrayItemWidget>)
		return result
	}, [])

	return (
		<S.Body>
			<div className='position-absolute bottom-0 start-0 m-3 d-flex align-items-end'>
			<TwoStateSwitcher className='me-3' backgrounds={{ "de": "locales/de/flag.png", "en": "locales/en/flag.png" }} states={["de", "en"]} ></TwoStateSwitcher>
				<ModalDialog id={"help"} title={"Help"} size='lg'>
					<h2>{t('help.h_create')}</h2>
					<ol className='fs-5'>
						{(t('help.p_create_listItems', { returnObjects: true }) as string[]).map((val, key) => (
							<li key={key}>{val}</li>
						))}
					</ol>
					<h2>{t('help.h_select')}</h2>
					<p className='fs-5'>{t('help.p_select')}</p>
					<h2>{t('help.h_delete')}</h2>
					<p className='fs-5'>{t('help.p_delete')}</p>
					<h2>{t('help.h_renaming')}</h2>
					<p className='fs-5'>{t('help.p_renaming')}</p>
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
