import './ModalWindow.sass';
function ModalWindow({textContent, setModal, handleFunction}) {

    return (
        <div className="modal-window">
            <div className="modal-container">
                <p className="modal-text">{textContent}</p>
                <div className="modal-buttons">
                    <button className="btn btn-confirm"
                        onClick={handleFunction}>
                        Підтвердити
                    </button>
                    <button className="btn btn-cancel"
                        onClick={() => setModal(false)}>
                        Скасувати
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ModalWindow;