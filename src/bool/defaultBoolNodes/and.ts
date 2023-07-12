import { BoolNodeModel, BoolNodeModelActivFuncs } from "../boolNode/BoolNodeModel"

export default function and(label: string = 'AND', color: string = 'rgb(192,255,0)') {
    var node = new BoolNodeModel(label, color, BoolNodeModelActivFuncs.AND)
    node.setPosition(200, 150)
    const port1 = node.addInPort('In1')
    const port2 = node.addInPort('In2')
    const port3 = node.addOutPort('Out')

    return {node, ports: [port1, port2, port3]}
}