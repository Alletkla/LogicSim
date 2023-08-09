import { AbstractModelFactory, DiagramEngine } from '@projectstorm/react-diagrams';
import { BoolPortModel } from './BoolPortModel';
export class BoolPortModelFactory extends AbstractModelFactory<BoolPortModel, DiagramEngine> {
    constructor() {
        super('bool');
    }
    generateModel() {
        return new BoolPortModel({
            name: 'unknown'
        });
    }
}