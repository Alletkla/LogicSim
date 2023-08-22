import { beforeEach, describe, expect, test } from "@jest/globals";
import { BoolNodeModel, BoolNodeModelActivFuncs } from "./BoolNodeModel";
import * as _ from 'lodash'
import { NodeSerializeCycle, purgeIds } from "../../helpers/testEnv";
import { BoolLinkModel } from "../boolLink/BoolLinkModel";


let nodeModel: BoolNodeModel
beforeEach(() => {
    nodeModel = new BoolNodeModel("defaultTest", "rgb(255,255,255)", () => true)
})

test('clone', () => {
    nodeModel.addInPort("In")
    nodeModel.addOutPort("out")

    var clone: BoolNodeModel = nodeModel.clone()

    expect(clone.getOptions().id).not.toBe(nodeModel.getOptions().id)

    expect(_.isEqual(
        purgeIds(clone.serialize()),
        purgeIds(nodeModel.serialize())
    )).toBe(true)
})

test('througput behaviour on linking', () => {
    const specialNodeModel = new BoolNodeModel("defaultTest", "rgb(255,255,255)", BoolNodeModel.activationFuns[BoolNodeModelActivFuncs.AND])
    const inPort1 = specialNodeModel.addInPort("In")
    const inPort2 = specialNodeModel.addInPort("In2")
    const outPort = specialNodeModel.addOutPort("out")

    const link1 = new BoolLinkModel()
    link1.setActive(true)
    link1.setTargetPort(inPort1)

    const link2 = new BoolLinkModel()
    link2.setActive(true)
    link2.setTargetPort(inPort2)

    expect(inPort1.isActive()).toBe(true)
    expect(inPort2.isActive()).toBe(true)
    expect(outPort.isActive()).toBe(true)
})

describe('serialize tests', () => {
    // let serializedNode: ReturnType<BoolNodeModel['serialize']>
    let deserializedNode: BoolNodeModel

    beforeEach(() => {
        nodeModel.addInPort("in")
        nodeModel.addOutPort("out")
        const ret = NodeSerializeCycle(BoolNodeModel, nodeModel)
        // serializedNode = ret.serializedNode
        deserializedNode = ret.deserializedNode
    })

    test('deserialze', () => {
        //JSON.stringify cause it is not exact equal (caused by arrow functions vs normal functions from deserialize)
        expect(JSON.stringify(deserializedNode.getOptions())).toEqual(JSON.stringify(nodeModel.getOptions()))
        expect(deserializedNode.getPorts().length).toBe(nodeModel.getPorts().length)
    })
})
