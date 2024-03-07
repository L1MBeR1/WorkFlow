import React, { useState } from 'react';
import { ReactComponent as Arrow } from './images/panel/arrow.svg';
import './css/componentPanel.css';

const LeftPanel = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState(null);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleComponentClick = (component) => {
    setSelectedComponent(component === selectedComponent ? null : component);
    console.log(selectedComponent)
    console.log(component)
  };

  const componentsData = [
    {
      id: "1",
      название: "UserService",
      функции: [
        { id: "1", название: "getUser", описание: "Получить информацию о пользователе." },
        { id: "2", название: "createUser", описание: "Создать нового пользователя." }
      ]
    },
    {
      id: "2",
      название: "ProductService",
      функции: [
        { id: "1", название: "getProduct", описание: "Получить информацию о продукте." },
        { id: "2", название: "createProduct", описание: "Создать новый продукт." }
      ]
    }
  ];

  return (
    <div className={`panelDiv ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="panel">
        <div className="content">
          <p>Компоненты</p>
          <hr />
          <div className="components">
            {componentsData.map(component => (
              <div key={component.id} className="component" onClick={() => handleComponentClick(component)}>
                <p>{component.название}</p>
                {selectedComponent && selectedComponent.id === component.id && (
                  <div className="functions">
                      {component.функции.map(func => (
                        <div key={func.id} className="function">
                         <p>{func.название} </p>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <button onClick={toggleVisibility} className="toggle-button">
        <Arrow className={`svg ${isVisible ? 'visibleButton' : 'hiddenButton'}`} />
      </button>
    </div>
  );
};

export default LeftPanel;
