import React, { useState, useEffect, memo, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import '../../css/functions.css';

import { useBlocks } from '../../stores/store.js';
import IntaractiveSection from '../AdditionalComponents/intaractiveSection.jsx';
import { useParameterBlocksData } from '../../stores/store.js';
import CustomSelect from '../AdditionalComponents/customSelect.jsx';

export default memo(({ data, isConnectable }) => {
    const blocks = useBlocks((state) => state.blocks);
    const parameterBlocks = useParameterBlocksData((state) => state.blocks);
    const [input_parameters, setInputParameters] = useState([]);
    const [output_parameters, setOutputParameters] = useState([]);
    const [incomingParameterBlocksIds, setincomingParameterBlocksIds] = useState([]);
    const [services_functions, setServicesFunctions] = useState([]);
    const [entry_points, setEntryPoints] = useState([]);
    const [options, setOptions] = useState([]);

    // const param_ref = useRef(null);

    useEffect(() => {
        const fetchData = async (isReturn) => {
            try {
                const response = await fetch(`http://localhost:5101/database/components/functions/parameters/by_function_id`, {
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

    useEffect(() => {
        const getIncomingParameters = (parameterBlocks, incomingParameterBlocksIds) => {
            return parameterBlocks
                .filter(block => incomingParameterBlocksIds.includes(block.selfId))
                .reduce((acc, block) => {
                    const parameters = Array.isArray(block.data) ? block.data : [block.data];
                    return {
                        ...acc,
                        [block.label]: parameters,
                    };
                }, {});
        };

        const findLeftIds = (blocks, id) => {
            const directConnections = blocks
                .filter(block => (block.type === 'functionBlock' || block.type === 'codeBlock') &&
                    block.outcomeConnections.includes(id))
                .map(block => block.selfId);
        
            const connectedViaConditions = blocks
                .filter(block => block.type === 'conditionBlock' &&
                    block.outcomeConnections.includes(id))
                .map(block => block.incomeConnections)
                .flat(); // Плоский массив из вложенных массивов
        
            return [...directConnections, ...connectedViaConditions];
        };
        

        const getOutputParameters = (blocks, leftIds) => {
            return blocks.reduce((acc, block) => {
                if (leftIds.includes(block.selfId)) {
                    acc[block.data.label] = Object.keys(block.data.output_parameters).map(key => {
                        const param = block.data.output_parameters[key];
                        return {
                            id: param.id,
                            type: param.type,
                            value: '---',
                            name: param.name,
                        };
                    });
                }
                return acc;
            }, {});
        };


        const incomingParameters = getIncomingParameters(parameterBlocks, incomingParameterBlocksIds);
        const leftIds = findLeftIds(blocks, data.id);

        blocks.forEach(block => {
            if (block.selfId === data.id) {
                setincomingParameterBlocksIds(block.incomeConnections);
            }
        });

        const outputParameters = getOutputParameters(blocks, leftIds);
        const combinedObj = { ...outputParameters, ...incomingParameters };

        setOptions(combinedObj);
    }, [parameterBlocks, incomingParameterBlocksIds, blocks]);



    useEffect(() => {
        const fetchInputParameters = async () => {
            try {
                const response = await fetch(`http://localhost:5101/database/services/by_component_id`, {
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
                    const response = await fetch(`http://localhost:5101/database/services/service_points/by_service_id`, {
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
        console.log('BLOCK' + data.id, blocks.find(block => block.selfId === data.id));
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
                    {input_parameters.length !== 0 && (
                        <IntaractiveSection sectionName='Входные параметры' visible='true' >
                            <header className='parameter-Header'>
                                <div className='parameter-Header_name'>Название</div>
                                <div className='parameter-Header_type'>Тип</div>
                                <div className='parameter-Header_type'>Параметр</div>
                            </header>
                            <div className='parametrs'>
                                {input_parameters.map((item, index) => (
                                    <div key={index} className='parameter'>
                                        <div className='fucn_parameter_name'>{item.name}</div>
                                        <div className='fucn_parameter_type'>{item.type}</div>
                                        <div className='func_parameter_value'>
                                            <CustomSelect
                                                options={options}
                                                blockId={data.id}
                                                funcParamName={item.name}
                                                funcParamType={item.type}
                                                type='parameters'>

                                            </CustomSelect>
                                        </div>
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
                            </div>
                        </div>
                    </IntaractiveSection>
                    <IntaractiveSection sectionName='Uri' >
                        <div className='parameter-Container'>
                            <header>Точка входа</header>
                            <div className='parameter-Select'>
                                <CustomSelect options={entry_points} blockId={data.id} type='uri'></CustomSelect>
                            </div>
                        </div>
                    </IntaractiveSection>
                    <IntaractiveSection sectionName='Выходные параметры'>
                        <div className='parameter-Container'>
                            <div className='output-parameters'>
                                {output_parameters.length === 0 ?(
                                <div>Нет выходных параметров</div>):(
                                output_parameters.map((item, index) => (
                                    <div key={index} className='output-parameter'>
                                        <div className='output-parameter-name'>{item.name}</div>
                                        <div className='output-parameter-type'>{item.type}</div>
                                    </div>
                                )))}
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