import {
    DiagramEngine,
} from "@projectstorm/react-diagrams";
import { PropsWithChildren } from "react";
import * as _ from 'lodash'
import { WrapperNodeModel } from "./WrapperNodeModel";
import BoolNodeWidget from "../bool/boolNode/BoolNodeWidget";


export interface WrapperNodeWidgetProps extends PropsWithChildren {
    node: WrapperNodeModel;
    engine: DiagramEngine;
}

export default function WrapperNodeWidget(props: WrapperNodeWidgetProps) {
    const { node, engine } = props
    const renderIns = true, renderOuts = true, manualActivate = false

    return (<BoolNodeWidget node={node} engine={engine} renderIns={renderIns} renderOuts={renderOuts} manualActivate={manualActivate} > </BoolNodeWidget>)
}
