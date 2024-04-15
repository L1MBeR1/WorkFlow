import React, { useState, useEffect, memo, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import './ccc.css';
import { useBlocks } from '../../store';
import IntaractiveSection from './intaractiveSection';
import { useParameterBlocksData } from '../../store';
import CustomSelect from './CustomSelectParametrs';

export default memo(({ data, isConnectable }) => {
    const blocks = useBlocks((state) => state.blocks);
    //const updateBlock = useBlocks((state) => state.updateBlock);
    const parameterBlocks = useParameterBlocksData((state) => state.blocks);



    const [input_parameters, setInputParameters] = useState([]);
    const [output_parameters, setOutputParameters] = useState([]);
    const [incomingParameterBlocksIds, setincomingParameterBlocksIds] = useState([]);
    const [services_functions, setServicesFunctions] = useState([]);
    const [entry_points, setEntryPoints] = useState([]);
    const [options, setOptions] = useState([
        { id: '1', value: '-', type: 'string', name: '-' },
        { id: '2', value: '-', type: 'boolean', name: '-' },
        { id: '3', value: '-', type: 'number', name: '-' },
    ]);

    const selectRef = useRef(null);
    const selectRef2 = useRef(null);
    const param_ref = useRef(null);

    useEffect(() => {
        const fetchData = async (isReturn) => {
            try {
                const response = await fetch('http://localhost:4000/database/components/functions/parameters/by_function_id', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        function_id: data.function_id,
                        is_return: isReturn,
                    }),
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return await response.json();
            } catch (error) {
                console.error('Error fetching data:', error);
                throw error; // Rethrowing error if you need to handle it later or to notify a user interface.
            }
        };

        const fetchInputParameters = async () => {
            try {
                const inputParams = await fetchData(false);
                setInputParameters(inputParams);
                const outputParams = await fetchData(true);
                setOutputParameters(outputParams);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchInputParameters();
    }, [data.function_id]); 

    useEffect(() => {
        const defaultOptions = [
            { id: '1', value: '-', type: 'string', name: '-' },
            { id: '2', value: '-', type: 'boolean', name: '-' },
            { id: '3', value: '-', type: 'number', name: '-' },
        ];
        let loadoptions = [];
        console.log('handled update of parameter blocks');
        console.log(parameterBlocks);
        parameterBlocks.forEach(block => {
            if (incomingParameterBlocksIds.includes(block.selfId)) {
                if (block.data){
                    if (Array.isArray(block.data)) {
                        console.log('awdawdawd');
                        block.data.forEach(parameterRow => {
                            loadoptions = [...loadoptions, parameterRow];
                        });
                    }
                    else{
                        loadoptions.push(block.data);
                    }
                    
                }
                
            }
        });
        const newOptions = loadoptions ? [...defaultOptions, ...loadoptions] : defaultOptions;
        setOptions(newOptions);
    }, [parameterBlocks, incomingParameterBlocksIds]);

    useEffect(() => {
        console.log('handled update of blocks');
        console.log(blocks);
        blocks.forEach(element => {
            if (element.selfId === data.id) {
                setincomingParameterBlocksIds(element.incomeConnections);
            }
        });

    }, [blocks]);

    useEffect(() => {
        const fetchInputParameters = async () => {
            try {
                const response = await fetch('http://localhost:4000/database/services/by_component_id', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "component_id": data.component_id
                    }),
                });
                const responseData = await response.json();
                setServicesFunctions(responseData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchInputParameters();
    }, [data]);

    useEffect(() => {
        const fetchEntryPoints = async () => {
            try {
                if (services_functions.length > 0) {
                    const response = await fetch('http://localhost:4000/database/services/service_points/by_service_id', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            "service_id": services_functions[0].id
                        }),
                    });
                    const responseData = await response.json();
                    setEntryPoints(responseData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchEntryPoints();
    }, [services_functions]);

    const dodo = () => {
        console.log('ppp', blocks, parameterBlocks);
        
    };

    useEffect(() => {
        const selectedServiceOption = selectRef.current.value;
        data.selectedService = selectedServiceOption;
        const selectedEntryOption = selectRef2.current.value;
        data.selectedEntry = selectedEntryOption;

    }, [data, entry_points]);

    const handleServiceChange = (event) => {
        const selectedOption = event.target.value;
        data.selectedService = selectedOption;
    };

    const handleEntryChange = (event) => {
        const selectedOption = event.target.value;
        data.selectedEntry = selectedOption;
    };

    const filterOptionsByType = (options, type) => {
        return options
            .filter(option => option !== undefined)
            .filter(option => option.type === type);
    };
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectCoords, setSelectCoords] = useState({ x: 0, y: 0 });
  
    const handleToggleSelect = (e) => {
      const boundingRect = e.target.getBoundingClientRect();
    //   console.log(e)
      setSelectCoords({ x: e.target.offsetLeft, y: e.target.offsetTop +e.target.clientHeight+5});
      setIsOpen(!isOpen);

    };
    const closeSelector = () => {
        if (isOpen){
            setIsOpen(false)
        }
    }
    const handleSelect = (option) => {
      setSelectedOption(option);
    };
    
      const parentRef = useRef(null);
    return (
        <>
            <div className='component-Function-Block' ref={parentRef} tabindex="0" onBlur={closeSelector} >
                <Handle
                    className='HandleComponent'
                    type="target"
                    position={Position.Left}
                    isConnectable={isConnectable}
                />
                <header className='function-block__header'>
                    {data.label}
                </header>
                <hr></hr>
                <div className='parameters-Box'>
                        {/* <p className='h'>Входные параметры</p> */}
                        {input_parameters.length !==0 &&(
                            <IntaractiveSection sectionName='Входные параметры' visible='true' >
                            <header className='parameter-Header'>
                                <div className='parameter-Header_name'>Название</div>
                                <div className='parameter-Header_type'>Тип</div>
                                <div className='parameter-Header_type'>Параметр</div>
                                {/* <div className='parameter-Header_type'>Значение</div> */}
                            </header>
                            <div ref={param_ref} className='parametrs'>
                                {input_parameters.map((item, index) => (
                                    <div key={index} className='parameter'>
                                        <div className='fucn_parameter_name'>{item.Название}</div>
                                        <div className='fucn_parameter_type'>{item.type}</div>
                                        <select data-id={index} /*onClick={updateOptions}*/ className='fucn_parameter_value'>
                                            {filterOptionsByType(options, item.type).map(option => (
                                                <option data-id={option.id} key={option.id} value={option.value}>
                                                    {option.name} ({option.value})
                                                </option>
                                            ))}
                                        </select>
                                        
                                        {/* <div data-id={index} className='func_parameter_value' > {data.options[selectedOptions[index]].value} </div> */}
                                    </div>
                                ))}
                            </div>
                        </IntaractiveSection>
                    )}



                    <IntaractiveSection sectionName='Сервис' >
                        <div className='parameter-Container'>
                            <header>Название сервиса</header>

                            <div className='parameter-Select'>
                                <div className="custom-select">
                                    <select className='select' ref={selectRef} onChange={handleServiceChange}>
                                        {services_functions.map((item, index) => (
                                            <option key={index} value={index}>
                                                {item.Название}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </IntaractiveSection>
                    <IntaractiveSection sectionName='Uri' >
                        <div className='parameter-Container'>
                            <header>Точка входа</header>
                            <div className='parameter-Select'>
                                <div className="custom-select">
                                    <select className='select' ref={selectRef2} onChange={handleEntryChange}>
                                        {entry_points.map((item, index) => (
                                            <option key={index} value={index}>
                                                {item.uri}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </IntaractiveSection>
                </div>
                <div onClick={handleToggleSelect} style={{ border: '1px solid black', padding: '10px', width: '200px' }}>
                    Нажмите для открытия селекта
                    </div>
                    <CustomSelect isOpen={isOpen} options={['Option 1', 'Option 2', 'Option 3']} onSelect={handleSelect} selectCoords={selectCoords} />
                            <Handle
                    className='HandleComponent'
                    type="source"
                    position={Position.Right}
                    isConnectable={isConnectable}
                />
            </div>
        </>
    );
});