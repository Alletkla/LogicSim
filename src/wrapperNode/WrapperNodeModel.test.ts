import { beforeEach, describe, expect, test } from "@jest/globals";
import { WrapperNodeModel } from "./WrapperNodeModel";
import { DiagramModel } from "@projectstorm/react-diagrams";
import { BoolSourceNodeModel } from "../bool/boolSourceNode/BoolSourceNodeModel";
import { BoolTargetNodeModel } from "../bool/boolTargetNode/BoolTargetNodeModel";
import { BoolLinkModel } from "../bool/boolLink/BoolLinkModel";
import { BoolPortModel } from "../bool/boolPort/BoolPortModel";
import { BoolNodeModel } from "../bool/boolNode/BoolNodeModel";

let innerModel: DiagramModel
let wrapper: WrapperNodeModel

let sourceNode: BoolSourceNodeModel
let targetNode: BoolSourceNodeModel

let sourceIn0: BoolPortModel
let sourceOut0: BoolPortModel
let targetIn0: BoolPortModel
let targetOut0: BoolPortModel

let wrapperIn0: BoolPortModel
let wrapperOut0: BoolPortModel
beforeEach(() => {
    innerModel = new DiagramModel()
    wrapper = null

    sourceNode = new BoolSourceNodeModel()
    targetNode = new BoolTargetNodeModel()

    sourceIn0 = sourceNode.getInPorts()[0]
    sourceOut0 = sourceNode.getOutPorts()[0]
    targetIn0 = targetNode.getInPorts()[0]
    targetOut0 = targetNode.getOutPorts()[0]

    innerModel.addAll(sourceNode, targetNode, sourceOut0.link(targetIn0))

    wrapper = new WrapperNodeModel("test", "rgb(0,0,0)", innerModel)
    wrapperIn0 = wrapper.getInPorts()[0]
    wrapperOut0 = wrapper.getOutPorts()[0]
})

describe("constructing", () => {
    test("activation fun", () => {
        expect(wrapper.getActivationFun()).toBe(null)
    })

    test("wrapper has only number of inner SourceOutPorts as Input Ports", () => {
        expect(wrapper.getInPorts().length).toBe(1)
    })

    test("wrapper has only number of inner TargetInport as Output Ports", () => {
        expect(wrapper.getOutPorts().length).toBe(1)
    })
})

describe("cloning", () => {
    let clonedWrapper: WrapperNodeModel
    beforeEach(() => {
        clonedWrapper = wrapper.clone()
    })

    test("activation fun", () => {
        expect(clonedWrapper.getOptions().activationFun).toBe(null)
    })

    test("inner model has 1 link", () => {
        expect(clonedWrapper.getOptions().wrappee.getLinks().length).toBe(1)
        // expect(clonedWrapper.getOptions().wrappee.getLinks()[0].listeners).toBe(5)
    })

    test("inner model doesnt change in node count", () => {
        expect(clonedWrapper.getOptions().wrappee.getNodes().length).toBe(wrapper.getOptions().wrappee.getNodes().length)
    })

    test("inner model doesnt change in port count", () => {
        let portCount = 0
        wrapper.getOptions().wrappee.getNodes().forEach((node) => portCount += Object.values(node.getPorts()).length)

        let clonedPortCount = 0
        clonedWrapper.getOptions().wrappee.getNodes().forEach((node) => clonedPortCount += Object.values(node.getPorts()).length)

        expect(portCount).toBe(clonedPortCount)
    })

    //needs to be tested in addition to the normal ports cause they are extra saved in BoolNodeModels
    test("inner model doesnt change in InPort count for BoolNodeModel", () => {
        let inPortCount = 0
        wrapper.getOptions().wrappee.getNodes().forEach((node: BoolNodeModel) => inPortCount += Object.values(node.getInPorts()).length)
        let clonedInPortCount = 0
        clonedWrapper.getOptions().wrappee.getNodes().forEach((node: BoolNodeModel) => clonedInPortCount += Object.values(node.getInPorts()).length)
        expect(inPortCount).toBe(clonedInPortCount)

        let outPortCount = 0
        wrapper.getOptions().wrappee.getNodes().forEach((node: BoolNodeModel) => inPortCount += Object.values(node.getOutPorts()).length)
        let clonedOutPortCount = 0
        clonedWrapper.getOptions().wrappee.getNodes().forEach((node: BoolNodeModel) => clonedInPortCount += Object.values(node.getOutPorts()).length)
        expect(outPortCount).toBe(clonedOutPortCount)
    })

    test("wrapper has only number of inner SourceOutPorts as Input Ports", () => {
        expect(clonedWrapper.getInPorts().length).toBe(1)
    })

    test("wrapper has only number of inner TargetInport as Output Ports", () => {
        expect(clonedWrapper.getOutPorts().length).toBe(1)
    })
})

describe("correct type-checking on port adding", () => {
    test("in Ports", () => {
        expect(() => wrapper.addInPort("Test", true)).toThrowError()
    })
    test("out Ports", () => {
        expect(() => wrapper.addOutPort("Test", true)).toThrowError()
    })
})

describe("correct state handling inside the node", () => {
    test("Input - Output Throughput", () => {
        expect(wrapperOut0.isActive()).toBe(false)
        expect(sourceOut0.isActive()).toBe(false)
        expect(sourceIn0.isActive()).toBe(false)

        const link = new BoolLinkModel()
        link.setTargetPort(wrapperIn0)
        link.setActive(true)

        //this 2 inputs should be the same
        expect(wrapperIn0.isActive()).toBe(true)
        expect(sourceIn0.isActive()).toBe(true)

        //inner convinience check
        expect(sourceOut0.isActive()).toBe(true)
        expect(targetIn0.isActive()).toBe(true)

        //this 2 outputs should be the same
        expect(wrapperOut0.isActive()).toBe(true)
        expect(targetOut0.isActive()).toBe(true)
    })

    test("input - Output Throughput after clone", () => {
        const clonedWrapper = wrapper.clone() as WrapperNodeModel

        const clonedWrapperIn0 = clonedWrapper.getInPorts()[0]
        const clonedWrapperOut0 = clonedWrapper.getOutPorts()[0]

        const clonedSource = clonedWrapper.getOptions().wrappee.getNodes().find(node => node.getType() === "boolSource") as BoolNodeModel
        const clonedSourceIn0 = clonedSource.getInPorts()[0]
        const clonedSourceOut0 = clonedSource.getOutPorts()[0]

        const clonedTarget = clonedWrapper.getOptions().wrappee.getNodes().find(node => node.getType() === "boolTarget") as BoolNodeModel
        const clonedTargetOut0 = clonedTarget.getOutPorts()[0]
        const clonedTargetIn0 = clonedTarget.getInPorts()[0]



        const link = new BoolLinkModel()
        link.setTargetPort(clonedWrapperIn0)
        link.setActive(true)

        //this 2 Inputs should be the same
        expect(clonedWrapperIn0.isActive()).toBe(true)
        expect(clonedSourceIn0.isActive()).toBe(true)

        //inner convinience check
        expect(clonedSourceIn0.isActive()).toBe(true)

        // console.log(clonedSource.getPorts().In)

        expect(clonedSourceOut0.isActive()).toBe(true)
        expect(clonedTargetIn0.isActive()).toBe(true)

        //this 2 Outputs should be the same
        expect(clonedWrapperOut0.isActive()).toBe(true)
        expect(clonedTargetOut0.isActive()).toBe(true)



        // expect(clonedWrapperIn0.getID()).toBe(sourceIn0.getID())
    })
})