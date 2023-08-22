import { beforeEach, describe, expect, test } from "@jest/globals";
import { NodeSerializeCycle, purgeIds } from "../../helpers/testEnv";
import { BoolTargetNodeModel } from "./BoolTargetNodeModel";


let node: BoolTargetNodeModel
beforeEach(() => {
    node = new BoolTargetNodeModel("defaultTest", "rgb(255,255,255)")
})

describe('deserialize', () => {
    test('has same count of ports', () => {
        const { deserializedNode } = NodeSerializeCycle(BoolTargetNodeModel, node)
        expect(Object.values(deserializedNode.getPorts()).length).toBe(2)
        expect(deserializedNode.getInPorts().length).toBe(1)
        expect(deserializedNode.getOutPorts().length).toBe(1)
    })
})

describe('cloning', () => {
    test('same besides id', () => {
        const clone = node.clone() as BoolTargetNodeModel

        expect(purgeIds(clone.serialize())).toStrictEqual(purgeIds(node.serialize()))
    })
})