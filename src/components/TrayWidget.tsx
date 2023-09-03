import styled from '@emotion/styled';
import { DiagramModel } from '@projectstorm/react-diagrams';
import { PropsWithChildren } from 'react';
import Dropzone from 'react-dropzone';
import { useApplication } from '../ApplicationContext';
import { WrapperNodeModel } from '../wrapperNode/WrapperNodeModel';
import { useTranslation } from 'react-i18next';

namespace S {
	export const Tray = styled.div`
		min-width: 200px;
	`;

	export const DropZone = styled.button`
		border-style: dashed!important;
	`;
}


export default function TrayWidget(props: PropsWithChildren & { readOnly?: boolean }) {
	const { readOnly = false } = props
	const app = useApplication()
	const { t } = useTranslation()

	function handleLoad(acceptedFiles: File[]) {
		acceptedFiles.map(file => {
			const fileReader = new FileReader()
			fileReader.readAsText(file)
			fileReader.onload = event => {
				const newModel = new DiagramModel()
				newModel.deserializeModel(JSON.parse(event.target.result.toString()), app.getDiagramEngine())
				app.addBluePrintNodeModel(new WrapperNodeModel(file.name.split('.')[0], 'rgb(134,4,80)', newModel))
			}
		})
	}

	return <S.Tray>
		{props.children}
		{!readOnly &&
			<Dropzone onDrop={handleLoad}>
				{({ getRootProps, getInputProps }) => (
					<S.DropZone className='btn btn-outline-success mx-2 mt-2 border border-3 border-success rounded-2'>
						<div {...getRootProps({ className: 'd-flex flex-column justify-content-center' })}>
							<input {...getInputProps()} />
							<span>{t('tray.drag_n_drop')}</span>
							<span className='btn btn-success rounded-circle mx-auto'>+</span>
							<span>{t('tray.or_click')}</span>
						</div>
					</S.DropZone>
				)}
			</Dropzone>}
	</S.Tray>;
}
