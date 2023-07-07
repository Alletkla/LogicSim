import { DefaultLinkPointWidget, DefaultLinkSegmentWidget, DiagramEngine, LinkWidget, PointModel } from "@projectstorm/react-diagrams"
import React, { MouseEvent } from "react";
import { BoolLinkModel } from "./BoolLinkModel";

export interface BoolLinkProps {
    link: BoolLinkModel;
    diagramEngine: DiagramEngine;
    pointAdded?: (point: PointModel, event: MouseEvent) => any;
    renderPoints?: boolean;
    selected?: (event: MouseEvent) => any;
	active: boolean
}
export interface BoolLinkState {
    selected: boolean;
    active: boolean;
}

export class BoolLinkWidget extends React.Component<BoolLinkProps, BoolLinkState> {
	refPaths: React.RefObject<SVGPathElement>[];

	constructor(props: BoolLinkProps) {
		super(props);
		this.refPaths = [];
		this.state = {
			selected: false,
            active: props.link.getSourcePort().isActive()
		};
	}

	renderPoints() {
		return this.props.renderPoints ?? true;
	}

	componentDidUpdate(): void {
		this.props.link.setRenderedPaths(
			this.refPaths.map((ref) => {
				return ref.current!;
			})
		);
	}

	componentDidMount(): void {
		this.props.link.setRenderedPaths(
			this.refPaths.map((ref) => {
				return ref.current!;
			})
		);
	}

	componentWillUnmount(): void {
		this.props.link.setRenderedPaths([]);
	}

	addPointToLink(event: MouseEvent, index: number) {
		if (
			!event.shiftKey &&
			!this.props.link.isLocked() &&
			this.props.link.getPoints().length - 1 <= this.props.diagramEngine.getMaxNumberPointsPerLink()
		) {
			const position = this.props.diagramEngine.getRelativeMousePoint(event);
			const point = this.props.link.point(position.x, position.y, index);
			event.persist();
			event.stopPropagation();
			this.forceUpdate(() => {
				this.props.diagramEngine.getActionEventBus().fireAction({
					event,
					model: point
				});
			});
		}
	}

	generatePoint(point: PointModel): JSX.Element {
		let color = this.props.link.getOptions().active ? this.props.link.getOptions().activatedColor : this.props.link.getOptions().color
		return (
			<DefaultLinkPointWidget key={point.getID()} point={point as any} colorSelected={this.props.link.getOptions().selectedColor!} color={color} />
		);
	}

	generateLink(path: string, extraProps: any, id: string | number): JSX.Element {
		const ref = React.createRef<SVGPathElement>();
		this.refPaths.push(ref);
		return (
			<DefaultLinkSegmentWidget
				key={`link-${id}`}
				path={path}
				selected={this.state.selected}
				diagramEngine={this.props.diagramEngine}
				factory={this.props.diagramEngine.getFactoryForLink(this.props.link)}
				link={this.props.link}
				forwardRef={ref}
				onSelection={(selected) => {
					this.setState({ selected: selected });
				}}
				extras={extraProps}
			/>
		);
	}

	render() {
		//ensure id is present for all points on the path
		var points = this.props.link.getPoints();
		var paths = [];
		this.refPaths = [];

		if (points.length === 2) {
			paths.push(
				this.generateLink(
					this.props.link.getSVGPath(),
					{
						onMouseDown: (event: MouseEvent) => {
							this.props.selected?.(event);
							this.addPointToLink(event, 1);
						}
					},
					'0'
				)
			);

			// draw the link as dangeling
			if (this.props.link.getTargetPort() == null) {
				paths.push(this.generatePoint(points[1]));
			}
		} else {
			//draw the multiple anchors and complex line instead
			for (let j = 0; j < points.length - 1; j++) {
				paths.push(
					this.generateLink(
						LinkWidget.generateLinePath(points[j], points[j + 1]),
						{
							'data-linkid': this.props.link.getID(),
							'data-point': j,
							onMouseDown: (event: MouseEvent) => {
								this.props.selected?.(event);
								this.addPointToLink(event, j + 1);
							}
						},
						j
					)
				);
			}

			if (this.renderPoints()) {
				//render the circles
				for (let i = 1; i < points.length - 1; i++) {
					paths.push(this.generatePoint(points[i]));
				}

				if (this.props.link.getTargetPort() == null) {
					paths.push(this.generatePoint(points[points.length - 1]));
				}
			}
		}

		return <g data-default-link-test={this.props.link.getOptions().testName}>{paths}</g>;
	}
}