import React, { useState, useEffect } from 'react';
import { ReactComponent as Arrow } from '../../images/ComponentPanel/arrow.svg';
import '../../css/componentPanel.css';
import ComponentFunc from './componentFunc';
import Component from './component';
import InitialNode from '../InitialNodes/initialNode';

const ComponentPanel = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [componentsData, setComponentsData] = useState([]);
  const [functionsData, setFunctionsData] = useState([]);
  const [panelMode, setPanelMode] = useState('Initial');

  // Было var --> componentAndFuncs
  let componentAndFuncs = []

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  const togglePanelSection = (section) => {
    if (section === 'Initial') {
      setPanelMode('Initial');
    } else if (section === 'Components') {
      setPanelMode('Components');
    }
  };
  const fetchFunctionsData = async (component) => {
    try {
      const response = await fetch(`http://localhost:5101/database/functions/all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      const responseData = await response.json();
      setFunctionsData(responseData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchComponentsData = async () => {
    try {
      const response = await fetch(`http://localhost:5101/database/components/all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      const responseData = await response.json();
      setComponentsData(responseData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  function combineComponentsAndFunctions(components, functions) {
    const combinedArray = [];

    components.forEach(component => {
      const componentFunctions = functions.filter(func => func.id_of_component === component.id);

      const combinedComponent = {
        id: component.id,
        name: component.name,
        description: component.description,
        functions: componentFunctions.map(func => ({
          id: func.id,
          name: func.name
        }))
      };

      combinedArray.push(combinedComponent);
    });
    return combinedArray;
  }
  useEffect(() => {
    fetchComponentsData();
    fetchFunctionsData();
  }, []);

  componentAndFuncs = combineComponentsAndFunctions(componentsData, functionsData);
  return (
    <div className={`panelDiv ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="panel">
        <div className="content">
          <div className="panelHeader">
            <div className={`section ${panelMode === 'Initial' && 'active'}`} onClick={() => togglePanelSection('Initial')}>
              <p >Начальные блоки</p>
            </div>
            <div className={`section ${panelMode === 'Components' && 'active'}`} onClick={() => togglePanelSection('Components')}>
              <p>Компоненты</p>
            </div>
          </div>
          <hr />
          {panelMode === 'Initial' && (
            <div className="initialNodes animateContent">
              <InitialNode name={"Начальный блок"} type={"startBlock"}></InitialNode>
              <InitialNode name={"Конечный блок"} type={"endBlock"}></InitialNode>
              <InitialNode name={"Блок с параметрами"} type={"parametrBlock"}></InitialNode>
              <InitialNode name={"Блок с результатами"} type={"resultBlock"}></InitialNode>
              <InitialNode name={"Блок с кодом"} type={"codeBlock"}></InitialNode>
              <InitialNode name={"Условный блок"} type={"conditionBlock"}></InitialNode>
            </div>
          )}
          {panelMode === 'Components' && (
            <div className="components animateContent">
              {componentAndFuncs.map(component => (
                <Component key={component.id} compName={component.name} compDescripton={component.description}>
                  {component.functions.map(func => (
                    <ComponentFunc
                      key={func.id}
                      name={func.name}
                      function_id={func.id}
                      component_id={component.id}
                    />
                  ))}
                </Component>

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