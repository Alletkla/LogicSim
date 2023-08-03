import { expect, test, beforeEach, describe } from "@jest/globals"
import { BoolPortModel } from "./BoolPortModel"
import { BoolLinkModel } from "../boolLink/BoolLinkModel"

let outPort: BoolPortModel
let inPort: BoolPortModel
var link: BoolLinkModel

beforeEach(() => {
    outPort = new BoolPortModel(false)
    inPort = new BoolPortModel(true)
    link = new BoolLinkModel()
})

test('Port is inPort', () => {
    expect(inPort.getOptions().in).toBe(true)
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

describe('activation State Change', () => {
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