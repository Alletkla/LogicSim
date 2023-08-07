import { beforeEach, describe, expect, test } from "@jest/globals";
import { BoolSourceNodeModel } from "./BoolSourceNodeModel";
import { NodeSerializeCycle } from "../../helpers/testEnv";


let node: BoolSourceNodeModel
beforeEach(() => {
    node = new BoolSourceNodeModel("defaultTest", "rgb(255,255,255)")
})

describe('deserialize', () => {
    test('has same count of ports', () => {
        const { serializedNode, deserializedNode } = NodeSerializeCycle(BoolSourceNodeModel, node)
        console.log("Source", serializedNode)
        console.log("deserialized", deserializedNode.getPorts())
        expect(Object.values(deserializedNode.getPorts()).length).toBe(2)
        expect(deserializedNode.getInPorts().length).toBe(1)
        expect(deserializedNode.getOutPorts().length).toBe(1)
    })
})