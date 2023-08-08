import { MouseEvent, PropsWithChildren, useState } from "react";

export default function ModalDialog(props: PropsWithChildren & {
    id: string
    title: string
    onButtonClick?: (e: MouseEvent<HTMLButtonElement>) => void
}) {

    const { children, id, title, onButtonClick } = props

    return (<>
        <div className="modal fade" id={id} tabIndex={1}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        {onButtonClick && <button type="button" onClick={onButtonClick} className="btn btn-primary" data-bs-dismiss="modal">{title}</button>}
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}