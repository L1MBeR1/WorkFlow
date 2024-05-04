import React from "react";
import './ResultPanel.css';
import ResultPanelStatus from '../../storages/storeResult';
import { ReactComponent as Close } from './close.svg';

const ResultPanel = () => {
    const { isOpen, setIsOpen } = ResultPanelStatus();

    const panelStyle = {
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
    };
    const close=()=>{
        setIsOpen(false)
    }
    return (
        <div className="resultPanel-wrap" style={panelStyle}>
            <div className="resultPanel">
                <div className="resultPanel-content">
                    <header className="resultPanel-content-header">
                        <div className="resultPanel-close" onClick={close}>
                            <Close className="svg"></Close>
                        </div>
                        <div className="resultPanel-title">
                            Спецификация
                        </div>
                    </header>
                    <hr></hr>
                    <div className="resultPanel-content-specification">
                        <textarea readOnly  className="specification"></textarea>
                        <div className="resultPanel-content-buttons">
                            <button className="resultPanel-content-copy">Скопировать</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultPanel;
