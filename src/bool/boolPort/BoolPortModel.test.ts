import { expect, test, beforeEach, describe } from "@jest/globals"
import { BoolPortModel } from "./BoolPortModel"
import { BoolLinkModel } from "../boolLink/BoolLinkModel"
import { BoolNodeModel } from "../boolNode/BoolNodeModel"
import { DefaultPortModelGenerics } from "@projectstorm/react-diagrams"
import * as _ from 'lodash'
import { NodeSerializeCycle } from "../../helpers/testEnv"


let outPort: BoolPortModel
let inPort: BoolPortModel
var link: BoolLinkModel

beforeEach(() => {
    outPort = new BoolPortModel(false, "defaultTestOut")
    inPort = new BoolPortModel(true, "defaultTestIn")
    link = new BoolLinkModel()
})

describe('test constructor overloads', () => {
    test('in Port definition', () => {
        const port1 = new BoolPortModel(true)
        expect(port1.getOptions().in).toBe(true)
        expect(port1.getOptions().name).toBe(port1.getOptions().id)

        const port2 = new BoolPortModel(false)
        expect(port2.getOptions().in).toBe(false)
        expect(port2.getOptions().name).toBe(port2.getOptions().id)
    })
    test('name and label', () => {
        const name = "testName"
        const label = "testLabel"

        const port1 = new BoolPortModel(true, name, label)
        expect(port1.getOptions().name).toBe(name)
        expect(port1.getOptions().label).toBe(label)
    })
    test('with options', () => {
        const options: DefaultPortModelGenerics['OPTIONS'] = {
            name: "testName",
            label: "testLabel",
            in: true,
            id: "testId"
        }

        const port1 = new BoolPortModel(options)
        expect(port1.getOptions().id).toBe(options.id)
        expect(port1.getOptions().name).toBe(options.name)
        expect(port1.getOptions().label).toBe(options.label)
        expect(port1.getOptions().in).toBe(options.in)
    })
})

describe('Link Addition', () => {
    test('adds a link to outPort', () => {
        outPort.addLink(link)
        expect(Object.entries(outPort.getLinks()).length).toBe(1)
        expect(Object.values(outPort.getLinks())[0]).toBe(link)
    })

    test('adds a link to inPort', () => {
        inPort.addLink(link)
        expect(Object.entries(inPort.getLinks()).length).toBe(1)
        expect(Object.values(inPort.getLinks())[0]).toBe(link)
    })
})

describe('activation State Change in all Combinations', () => {
    beforeEach(() => {
        link = new BoolLinkModel()
    })

    test('Activation State Changes on TargetPort = In', () => {
        link.setTargetPort(inPort)
        link.setActive(true)
        expect(inPort.isActive()).toBe(true)
    })

    test('Activation State Changes on SourcePort = In', () => {
        link.setSourcePort(inPort)
        link.setActive(true)
        expect(inPort.isActive()).toBe(true)
    })

    test('Activation State doesnt change on SourcePort = Out', () => {
        link.setSourcePort(outPort)
        link.setActive(true)
        expect(outPort.isActive()).toBe(false)
    })

    test('Activation State doesnt change on Target = Out', () => {
        link.setTargetPort(outPort)
        link.setActive(true)
        expect(outPort.isActive()).toBe(false)
    })
})


//cant be tested individually cause ports depend on nodes
describe('serialize test', () => {

    let origPort: BoolPortModel
    let deserializedPort: BoolPortModel
    let node: BoolNodeModel

    beforeEach(() => {
        link.setTargetPort(inPort)
        link.setSourcePort(outPort)

        node = new BoolNodeModel("defaultTestNode", "rgb(255,255,255)", () => true)

        node.addPort(inPort)
    })

    function seralizeCycle() {
        const { deserializedNode } = NodeSerializeCycle(BoolNodeModel, node)

        origPort = Object.values(node.getPorts())[0] as BoolPortModel
        deserializedPort = Object.values(deserializedNode.getPorts())[0] as BoolPortModel
    }

    test('active state is preserved', () => {
        link.setActive(true)
        seralizeCycle()
        expect(deserializedPort.isActive()).toBe(origPort.isActive())
    })

    //links are not preserved in de-/serialization since its also kept in link layer
    //and from there the source/target ports are added
})