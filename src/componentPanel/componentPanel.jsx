import React, { useState, useEffect } from 'react';
import { ReactComponent as Arrow } from '../images/panel/arrow.svg';
import '../css/componentPanel.css';
import ComponentFunc from './componentFunc';
import Component from './component';
import InitialNode from '../components/InitialNodes/initialNode';

const ComponentPanel = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [componentsData, setComponentsData] = useState([]);
  const [functionsData, setFunctionsData] = useState([]);
  const [panelMode, setPanelMode] = useState('Initial');


  var componentAndFuncs=[]

	const toggleVisibility = () => {
		setIsVisible(!isVisible);
	};
  const togglePanelSection = (section) => {
    if (section === 'Initial') {
      setPanelMode('Initial');
    } else if (section === 'Components'){
      setPanelMode('Components');
    }
  };
  const fetchFunctionsData = async (component) => {
    try {
      const response = await fetch('http://localhost:4000/database/functions/all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      const responseData = await response.json();
      // console.log(responseData)
      setFunctionsData(responseData); 
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
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
  function combineComponentsAndFunctions(components, functions) {
    const combinedArray = [];

    components.forEach(component => {
        const componentFunctions = functions.filter(func => func.id_of_component === component.id);

        const combinedComponent = {
            id: component.id,
            Название: component.Название,
            Описание: component.Описание,
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

  componentAndFuncs=combineComponentsAndFunctions(componentsData,functionsData);
  // console.log(componentAndFuncs)
  return (
    <div className={`panelDiv ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="panel">
        <div className="content">
          <div className="panelHeader">
            <div className={`section ${panelMode === 'Initial' && 'active'}`}onClick={() => togglePanelSection('Initial')}>
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
            </div>
          )}
          {panelMode === 'Components' && (
          <div className="components animateContent">
          {componentAndFuncs.map(component => (
              <Component key={component.id} compName={component.Название} compDescripton={component.Описание}>
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