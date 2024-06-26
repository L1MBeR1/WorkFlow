import React, { memo, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import AceEditor from 'react-ace';
import { useBlocks, useParameterBlocksData, useDataTypes } from '../../stores/store.js';
import IntaractiveSection from '../AdditionalComponents/intaractiveSection';
import { v4 as uuidv4 } from 'uuid';
import CustomSelect from '../AdditionalComponents/customSelect.jsx';
import '../../css/initialNodes.css';
import { ReactComponent as Trash } from '../../images/InitialNodes/trash.svg';
import { defaultCode } from './defaultCode.jsx';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-dracula';

export default memo(({ data, isConnectable }) => {
    const blocks = useBlocks((state) => state.blocks);
    const updateBlock = useBlocks((state) => state.updateBlock);
    const dataTypes = useDataTypes((state) => state.types);
    const [options, setOptions] = useState([]);
    const [parameters, setParameters] = useState([{ id: uuidv4(), name: '', type: 'int', value: '' }]);
    const [parameters1, setParameters1] = useState([{ id: uuidv4(), name: '', type: 'int', value: '' }]);
    const [incomingParameterBlocksIds, setincomingParameterBlocksIds] = useState([]);
    const parameterBlocks = useParameterBlocksData((state) => state.blocks);
    const [code, setCode] = useState(defaultCode);

    const updateCode = (newCode) => {
        setCode(newCode);
        updateBlock(data.id, {
            ...blocks.find(block => block.selfId === data.id).data,
            code: newCode
        });
    };

    useEffect(() => {
        saveParameterToData(parameters[0].id, '', 'name', 'output_parameters', setParameters);
        saveParameterToData(parameters[0].id, 'int', 'type', 'output_parameters', setParameters);
    }, []);


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
                .filter(block => (block.type === 'functionBlock' || block.type === 'codeBlock') && block.outcomeConnections.includes(id))
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

    const addParameter = (setParameters) => {
        let newParameter = {
            id: `${uuidv4()}`,
            name: '',
            type: 'int',
            value: ''
        };
        setParameters(prevParameters => [...prevParameters, newParameter]);
    };

    const handleDeleteParameter = (paramid, parameters, setParameters, parameterType) => {
        const updatedParameters = parameters.filter(param => param.id !== paramid);
        setParameters(updatedParameters);

        const block = blocks.find(b => b.selfId === data.id);

        // Ensure block.data[parameterType] is defined before destructuring
        if (block && block.data[parameterType]) {
            const { [paramid]: removedParameter, ...restParameters } = block.data[parameterType];

            const updatedBlock = {
                ...block.data,
                [parameterType]: restParameters
            };

            updateBlock(data.id, updatedBlock);
        }
    };


    const printToConsole = () => {
        console.log('aaa', parameters);
        console.log('bbb', parameters1);
    };

    const saveParameterToData = (id, parameter_value, parameter_name, parameter_variable, setParametersFunc) => {
        let newData;
        let updatedParameters;

        blocks.forEach(block => {
            if (block.selfId === data.id) {

                if (!block.data[parameter_variable]) {
                    block.data[parameter_variable] = [];
                }
                if (!block.data[parameter_variable][id]) {
                    block.data[parameter_variable][id] = {};
                }

                const newParameter = {
                    ...block.data[parameter_variable][id],
                    id: id,
                    [parameter_name]: parameter_value
                };

                if (!block.data.output_parameters) {
                    console.log('fff');
                    newData = {
                        ...block.data,
                        [parameter_variable]: {
                            ...block.data[parameter_variable],
                            [id]: newParameter,
                            name: '',
                            type: 'int',
                        },
                    };
                } else {
                    console.log('ggg');
                    newData = {
                        ...block.data,
                        [parameter_variable]: {
                            ...block.data[parameter_variable],
                            [id]: newParameter,
                            
                        },
                    };
                }
            }
        });

        if (parameter_variable === 'input_parameters') {
            updatedParameters = parameters1.map(param => param.id === id ? { ...param, [parameter_name]: parameter_value } : param);
            setParametersFunc(updatedParameters);
        } else {
            updatedParameters = parameters.map(param => param.id === id ? { ...param, [parameter_name]: parameter_value } : param);
            setParametersFunc(updatedParameters);
        }

        updateBlock(data.id, newData);
    };

    return (
        <>
            {/* <button onClick={printToConsole}> Выходные параметры в консоли </button> */}
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

                <div>
                    <div>{data.label}</div>
                    <hr></hr>
                </div>
                <div className='outputs'>
                    <div className='code-block-content'>
                        <IntaractiveSection sectionName='Входные параметры' visible='true'
                            button={
                                <div className='addButton' onClick={() => addParameter(setParameters1)}>
                                    +
                                </div>}>
                            <header >
                                <div className='header-name'>Название</div>
                                <div className='header-type'>Тип</div>
                                <div className='header-value'>Значение</div>
                            </header>
                            <div className='parameters'>
                                {parameters1.map((parameter) => (
                                    <div key={parameter.id} className='parameter'>
                                        <div className='parameter_name'>
                                            <input
                                                placeholder='Имя параметра'
                                                onChange={(e) =>
                                                    saveParameterToData(parameter.id, e.target.value, 'name', 'input_parameters', setParameters1)
                                                }
                                            />
                                        </div>

                                        <div className='type_value'>
                                            <select
                                                onChange={(e) => {
                                                    saveParameterToData(parameter.id, e.target.value, 'type', 'input_parameters', setParameters1);
                                                    console.log(e.target.value);
                                                }}
                                            >
                                                {dataTypes.map((item, index) => (
                                                    <option key={index} value={item.type}>
                                                        {item.type}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className='value'>
                                            <CustomSelect
                                                options={options}
                                                blockId={data.id}
                                                funcParamName={parameter.id}
                                                funcParamType={parameter.type}
                                                type='parameters'
                                            />
                                        </div>

                                        <div className='delete_button' onClick={() => handleDeleteParameter(parameter.id, parameters1, setParameters1, 'input_parameters')}>
                                            <Trash className='delete_img' />
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </IntaractiveSection>
                    </div>
                </div>

                <div className='code'>
                    <AceEditor
                        mode="python"
                        theme="dracula"
                        name="code-editor"
                        width="100%"
                        height="100%"
                        value={code}
                        onChange={(newValue) => {
                            updateCode(newValue);
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
                                <div className='addButton' onClick={() => addParameter(setParameters)}>
                                    +
                                </div>}>
                            <header >
                                <div className='header-name'>Название</div>
                                <div className='header-type'>Тип</div>
                            </header>
                            <div className='parametrs'>
                                {parameters.map(parameter => (
                                    <div key={parameter.id} className='parameter' >
                                        <div className='parameter_name'>
                                            <input placeholder="Имя параметра"
                                                onChange={(e) => saveParameterToData(parameter.id, e.target.value, 'name', 'output_parameters', setParameters)}
                                            ></input>
                                        </div>
                                        <div className='type_value'>
                                            <select
                                                onChange={(e) => saveParameterToData(parameter.id, e.target.value, 'type', 'output_parameters', setParameters)}
                                            >
                                                {dataTypes.map((item, index) => (
                                                    <option key={index} value={item.type}>
                                                        {item.type}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className='value'> {parameter.value}</div>
                                        <div className='delete_button' onClick={() => handleDeleteParameter(parameter.id, parameters, setParameters, 'output_parameters')}>
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