import { BaseEvent, DefaultLabelModel, DefaultLinkModelListener, DefaultLinkModelOptions, DeserializeEvent, LabelModel, LinkModel, LinkModelGenerics, ListenerHandle, PortModel, PortModelAlignment, PortModelGenerics } from "@projectstorm/react-diagrams";
import { BezierCurve } from '@projectstorm/geometry';
import { BoolPortModel } from "../boolPort/BoolPortModel";

export interface BoolLinkModelOptions extends DefaultLinkModelOptions {
	activatedColor?: string;
	active?: boolean;
}

export interface BoolLinkModelListener extends DefaultLinkModelListener {
	activeChanged?(event: BaseEvent & {
		isActive: boolean;
	}): void;
}


export interface BoolLinkModelGenerics extends LinkModelGenerics {
	LISTENER: DefaultLinkModelListener;
	OPTIONS: BoolLinkModelOptions;
}


export class BoolLinkModel extends LinkModel<BoolLinkModelGenerics> {
	constructor(options: BoolLinkModelOptions = {}) {
		super({
			type: 'bool',
			width: options.width || 3,
			color: options.color || 'rgb(255,0,0)',
			selectedColor: options.selectedColor || 'rgb(0,192,255)',
			curvyness: 50,
			...options
		});
		this.options.activatedColor = options.activatedColor || 'rgb(0,255,0)',
			this.options.active = options.active || this.getSourcePort()?.isActive() || false
	}

	calculateControlOffset(port: PortModel): [number, number] {
		if (port.getOptions().alignment === PortModelAlignment.RIGHT) {
			return [this.options.curvyness, 0];
		} else if (port.getOptions().alignment === PortModelAlignment.LEFT) {
			return [-this.options.curvyness, 0];
		} else if (port.getOptions().alignment === PortModelAlignment.TOP) {
			return [0, -this.options.curvyness];
		}
		return [0, this.options.curvyness];
	}

	getSVGPath(): string {
		if (this.points.length == 2) {
			const curve = new BezierCurve();
			curve.setSource(this.getFirstPoint().getPosition());
			curve.setTarget(this.getLastPoint().getPosition());
			curve.setSourceControl(this.getFirstPoint().getPosition().clone());
			curve.setTargetControl(this.getLastPoint().getPosition().clone());

			if (this.sourcePort) {
				curve.getSourceControl().translate(...this.calculateControlOffset(this.getSourcePort()));
			}

			if (this.targetPort) {
				curve.getTargetControl().translate(...this.calculateControlOffset(this.getTargetPort()));
			}
			return curve.getSVGCurve();
		}
	}
	//TODO (look at DefaultLinkModel.js)
	override serialize() {
		return {
			...super.serialize(),
			width: this.options.width,
			color: this.options.color,
			curvyness: this.options.curvyness,
			selectedColor: this.options.selectedColor
		};
	}
	//TODO (look at DefaultLinkModel.js)
	override deserialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
		this.options.color = event.data.color;
		this.options.width = event.data.width;
		this.options.curvyness = event.data.curvyness;
		this.options.selectedColor = event.data.selectedColor;
	}

	override addLabel(label: LabelModel | string) {
		if (label instanceof LabelModel) {
			return super.addLabel(label);
		}
		let labelOb = new DefaultLabelModel();
		labelOb.setLabel(label);
		return super.addLabel(labelOb);
	}

	setWidth(width: number) {
		this.options.width = width;
		this.fireEvent({ width }, 'widthChanged');
	}

	setColor(color: string) {
		this.options.color = color;
		this.fireEvent({ color }, 'colorChanged');
	}

	setActive(active: boolean) {
		this.options.active = active

		const sourcePort = this.getSourcePort()
		if (sourcePort && sourcePort.getOptions().in) {
			sourcePort.setActive(active)
			return
		}

		const targetPort = this.getTargetPort()
		if (targetPort && targetPort.getOptions().in) {
			targetPort.setActive(active)
		}

		this.fireEvent({ isActive: active }, 'activeChanged')
	}

	override getSourcePort(): BoolPortModel | null {
		return super.getSourcePort() as BoolPortModel
	}

	override getTargetPort(): BoolPortModel | null {
		return super.getTargetPort() as BoolPortModel
	}

	override registerListener(listener: BoolLinkModelListener): ListenerHandle {
		return super.registerListener(listener)
	}

	override setSourcePort(port: BoolPortModel): void {
		super.setSourcePort(port)

		if (port.getOptions().in) {
			port.setActive(this.isActive())
		}else{
			this.setActive(port.isActive())
		}
	}

	override setTargetPort(port: BoolPortModel): void {
		super.setTargetPort(port)

		if (port.getOptions().in) {
			port.setActive(this.isActive())
		}
	}

	isActive() {
		return this.getOptions().active
	}
}

