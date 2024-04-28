import React, { useState, useEffect, memo, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import './ccc.css';

import { useBlocks } from '../../store';
import IntaractiveSection from './intaractiveSection';
import { useParameterBlocksData } from '../../store';
import CustomSelect from './CustomSelect.jsx';
import e from 'cors';

export default memo(({ data, isConnectable }) => {
    const blocks = useBlocks((state) => state.blocks);
    const updateBlock = useBlocks((state) => state.updateBlock); 
    const parameterBlocks = useParameterBlocksData((state) => state.blocks);

    
    const [input_parameters, setInputParameters] = useState([]);
    const [output_parameters, setOutputParameters] = useState([]);
    const [parameters_from_left_nodes, setLeftNodesParameters] = useState([]);


    const [incomingParameterBlocksIds, setincomingParameterBlocksIds] = useState([]);
    const [services_functions, setServicesFunctions] = useState([]);
    const [entry_points, setEntryPoints] = useState([]);
    const [options, setOptions] = useState([
        // { id: '1', value: '-', type: 'string', name: '-' },
        // { id: '2', value: '-', type: 'boolean', name: '-' },
        // { id: '3', value: '-', type: 'number', name: '-' },
    ]);

    // const selectRef = useRef(null);
    // const selectRef2 = useRef(null);
    const param_ref = useRef(null);

    /*
        TODO: проверить/сделать сохранение параметров функции в blocks.data
        , чтобы данные показывались в блоках справа 
    */

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
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchParameters();
    }, [data.function_id]);

    useEffect(() => {
        const defaultOptions = [
            // { id: '1', value: '-', type: 'string', name: '-' },
            // { id: '2', value: '-', type: 'boolean', name: '-' },
            // { id: '3', value: '-', type: 'number', name: '-' },
        ];
        /*let loadoptions = [];
        let testing_loadoptions = [];
        console.log('handled update of parameter blocks');
        console.log(parameterBlocks);
        parameterBlocks.forEach(block => {
            if (incomingParameterBlocksIds.includes(block.selfId)) {
                if (block.data) {
                    if (Array.isArray(block.data)) {
                        console.log('awdawdawd', block);
                        block.data.forEach(parameterRow => {
                            loadoptions = [...loadoptions, parameterRow];
                        });
                        
                    }
                    else {
                        loadoptions.push(block.data);
                    }
                }
            }
        });*/
        let loadoptions = [];
        let testing_loadoptions = [];
        // console.log('handled update of parameter blocks');
        // console.log(parameterBlocks);
        parameterBlocks.forEach(block => {
            if (incomingParameterBlocksIds.includes(block.selfId)) {
                if (block.data) {
                    if (Array.isArray(block.data)) {
                        // console.log('awdawdawd', block);

                        let tmpParameters = [];
                        block.data.forEach(parameterRow => {
                            tmpParameters = [...tmpParameters, parameterRow];
                        });
                        testing_loadoptions[block.label] = tmpParameters;
                    } else {

                        testing_loadoptions[block.label] = [block.data];
                    }
                }
            }
        });

        // let left_data_by_label = [];
        // const get_left = (id) => {
        //     blocks.forEach(element => {
        //         if (
        //             element.type === 'custom' &&
        //             element.outcomeConnections.includes(id)
        //         ) {
        //             // let tmpParameters = [];
        //             // element.data.parameters.forEach(parameterRow => {
        //             //     tmpParameters = [...tmpParameters, parameterRow];
        //             // });
        //             console.log('ЧТототут', element.data.parameters);
        //             testing_loadoptions[element.data.label] = element.data.parameters;


        //             left_data_by_label.push(element.selfId);
        //             get_left(element.selfId)
        //         }
        //     });
        // }
        // get_left(data.id);

        // console.log('handled update of blocks');
        // console.log(blocks);

        let left_ids = [];
        const get_left = (id) => {
            blocks.forEach(element => {
                if (
                    element.type === 'custom' &&
                    element.outcomeConnections.includes(id)
                ) {
                    // console.log('ЧТототут', element.selfId);
                    left_ids.push(element.selfId);
                    get_left(element.selfId)
                }
            });
        }
        get_left(data.id);

        let tmpParameters = [];
        blocks.forEach(element => {
            if (element.selfId === data.id) {
                setincomingParameterBlocksIds(element.incomeConnections);
            }
            if (left_ids.includes(element.selfId)) {
                tmpParameters = [...tmpParameters, element.data];
            }
            setLeftNodesParameters(tmpParameters);
        });
        /////////////////
        //
        //
        //
        let tmpParametersMerged = [];
        let wasIds = [];
        tmpParameters.forEach(parameters => {


            parameters.parameters.forEach(parameterRow => {
                console.log('PARAMS3', parameterRow);
                if (!wasIds.includes(parameterRow.id)) {
                    wasIds.push(parameterRow.id);
                    tmpParametersMerged.push(parameterRow);
                    testing_loadoptions[parameters.label] = parameterRow;
                }
            })

        });

        tmpParametersMerged.forEach(element => {
            console.log('e', element);
            //testing_loadoptions[element.label] = element.parameters;
        });


        const keys = Object.keys(testing_loadoptions);
        keys.forEach(key => {
            if (!Array.isArray(testing_loadoptions[key])) {
                console.log(`${key} is not an array`);
                testing_loadoptions[key] = [testing_loadoptions[key]];
            }
        });
        /*if (!Array.isArray(testing_loadoptions)) {
            console.log('notarray');
            testing_loadoptions = [testing_loadoptions];
        }*/

        console.log('UUU', testing_loadoptions);
        console.log('GGG', tmpParameters);
        console.log('HHH', tmpParametersMerged);

        const newOptions = testing_loadoptions ? [...defaultOptions, ...testing_loadoptions] : defaultOptions;
        // console.log('new', newOptions);
        // console.log('new2', testing_loadoptions);

        // setOptions(newOptions);
        setOptions(testing_loadoptions);

        //updateBlock(data.id, { ...data, parameters: testing_loadoptions });
        
        // console.log('FINALOPTIONS', testing_loadoptions);
    }, [parameterBlocks, incomingParameterBlocksIds, blocks]);

    /*useEffect(() => {
        console.log('handled update of blocks');
        console.log(blocks);




        let left_ids = [];
        const get_left = (id) => {
            blocks.forEach(element => {
                if (
                    element.type === 'custom' &&
                    element.outcomeConnections.includes(id)
                ) {
                    console.log('ЧТототут', element.selfId);
                    left_ids.push(element.selfId);
                    get_left(element.selfId)
                }
            });
        }
        get_left(data.id);

        let tmpParameters = [];
        blocks.forEach(element => {
            if (element.selfId === data.id) {
                setincomingParameterBlocksIds(element.incomeConnections);
            }
            if (left_ids.includes(element.selfId)) {
                tmpParameters = [...tmpParameters, element.data];
            }
            setLeftNodesParameters(tmpParameters);
        });

        console.log('TTT', options, tmpParameters);

        setOptions([...options, ...tmpParameters]);

    }, [blocks]);*/

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
                    // console.log('RESP', responseData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchEntryPoints();
    }, [services_functions]);

    // useEffect(() => {
    //     const selectedServiceOption = selectRef.current.value;
    //     data.selectedService = selectedServiceOption;
    //     const selectedEntryOption = selectRef2.current.value;
    //     data.selectedEntry = selectedEntryOption;

    // }, [data, entry_points]);

    /*const handleServiceChange = (event) => {
        const selectedOption = event.target.value;
        data.selectedService = selectedOption;
    };*/

    /*const handleEntryChange = (event) => {
        const selectedOption = event.target.value;
        data.selectedEntry = selectedOption;
    };*/

    /*const filterOptionsByType = (options, type) => {
        return options
            .filter(option => option !== undefined)
            .filter(option => option.type === type);
    };*/

    const printOutputParamsToConsole = () => {
        console.log('ВСЕ БЛОКИ');
        console.log(blocks, parameterBlocks);


        console.log('ВЫХОДНЫЕ ПАРАМЕТРЫ');
        console.log(output_parameters); //TODO: использовать в компоненте

        console.log('ПАРАМЕТРЫ С ВХОЯДЩИХ УЗЛОВ');
        console.log(parameters_from_left_nodes);

    }


    return (
        <>
            <button onClick={printOutputParamsToConsole}> Выходные параметры в консоли </button>



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
                                <CustomSelect options={entry_points} type='uri'></CustomSelect>
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