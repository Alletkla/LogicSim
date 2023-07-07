import { DefaultLinkFactory } from "@projectstorm/react-diagrams";
import { BoolLinkModel } from "./BoolLinkModel";
import { BoolLinkWidget } from "./BoolLinkWidget";
import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';

namespace S {
	export const Keyframes = keyframes`
		from {
			stroke-dashoffset: 24;
		}
		to {
			stroke-dashoffset: 0;
		}
	`;

	const selected = css`
		stroke-dasharray: 10, 2;
		animation: ${Keyframes} 1s linear infinite;
	`;

	export const Path = styled.path<{ selected: boolean }>`
		${(p) => p.selected && selected};
		fill: none;
		pointer-events: auto;
	`;
}

export class BoolLinkFactory extends DefaultLinkFactory {
	constructor() {
		super('bool');
	}

	generateReactWidget(event: any) {
        return <BoolLinkWidget link={event.model} diagramEngine={this.engine} active={event.model.isActive()}/>
    }

	generateModel(): BoolLinkModel {
		return new BoolLinkModel();
	}

	generateLinkSegment(model: BoolLinkModel, selected: boolean, path: string) {
		let color = model.getOptions().active ? model.getOptions().activatedColor : model.getOptions().color
		console.log("model", model, "active:", model.active, color)
		return (
			<S.Path
				selected={selected}
				stroke={selected ? model.getOptions().selectedColor : color}
				strokeWidth={model.getOptions().width}
				d={path}
			/>
		);
	}
}