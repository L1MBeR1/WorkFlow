import React, { useState } from 'react';

import './css/componentPanel.css';

import { ReactComponent as Arrow } from './images/panel/arrow.svg';

const LeftPanel = () => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className={`panelDiv ${isVisible ? 'visible' : 'hidden'}`}>
        <div className="panel">
            <div className="content">
                {/* Ваш контент панели */}
                <p>Пример контента</p>
            </div>
        </div>
        <button onClick={toggleVisibility} className="toggle-button">
            <Arrow className={`svg ${isVisible ? 'visibleButton' : 'hiddenButton'}`}/>
        
        </button>
    </div>
  );
};

export default LeftPanel;
