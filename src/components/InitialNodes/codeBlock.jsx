import React, { memo, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import AceEditor from 'react-ace';
import { useBlocks, useParameterBlocksData, useDataTypes } from '../../stores/store.js';
import IntaractiveSection from '../AdditionalComponents/intaractiveSection';
import { v4 as uuidv4 } from 'uuid';
import CustomSelect from '../AdditionalComponents/customSelect.jsx';
import '../../css/initialNodes.css';
import { ReactComponent as Trash } from '../../images/InitialNodes/trash.svg';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-dracula';
import { defaultCode } from './defaultCode.jsx';

const ParameterSection = ({
    sectionName,
    parameters,
    addParameterFunc,
    deleteParameterFunc,
    handleSaveParameter,
    options,
    blockId,
    type
}) => (
    <div className='outputs'>
        <div className='code-block-content'>
            <IntaractiveSection
                sectionName={sectionName}
                visible={true}
                button={<div className='addButton' onClick={addParameterFunc}>+</div>}
            >
                <header>
                    <div className='header-name'>Название</div>
                    <div className='header-type'>Тип</div>
                    {type === 'input' && <div className='header-value'>Значение</div>}
                </header>
                <div className='parameters'>
                    {parameters.map(parameter => (
                        <div key={parameter.id} className='parameter'>
                            <div className='parameter_name'>
                                <input
                                    placeholder="Имя параметра"
                                    onChange={(e) => handleSaveParameter(`${type}_parameters`, parameter.id, { ...parameter, name: e.target.value })}
                                />
                            </div>
                            <div className={type === 'input' ? 'code_parameter_type' : 'type_value'}>
                                {type === 'input' ? (
                                    parameter.type
                                ) : (
                                    <select
                                        onChange={(e) => handleSaveParameter(`${type}_parameters`, parameter.id, { ...parameter, type: e.target.value })}
                                    >
                                        {options.map((item, index) => (
                                            <option key={index} value={item.type}>{item.type}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            {type === 'input' && (
                                <div className='code-type_value'>
                                    <CustomSelect
                                        options={options}
                                        blockId={blockId}
                                        funcParamName={parameter.name}
                                        funcParamType={parameter.type}
                                        type='parameters'
                                    />
                                </div>
                            )}
                            {type === 'output' && <div className='value'>{parameter.value}</div>}
                            <div className='delete_button' onClick={() => deleteParameterFunc(parameter.id)}>
                                <Trash className='delete_img' />
                            </div>
                        </div>
                    ))}
                </div>
            </IntaractiveSection>
        </div>
    </div>
);


export default memo(({ data, isConnectable }) => {
    const blocks = useBlocks((state) => state.blocks);
    const updateBlock = useBlocks((state) => state.updateBlock);
    const dataTypes = useDataTypes((state) => state.types);
    const [options, setOptions] = useState([]);
    const [parameters, setParameters] = useState([{ id: uuidv4(), name: '', type: 'string', value: '' }]);
    const [parameters1, setParameters1] = useState([{ id: uuidv4(), name: '', type: 'string', value: '' }]);
    const [incomingParameterBlocksIds, setincomingParameterBlocksIds] = useState([]);
    const parameterBlocks = useParameterBlocksData((state) => state.blocks);
    const [code, setCode] = useState(defaultCode);

    const updateCode = () => {
        updateBlock(data.id, {
            ...blocks.find(block => block.selfId === data.id).data,
            code: code
        });
    };

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
        console.log(parameterBlocks, incomingParameterBlocksIds)
    }, [parameterBlocks, incomingParameterBlocksIds, blocks]);

    useEffect(() => {
        parameters.forEach(parameter => {
            handleSaveParameter('output_parameters', parameter.id, { id: parameter.id, name: '', type: 'string', value: '---' });
        });
    }, [parameters]);

    const addParameter = (setParametersFunc, parameters) => {
        const newParameter = {
            id: `${uuidv4()}`,
            name: '',
            type: 'string',
            value: ''
        };
        setParametersFunc([...parameters, newParameter]);
    };

    const handleDeleteParameter = (setParametersFunc, parameters, paramid) => {
        const updatedParameters = parameters.filter(param => param.id !== paramid);
        setParametersFunc(updatedParameters);
    };

    const updateParameters = (blocks, blockId, paramType, id, updates) => {
        let newData;
        blocks.forEach(block => {
            if (block.selfId === blockId) {
                if (!block.data[paramType]) {
                    block.data[paramType] = [];
                }
                if (!block.data[paramType][id]) {
                    block.data[paramType][id] = {};
                }
                newData = {
                    ...block.data,
                    [paramType]: {
                        ...block.data[paramType],
                        [id]: {
                            ...block.data[paramType][id],
                            ...updates,
                        },
                    },
                };
            }
        });
        return newData;
    };

    const handleSaveParameter = (paramType, id, updates) => {
        const newData = updateParameters(blocks, data.id, paramType, id, updates);
        updateBlock(data.id, newData);
    };

    return (
        <>
            <div className='node' tabIndex="0">
                <Handle
                    className='HandleComponent'
                    type="target"
                    position={Position.Left}
                    isConnectable={data.isConnectable}
                />
                <Handle
                    className='HandleComponent'
                    type="source"
                    position={Position.Right}
                    isConnectable={data.isConnectable}
                />

                <div>
                    <div>{data.label}</div>
                    <hr />
                </div>

                <ParameterSection
                    sectionName='Входные параметры'
                    parameters={parameters1}
                    addParameterFunc={() => addParameter(setParameters1, parameters1)}
                    deleteParameterFunc={(paramId) => handleDeleteParameter(setParameters1, parameters1, paramId)}
                    handleSaveParameter={handleSaveParameter}
                    options={options}
                    blockId={data.id}
                    type='input'
                />

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
                            setCode(newValue);
                        }}
                        setOptions={{
                            showLineNumbers: true,
                            tabSize: 2,
                        }}
                    />
                </div>

                <ParameterSection
                    sectionName='Выходные параметры'
                    parameters={parameters}
                    addParameterFunc={() => addParameter(setParameters, parameters)}
                    deleteParameterFunc={(paramId) => handleDeleteParameter(setParameters, parameters, paramId)}
                    handleSaveParameter={handleSaveParameter}
                    options={dataTypes}
                    blockId={data.id}
                    type='output'
                />
            </div>
        </>
    );
});
