import React, { useState, useEffect } from 'react';
import { ReactComponent as Arrow } from '../images/panel/arrow.svg';
import '../css/componentPanel.css';
import ComponentFunc from './componentFunc';
import InitialNode from '../components/InitialNodes/initialNode';

const ComponentPanel = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [componentsData, setComponentsData] = useState([]);
  const [componentsFuncData, setComponentsFuncData] = useState([]);
  const [panelMode, setPanelMode] = useState('Initial');

  const [animationTriggered, setAnimationTriggered] = useState(false);

//   const playAnimationForSections = () => {
//     setAnimationTriggered(true); 

//     setAnimationTriggered(false); 

//   };

//   const playAnimationForFunctions = () => {
//     setAnimationTriggered(true); 
//     setTimeout(() => {
//         setAnimationTriggered(false); 
//     }, 100);
// };
	const toggleVisibility = () => {
		setIsVisible(!isVisible);
	};

  const handleComponentClick = (component) => {
    setSelectedComponent(component === selectedComponent ? null : component);
    fetchComponentsFuncData(component);
  };

  const togglePanelSection = (section) => {
    if (section === 'Initial') {
      setPanelMode('Initial');
      // playAnimationForSections();
    } else if (section === 'Components'){
      setPanelMode('Components');
      // playAnimationForSections();
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
          <div className="components animateContent" onAnimationEnd={() => console.log(1231)}>
              {componentsData.map(component => (
                <div key={component.id} className="componentAndFuncs">
                  <div className="component" onClick={() => handleComponentClick(component)}>
                    <p>{component.Название}</p>
                  </div>
                  {/* {selectedComponent && selectedComponent.id === component.id && ( */}
                    <div className={`functions ${selectedComponent && selectedComponent.id === component.id?'visibleFNS':'hiddenFNS'}`}>
                      {componentsFuncData.map(func => (
                        <ComponentFunc 
                        key={func.id} 
                        name={func.Название}
                        function_id={func.id}
												component_id={component.id}></ComponentFunc>
                      ))}
                    </div>
                  {/* // )} */}
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