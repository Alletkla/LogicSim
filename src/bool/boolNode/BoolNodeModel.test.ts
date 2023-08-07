import { beforeEach, describe, expect, test } from "@jest/globals";
import { BoolNodeModel } from "./BoolNodeModel";
import * as _ from 'lodash'
import { NodeSerializeCycle, deserializeNode, diagramEngine } from "../../helpers/testEnv";


let node: BoolNodeModel
beforeEach(() => {
    node = new BoolNodeModel("defaultTest", "rgb(255,255,255)", () => true)
})

function purgeIds(object: any) {
    const purgedObj = { ...object }
    for (let [key, val] of Object.entries(purgedObj)) {
        if (typeof val === 'object') {
            purgedObj[key] = purgeIds(val)
        }
        if (key === 'id') {
            purgedObj[key] = 'purged';
            continue
        }
        if (typeof val === 'string' && !!val.match(/[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{8}/i)) {
            purgedObj[key] = 'purged'
        }
    }
    return purgedObj
}

test('clone', () => {
    node.addInPort("In")
    node.addOutPort("out")

    var clone: BoolNodeModel = node.clone()
    expect(_.isEqual(
        purgeIds(clone.serialize()),
        purgeIds(node.serialize())
    )).toBe(true)
})

describe('serialize tests', () => {
    // let serializedNode: ReturnType<BoolNodeModel['serialize']>
    let deserializedNode: BoolNodeModel

    beforeEach(() => {
        node.addInPort("in")
        node.addOutPort("out")
        const ret = NodeSerializeCycle(BoolNodeModel, node)
        // serializedNode = ret.serializedNode
        deserializedNode = ret.deserializedNode
    })

    test('deserialze', () => {
        //JSON.stringify cause it is not exact equal (caused by arrow functions vs normal functions from deserialize)
        expect(JSON.stringify(deserializedNode.getOptions())).toEqual(JSON.stringify(node.getOptions()))
        expect(deserializedNode.getPorts().length).toBe(node.getPorts().length)
    })
})
