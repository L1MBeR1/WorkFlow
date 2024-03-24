import React, { useState, useEffect} from 'react';
import { ReactComponent as Arrow } from '../images/panel/arrow.svg';
import '../css/componentPanel.css';
import ComponentFunc from './componentFunc';

const ComponentPanel = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [componentsData, setComponentsData] = useState([]);
  const [componentsFuncData, setComponentsFuncData] = useState([]);
  const [panelMode, setPanelMode] = useState('Initial');

  
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleComponentClick = (component) => {
    setSelectedComponent(component === selectedComponent ? null : component);
    fetchComponentsFuncData(component);
  };

  const togglePanelSection = () => {
    if (panelMode === 'Initial') {
      setPanelMode('Components');
    } else if (panelMode === 'Components'){
      setPanelMode('Initial');
    }
  };
  const fetchComponentsFuncData = async (component) => {
    try {
      const response = await fetch('http://localhost:4000/database/components/functions/by_component_id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "component_id" : component.id}),
      });
      const responseData = await response.json();
      console.log(responseData)
      setComponentsFuncData(responseData); 
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const fetchComponentsData = async () => {
      try {
        const response = await fetch('http://localhost:4000/database/components/all', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
        const responseData = await response.json();
        console.log(responseData)
        setComponentsData(responseData); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchComponentsData();
  }, []); 

  return (
    <div className={`panelDiv ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="panel">
        <div className="content">
          <div className="panelHeader"onClick={togglePanelSection} >
            <div className={`section ${panelMode === 'Initial' && 'active'}`}>
              <p >Начальные блоки</p>
            </div>
            <div className={`section ${panelMode === 'Components' && 'active'}`} onClick={togglePanelSection}>
              <p>Компоненты</p>
            </div>
          </div>
          <hr />
          {panelMode === 'Initial' && (
            <div className="initialNodes">
              <p>fsdfdsfsf</p>
            </div>
          )}
          {panelMode === 'Components' && (
          <div className="components">
              {componentsData.map(component => (
                <div key={component.id} className="componentAndFuncs">
                  <div className="component" onClick={() => handleComponentClick(component)}>
                    <p>{component.Название}</p>
                  </div>
                  {selectedComponent && selectedComponent.id === component.id && (
                    <div className="functions">
                      {componentsFuncData.map(func => (
                        <ComponentFunc key={func.id} name={func.Название}></ComponentFunc>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
          )}
        </div>
      </div>
      <button onClick={toggleVisibility} className="toggle-button">
        <Arrow className={`svg ${isVisible ? 'visibleButton' : 'hiddenButton'}`} />
      </button>
    </div>
  );
};

export default ComponentPanel;
