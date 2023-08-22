import { beforeEach, describe, expect, test } from "@jest/globals";
import { BoolLinkModel } from "./BoolLinkModel";
import { BoolPortModel } from "../boolPort/BoolPortModel";

let link: BoolLinkModel
let outPort: BoolPortModel
let inPort: BoolPortModel

//hierarchical, so this is also called on all describe nested tests
beforeEach(() => {
    link = new BoolLinkModel()
    outPort = new BoolPortModel(false, "defaultTestOut")
    inPort = new BoolPortModel(true, "defaultTestIn")
})

test('active state change', () => {
    link.setActive(true)
    expect(link.getOptions().active).toBe(true)
})

describe('activation State in all Combinations', () => {
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

    test('Activation State is copied from added link', () => {
        link.setActive(true)
        link.setTargetPort(inPort)
        expect(inPort.isActive()).toBe(true)
    })
})