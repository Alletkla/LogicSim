import { MouseEvent, PropsWithChildren, useState } from "react";
import { BaseModel, DiagramModel, LinkModel, NodeModel } from "@projectstorm/react-diagrams";
import { WrapperNodeModel } from "../wrapperNode/WrapperNodeModel";
import { useToast } from "./Toast/ToastContext";
import { useApplication } from "../ApplicationContext";
import HoverActivatedButton from "./Buttons/HoverActivatedButton";
import SaveDialog from "./Modals/SaveDialog";
import { useTranslation } from "react-i18next";

export default function Header(props: PropsWithChildren) {

    const app = useApplication()
    const { addToast } = useToast();
    const [file, setFile] = useState<File>()
    const [isWrapper, setIsWrapper] = useState(false)
    const { t } = useTranslation()

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

    function handleSave(e: MouseEvent<HTMLButtonElement>, fileName: string) {
        const activeModel = app.getActiveDiagram()

        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeModel.serialize()));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${fileName}.json`);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    function handleSaveAndReuse(e: MouseEvent<HTMLButtonElement>, fileName: string) {
        handleSave(e, fileName)
        const wrapperNode = new WrapperNodeModel(fileName, 'rgb(0,100,100)', app.getActiveDiagram())
        app.addBluePrintNodeModel(wrapperNode)
        app.resetModel()
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
            <div className="d-flex mb-2 mt-2 flex-wrap align-items-center">
                <h1 className="mx-3 my-0">Logic-Sim</h1>
                <span className="me-2">Editor:</span>
                <div className="d-flex justify-content-start align-items-center">
                    <div className="me-2 w-50">
                        {/* <label htmlFor="formFileSm" className="form-label">Load File:</label> */}
                        <input className="form-control form-control-sm" id="formFileSm" type="file" onChange={e => setFile(e.target.files[0])} />
                    </div>
                    {/* <div className="form-check me-2">
                        <input className="form-check-input" type="checkbox" value="" onChange={e => setIsWrapper(e.target.checked)} id="flexCheckDefault" />
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                            Load wrapped
                        </label>
                    </div> */}
                    <button className="btn btn-primary" onClick={handleElementLoad}>{t('header.btn_editEl')}</button>
                </div>
                <div className="ms-auto d-flex">
                    {/* <button className='btn btn-secondary ms-auto me-2' onClick={handleSerialize}>Save Element</button> */}
                    <SaveDialog id={"save"} title={"Save"} description={"Speichert die momentan bearbeitete Schaltung."} onButtonClick={handleSave}>
                        <button type="button" className={`btn btn-primary me-2`} data-bs-toggle="modal" data-bs-target={`#save`}>{t('header.save')}</button>
                    </SaveDialog>
                    <SaveDialog id={"save_and_reuse"} title={"Save and Reuse"} description={"Speichert die momentan bearbeitete Schaltung und Stellt sie als Baustein links in der Seitenleise zur Verfügung."} onButtonClick={handleSaveAndReuse}>
                        <button type="button" className={`btn btn-secondary me-2`} data-bs-toggle="modal" data-bs-target={`#save_and_reuse`}>{t('header.save_and_reuse')}</button>
                    </SaveDialog>
                    <span className="vr border-2 me-2" />
                    <HoverActivatedButton onClick={app.resetModel} className="btn btn-secondary me-2">{t('header.clear')}</HoverActivatedButton>
                    <HoverActivatedButton onClick={cloneSelected} className="btn btn-secondary me-2">{t('header.clone_selected')}</HoverActivatedButton>
                </div>
            </div>
        </>
    )
}