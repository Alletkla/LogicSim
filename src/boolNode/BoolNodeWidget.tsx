import {
  DiagramEngine,
  PortModel,
  PortModelAlignment,
  PortWidget,
} from "@projectstorm/react-diagrams";
import { ChangeEvent, Component } from "react";
import { BoolNodeModel } from "./BoolNodeModel";
import { BoolPortModel } from "./BoolPortModel";

export interface BoolNodeWidgetProps {
  node: BoolNodeModel;
  engine: DiagramEngine;
  size?: number;
}

export class BoolNodeWidget extends Component<BoolNodeWidgetProps> {
  handleChange(
    event: ChangeEvent<HTMLInputElement>,
    port: BoolPortModel | null
  ) {
    if (!port) {
      return;
    }

    port.setActive(event.currentTarget.checked)
    console.log("set active")
    this.props.engine.repaintCanvas()
    this.forceUpdate()
  }

  render() {
    return (
      <div className="custom-node">
        <PortWidget
          engine={this.props.engine}
          port={this.props.node.getPort(PortModelAlignment.BOTTOM)!}
        >
          <div className="circle-port" />
        </PortWidget>
        <input
          onChange={(e) =>
            this.handleChange(
              e,
              this.props.node.getPort(PortModelAlignment.BOTTOM)
            )
          }
          type={"checkbox"}
        ></input>
        <div
          className="custom-node-color"
          style={{ backgroundColor: "#000000" }}
        />
      </div>
    );
  }
}
