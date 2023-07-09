import { BoolNodeModel } from "../boolNode/BoolNodeModel"

export default function not(label: string = 'NOT', color: string = 'rgb(192,255,0)') {
    var node = new BoolNodeModel(label, color, (list) => !list[0].active)
    node.setPosition(200, 250)
    const port1 = node.addInPort('In')
    const port2 = node.addOutPort('Out')

    return {node, ports: [port1, port2]}
}