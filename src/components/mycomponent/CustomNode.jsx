import React, { useState, useEffect, memo, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import './ccc.css';

import { useBlocks } from '../../stores/store.js';
import IntaractiveSection from './intaractiveSection';
import { useParameterBlocksData } from '../../stores/store.js';
import CustomSelect from './CustomSelect.jsx';
import e from 'cors';
import { type } from '@testing-library/user-event/dist/type/index.js';

export default memo(({ data, isConnectable }) => {
    const blocks = useBlocks((state) => state.blocks);
    // const updateBlock = useBlocks((state) => state.updateBlock);
    const parameterBlocks = useParameterBlocksData((state) => state.blocks);


    const [input_parameters, setInputParameters] = useState([]);
    const [output_parameters, setOutputParameters] = useState([]);
    // const [parameters_from_left_nodes, setLeftNodesParameters] = useState([]);


    const [incomingParameterBlocksIds, setincomingParameterBlocksIds] = useState([]);
    const [services_functions, setServicesFunctions] = useState([]);
    const [entry_points, setEntryPoints] = useState([]);
    const [options, setOptions] = useState([]);

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
                throw error;
            }
        };

        const fetchParameters = async () => {
            try {
                const inputParams = await fetchData(false);
                setInputParameters(inputParams);
                const outputParams = await fetchData(true);
                setOutputParameters(outputParams);
                data.output_parameters = outputParams;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchParameters();
    }, [data.function_id]);


    // TODO: Переписать
    useEffect(() => {
        const incomingParameters = parameterBlocks
            .filter(block => incomingParameterBlocksIds.includes(block.selfId))
            .reduce((acc, block) => {
                const parameters = Array.isArray(block.data)
                    ? block.data
                    : [block.data];

                return {
                    ...acc,
                    [block.label]: parameters,
                };
            }, {});

        let left_ids = [];
        const get_left = (id) => {
            blocks.forEach(element => {
                if (
                    element.type === 'custom' &&
                    element.outcomeConnections.includes(id)
                ) {
                    left_ids.push(element.selfId);
                    //get_left(element.selfId)
                }
            });
        }
        get_left(data.id);

        let outputParams = {};
        blocks.forEach(block => {
            if (block.selfId === data.id) {
                setincomingParameterBlocksIds(block.incomeConnections);
            }
            if (left_ids.includes(block.selfId)) {
                outputParams[block.data.label] = block.data.output_parameters.map(param => ({
                    id: param.id,
                    type: param.type,
                    value: '---',
                    name: param.Название,
                }));
            }
        });

        // setLeftNodesParameters(outputParams);
        let combinedObj = Object.assign(outputParams, incomingParameters);
        setOptions(combinedObj);
    }, [parameterBlocks, incomingParameterBlocksIds, blocks]);


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

    const printOutputParamsToConsole = () => {
        // console.log('ВСЕ БЛОКИ');
        // console.log(blocks, parameterBlocks);

        // console.log('ВЫХОДНЫЕ ПАРАМЕТРЫ');
        // console.log(output_parameters); 

        // console.log('ПАРАМЕТРЫ С ВХОЯДЩИХ УЗЛОВ');
        // console.log(parameters_from_left_nodes);

    }


    return (
        <>
            {/* <button onClick={printOutputParamsToConsole}> Выходные параметры в консоли </button> */}



            <div className='component-Function-Block' tabIndex='0'>
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
                    {input_parameters.length !== 0 && (
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
                                        <div className='func_parameter_value'>
                                            <CustomSelect
                                                options={options}
                                                blockId={data.id}
                                                funcParamName={item.Название}
                                                funcParamType={item.type}
                                                type='parameters'>

                                            </CustomSelect>
                                        </div>
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
                                <CustomSelect options={services_functions} blockId={data.id} type='services'></CustomSelect>
                                {/* <div className="custom-select">
                                     <select className='select' ref={selectRef} onChange={handleServiceChange}>
                                        {services_functions.map((item, index) => (
                                            <option key={index} value={index}>
                                                {item.Название}
                                            </option>
                                        ))}
                                    </select> 
                                </div> */}
                            </div>
                        </div>
                    </IntaractiveSection>
                    <IntaractiveSection sectionName='Uri' >
                        <div className='parameter-Container'>
                            <header>Точка входа</header>
                            <div className='parameter-Select'>
                                <CustomSelect options={entry_points} blockId={data.id} type='uri'></CustomSelect>
                                {/* <div className="custom-select">
                                    <select className='select' ref={selectRef2} onChange={handleEntryChange}>
                                        {entry_points.map((item, index) => (
                                            <option key={index} value={index}>
                                                {item.uri}
                                            </option>
                                        ))}
                                    </select>
                                </div> */}
                            </div>
                        </div>
                    </IntaractiveSection>
                    <IntaractiveSection sectionName='Выходные параметры'>
                        <div className='parameter-Container'>
                            <div className='output-parameters'>
                                {output_parameters.map((item, index) => (
                                    <div key={index} className='output-parameter'>
                                        <div className='output-parameter-name'>{item.Название}</div>
                                        <div className='output-parameter-type'>{item.type}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </IntaractiveSection>
                </div>


                <Handle
                    className='HandleComponent'
                    type="source"
                    position={Position.Right}
                    isConnectable={isConnectable}
                />
            </div >
        </>
    );
});