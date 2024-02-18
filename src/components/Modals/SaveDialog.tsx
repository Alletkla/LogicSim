import { MouseEvent, PropsWithChildren, useState } from "react";
import ModalDialog from "./ModalDialog";
import { t } from "i18next";

export default function SaveDialog(props: PropsWithChildren & {
    id: string
    title: string
    description: string
    onButtonClick?: (e: MouseEvent<HTMLButtonElement>, fileName?: string) => void
}) {
    const [fileName, setFileName] = useState("Untitled")

    const { children, id, title, description, onButtonClick } = props

    return (<>
        <ModalDialog
            id={id}
            title={title}
            onButtonClick={(e) => onButtonClick(e, fileName)}>
            <div className="m-2">{description}</div>
            <input type="text" onChange={(e) => setFileName(e.currentTarget.value)} className="form-control" placeholder={t("dialogs.save.placeholder")} />
        </ModalDialog>
        {children}
    </>
    )
}