import styled from '@emotion/styled';
import { DiagramModel } from '@projectstorm/react-diagrams';
import { PropsWithChildren } from 'react';
import Dropzone from 'react-dropzone';
import { useApplication } from '../ApplicationContext';
import { WrapperNodeModel } from '../wrapperNode/WrapperNodeModel';

namespace S {
	export const Tray = styled.div`
		min-width: 200px;
		// background: rgb(20, 20, 20);
		// flex-grow: 0;
		// flex-shrink: 0;
	`;

	export const DropZone = styled.button`
		border-style: dashed!important;
	`;
}


export default function TrayWidget(props: PropsWithChildren & { readOnly?: boolean }) {
	const { readOnly = false } = props
	const app = useApplication()

	function handleLoad(acceptedFiles: File[]) {
		acceptedFiles.map(file => {
			const fileReader = new FileReader()
			fileReader.readAsText(file)
			fileReader.onload = event => {
				const newModel = new DiagramModel()
				newModel.deserializeModel(JSON.parse(event.target.result.toString()), app.getDiagramEngine())
				// const wrapperModel = new DiagramModel()
				// wrapperModel.addNode(new WrapperNodeModel(file.name.split('.')[0], 'rgb(0,100,100', newModel))
				app.addBluePrintNodeModel(new WrapperNodeModel(file.name.split('.')[0], 'rgb(0,100,100)', newModel))
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
							<span>Drag 'n' drop here</span>
							<span className='btn btn-success rounded-circle mx-auto'>+</span>
							<span>or click to select files</span>
						</div>
					</S.DropZone>
				)}
			</Dropzone>}
	</S.Tray>;
}
