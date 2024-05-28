import React, { memo, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import AceEditor from 'react-ace';
import { useBlocks, useParameterBlocksData, useDataTypes } from '../../stores/store';
import IntaractiveSection from '../mycomponent/intaractiveSection.jsx';
import { v4 as uuidv4 } from 'uuid';
import CustomSelect from '../mycomponent/CustomSelect.jsx';

import { ReactComponent as Trash } from './trash.svg';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-dracula';


export default memo(({ data, isConnectable }) => {
    const blocks = useBlocks((state) => state.blocks);
    const updateBlock = useBlocks((state) => state.updateBlock);
    const dataTypes = useDataTypes((state) => state.types);
    const [options, setOptions] = useState([]);
    const [parameters, setParameters] = useState([{ id: uuidv4(), name: '', type: 'string', value: '' }]);
    const [parameters1, setParameters1] = useState([{ id: uuidv4(), name: '', type: 'string', value: '' }]);
    const [incomingParameterBlocksIds, setincomingParameterBlocksIds] = useState([]);
    const parameterBlocks = useParameterBlocksData((state) => state.blocks);
    const [code, setCode] = useState(`
def function(input):
    """
    use input.InputParameterName to 
    do something with inputs
    """

    output = input
    return output
`);

    const updateCode = () => {
        updateBlock(data.id, {
            ...blocks.find(block => block.selfId === data.id).data,
            code: code
        });
    };

    // useEffect(() => {
    //     const fetchData = async (isReturn) => {
    //         try {
    //             const response = await fetch('http://localhost:4000/database/components/functions/parameters/by_function_id', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({
    //                     function_id: data.function_id,
    //                     is_return: isReturn,
    //                 }),
    //             });
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             return await response.json();
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //             throw error;
    //         }
    //     };

    //     const fetchParameters = async () => {
    //         try {
    //             const outputParams = await fetchData(true);
    //             setOutputParameters(outputParams);
    //             data.output_parameters = outputParams;
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };

    //     fetchParameters();
    // }, []);

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
            return blocks
                .filter(block => (block.type === 'custom' || block.type === 'codeBlock') && block.outcomeConnections.includes(id))
                .map(block => block.selfId);
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
        parameters.forEach(parameter => {
            saveNameToData(parameter.id, '');
            saveTypeToData(parameter.id, 'string');
        });
    }, [parameters]);

    const addParameter = () => {
        let newParameter = {
            id: `${uuidv4()}`,
            name: '',
            type: 'string',
            value: ''
        };
        setParameters([...parameters, newParameter]);
    };

    const handleDeleteParameter = (paramid) => {
        const updatedParameters = parameters.filter(param => param.id !== paramid);
        setParameters(updatedParameters);
    };

    const addParameter1 = () => {
        let newParameter = {
            id: `${uuidv4()}`,
            name: '',
            type: 'string',
            value: ''
        };
        setParameters1([...parameters1, newParameter]);
    };

    const handleDeleteParameter1 = (paramid) => {
        const updatedParameters = parameters1.filter(param => param.id !== paramid);
        setParameters1(updatedParameters);
    };

    const printToConsole = () => {
        // console.log(blocks.find(block => block.selfId === data.id));
        console.log(dataTypes);
    };

    const saveNameToData = (id, value) => {
        let newData;
        blocks.forEach(block => {
            if (block.selfId === data.id) {
                if (!block.data.output_parameters) {
                    block.data.output_parameters = [];
                }
                if (!block.data.output_parameters[id]) {
                    block.data.output_parameters[id] = {};
                }
                newData = {
                    ...block.data,
                    output_parameters: {
                        ...block.data.output_parameters,
                        [id]: {
                            ...block.data.output_parameters[id],
                            id: id,
                            name: value,
                            value: '---',
                        },
                    }

                };
            }
        })
        updateBlock(data.id, newData);
    };

    const saveTypeToData = (id, value) => {
        let newData;
        blocks.forEach(block => {
            if (block.selfId === data.id) {
                if (!block.data.output_parameters) {
                    block.data.output_parameters = [];
                }
                if (!block.data.output_parameters[id]) {
                    block.data.output_parameters[id] = {};
                }
                newData = {
                    ...block.data,
                    output_parameters: {
                        ...block.data.output_parameters,
                        [id]: {
                            ...block.data.output_parameters[id],
                            id: id,
                            type: value,
                            value: '---',
                        },
                    }

                };
            }
        })
        updateBlock(data.id, newData);
    };

    const saveNameToData2 = (id, value, type) => {
        let newData;
        blocks.forEach(block => {
            if (block.selfId === data.id) {
                if (!block.data.input_parameters) {
                    block.data.input_parameters = [];
                }
                if (!block.data.input_parameters[id]) {
                    block.data.input_parameters[id] = {};
                }
                newData = {
                    ...block.data,
                    input_parameters: {
                        ...block.data.input_parameters,
                        [id]: {
                            ...block.data.input_parameters[id],
                            id: id,
                            name: value,
                            type: type,
                            value: '---',
                        },
                    }
                };
            }
        })
        updateBlock(data.id, newData);
    };

    return (
        <>
            <button onClick={printToConsole}> Выходные параметры в консоли </button>
            <div className='node' tabIndex="0">
                <Handle
                    className='HandleComponent'
                    type="target"
                    position={Position.Left}
                    isConnectable={isConnectable}
                />

                <Handle
                    className='HandleComponent'
                    type="source"
                    position={Position.Right}
                    isConnectable={isConnectable}
                />

                <div className='outputs'>
                    <div className='result-block-content'>
                        <IntaractiveSection sectionName='Входные параметры' visible='true'
                            button={
                                <div className='addButton' onClick={addParameter1}>
                                    +
                                </div>}>
                            <header >
                                <div className='header-name'>Название</div>
                                <div className='header-type'>Тип</div>
                                <div className='header-value'>Значение</div>
                            </header>
                            <div className='parametrs'>
                                {parameters1.map(parameter => (
                                    <div key={parameter.id} className='parameter' >
                                        <div className='parameter_name'>
                                            <input placeholder="Имя параметра"
                                                onChange={(e) => saveNameToData2(parameter.id, e.target.value, parameter.type)}
                                            ></input>
                                        </div>
                                        <div className='fucn_parameter_type'>
                                            {parameter.type}
                                        </div>
                                        <div className='type_value'>
                                            <CustomSelect
                                                options={options}
                                                blockId={data.id}
                                                funcParamName={parameter.name}
                                                funcParamType={parameter.type}
                                                type='parameters'>

                                            </CustomSelect>
                                        </div>
                                        <div className='delete_button' onClick={() => handleDeleteParameter1(parameter.id)}>
                                            <Trash className='delete_img' />
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </IntaractiveSection>
                    </div>
                </div>

                <div style={{ height: '200px', width: '400px' }}>
                    <AceEditor
                        mode="python"
                        theme="dracula"
                        name="code-editor"
                        width="100%"
                        height="100%"
                        value={code}
                        onChange={(newValue) => {
                            updateCode(newValue);
                            setCode(newValue);
                        }}
                        setOptions={{
                            showLineNumbers: true,
                            tabSize: 2,
                        }}
                    />
                </div>

                <div className='outputs'>
                    <div className='result-block-content'>
                        <IntaractiveSection sectionName='Выходные параметры' visible='true'
                            button={
                                <div className='addButton' onClick={addParameter}>
                                    +
                                </div>}>
                            <header >
                                <div className='header-name'>Название</div>
                                <div className='header-type'>Тип</div>
                                <div className='header-value'>Значение</div>
                            </header>
                            <div className='parametrs'>
                                {parameters.map(parameter => (
                                    <div key={parameter.id} className='parameter' >
                                        <div className='parameter_name'>
                                            <input placeholder="Имя параметра"
                                                onChange={(e) => saveNameToData(parameter.id, e.target.value)}
                                            ></input>
                                        </div>
                                        <div className='type_value'>
                                            <select
                                                onChange={(e) => saveTypeToData(parameter.id, e.target.value)}
                                            >
                                                {dataTypes.map((item, index) => (
                                                    <option key={index} value={item.type}>{item.type}</option>
                                                ))}
                                                {/* <option value="string">String</option>
                                                <option value="number">Number</option>
                                                <option value="boolean">Boolean</option> */}
                                            </select>

                                        </div>
                                        <div className='value'> {parameter.value}</div>
                                        <div className='delete_button' onClick={() => handleDeleteParameter(parameter.id)}>
                                            <Trash className='delete_img' />
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </IntaractiveSection>
                    </div>
                </div>
            </div>
        </>
    );
});
