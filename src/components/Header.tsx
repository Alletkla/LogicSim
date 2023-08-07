import { MouseEvent, PropsWithChildren, useReducer, useState } from "react";
import { BaseModel, DiagramModel, LinkModel, NodeModel } from "@projectstorm/react-diagrams";
import { WrapperNodeModel } from "../wrapperNode/WrapperNodeModel";
import { useToast } from "./Toast/ToastContext";
import { useApplication } from "../ApplicationContext";

export default function Header(props: PropsWithChildren) {

    const app = useApplication()
    const { addToast } = useToast();
    const [file, setFile] = useState<File>()
    const [isWrapper, setIsWrapper] = useState(false)

    // useEffect(() => {
    //     const style = document.createElement("link");
    //     style.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
    //     style.rel = "stylesheet"
    //     document.head.appendChild(style);
    //     document.body.setAttribute('data-bs-theme', 'dark')
    // }, [])

    function handleElementLoad(e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) {
        const fileReader = new FileReader()

        if (!file) {
            addToast("Keine Datei zum laden ausgewählt!", 'danger')
            return
        }

        fileReader.readAsText(file)
        fileReader.onload = event => {
            const newModel = new DiagramModel()
            newModel.deserializeModel(JSON.parse(event.target.result.toString()), app.getDiagramEngine())
            if (isWrapper) {
                var outerModel = new DiagramModel()
                outerModel.addNode(new WrapperNodeModel(file.name.split('.')[0], 'rgb(0,100,100)', newModel))
                app.setModel(outerModel)
            } else {
                app.setModel(newModel)
            }
        }
    }

    function handleSerialize(e: MouseEvent<HTMLButtonElement>) {
        const activeModel = app.getActiveDiagram()

        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeModel.serialize()));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "Node.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    function cloneSelected() {
        let offset = { x: 100, y: 100 };
        let model = app.getDiagramEngine().getModel();

        let itemMap = {};
        model.getSelectedEntities().forEach((item: BaseModel<any>) => {
            let newItem = item.clone(itemMap);

            // offset the nodes slightly
            if (newItem instanceof NodeModel) {
                newItem.setPosition(newItem.getX() + offset.x, newItem.getY() + offset.y);
                model.addNode(newItem);
            } else if (newItem instanceof LinkModel) {
                // offset the link points
                newItem.getPoints().forEach((p) => {
                    p.setPosition(p.getX() + offset.x, p.getY() + offset.y);
                });
                model.addLink(newItem);
            }
            (newItem as BaseModel).setSelected(false);
        });
    }

    return (
        <>
            <div className="d-flex mb-2 mt-2 flex-wrap">
                <div className="d-flex justify-content-start align-items-center">
                    <div className="me-2 w-50">
                        {/* <label htmlFor="formFileSm" className="form-label">Load File:</label> */}
                        <input className="form-control form-control-sm" id="formFileSm" type="file" onChange={e => setFile(e.target.files[0])} />
                    </div>
                    <div className="form-check me-2">
                        <input className="form-check-input" type="checkbox" value="" onChange={e => setIsWrapper(e.target.checked)} id="flexCheckDefault" />
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                            Load wrapped
                        </label>
                    </div>
                    <button className="btn btn-primary" onClick={handleElementLoad}>Load Element</button>
                </div>
                <button className='btn btn-secondary ms-auto me-2' onClick={handleSerialize}>Save Element</button>
                <button className='btn btn-secondary' onClick={cloneSelected}>Clone Selected</button>
            </div>
            <div id="toast_container" className="toast-container position-fixed top-0 end-0 p-3">
            </div>
        </>
    )
}