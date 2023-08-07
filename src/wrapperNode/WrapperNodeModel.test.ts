import { beforeEach, describe, expect, test } from "@jest/globals";
import { WrapperNodeModel } from "./WrapperNodeModel";

let node : WrapperNodeModel
beforeEach(() => {
    node = new WrapperNodeModel()
})

describe("correct type-checking on port adding", () => {
    test("in Ports", () => {
        expect(() => node.addInPort("Test", true)).toThrowError()
    })
    test("out Ports", () => {
        expect(() => node.addOutPort("Test", true)).toThrowError()
    })
})