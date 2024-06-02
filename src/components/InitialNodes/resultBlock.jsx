import React, { memo, useEffect, useState, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import CustomSelect from '../AdditionalComponents/customSelect.jsx';
import '../../css/initialNodes.css';
import { useBlocks, useDataTypes } from '../../stores/store.js';
import IntaractiveSection from '../AdditionalComponents/intaractiveSection.jsx';
import { v4 as uuidv4 } from 'uuid';
import { ReactComponent as Trash } from '../../images/InitialNodes/trash.svg';
export default memo(({ data, isConnectable }) => {
    const blocks = useBlocks((state) => state.blocks);
    const dataTypes = useDataTypes((state) => state.types);
    const [options, setOptions] = useState([]);
    const [incomingParameterBlocksIds, setincomingParameterBlocksIds] = useState([]);
    const [parameters, setParameters] = useState([{ id: uuidv4(), name: '', type: 'string', value: '' }]);
    const updateBlock = useBlocks((state) => state.updateBlock);

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

    useEffect(() => {
        parameters.forEach(parameter => {
            changeName(parameter.id, '');
            changeType(parameter.id, 'string');
        });
    }, [parameters]);

    const changeName = (id, value) => {
        const block = blocks.find(block => block.selfId === data.id);
        if (!block) return;

        const { parameters } = block.data;
        const inputParameters = parameters?.inputs ?? {};

        const newOutputParameters = {
            ...block.data.output_parameters,
            [id]: {
                ...block.data.output_parameters?.[id],
                blockId: block.incomeConnections[0],
                name: value,
                value: inputParameters[id]?.value ?? '---',
                outputId: inputParameters[id]?.id ?? ''
            }
        };

        const newData = {
            ...block.data,
            output_parameters: newOutputParameters
        };

        updateBlock(data.id, newData);
    };


    // TODO: Переписать
    useEffect(() => {
        let left_ids = [];
        const get_left = (id) => {
            blocks.forEach(element => {
                if (
                    (element.type === 'custom' || element.type === 'codeBlock') &&
                    element.outcomeConnections.includes(id)
                ) {
                    left_ids.push(element.selfId);
                }
            });
        }
        get_left(data.id);

        let outputParams = {};
        blocks.forEach(block => {
            if (block.selfId === data.id) {
                setincomingParameterBlocksIds(block.incomeConnections);
            }
            if (block.type === 'custom') {
                if (left_ids.includes(block.selfId)) {
                    outputParams[block.data.label] = block.data.output_parameters.map(param => ({
                        // id: param.id,
                        id: block.selfId,
                        type: param.type,
                        value: '---',
                        name: param.name,
                    }));
                }
            } else if (block.type === 'codeBlock') {
                let tmp_params = [];
                if (left_ids.includes(block.selfId)) {

                    Object.keys(block.data.output_parameters).forEach(key => {
                        const paramCollection = block.data.output_parameters[key];
                        if (typeof paramCollection === 'object') {
                            outputParams[block.data.label] = [];
                        
                            tmp_params.push({
                                // id: paramCollection.id,
                                id: block.selfId,
                                type: paramCollection.type,
                                value: paramCollection.value || '---',
                                name: paramCollection.name,
                            });
                        }
                    });
                }
                outputParams[block.data.label] = tmp_params;

            }
        });

        setOptions(outputParams);
    }, [incomingParameterBlocksIds, blocks]);

    const changeType = (id, value) => {
        const block = blocks.find(block => block.selfId === data.id);
        if (!block) return;

        const { parameters } = block.data;
        const inputParameters = parameters?.inputs ?? {};

        const newOutputParameters = {
            ...block.data.output_parameters,
            [id]: {
                ...block.data.output_parameters?.[id],
                blockId: block.incomeConnections[0],
                type: value,
                value: inputParameters[id]?.value ?? '---',
                outputId: inputParameters[id]?.id ?? ''
            }
        };

        const newData = {
            ...block.data,
            output_parameters: newOutputParameters
        };

        updateBlock(data.id, newData);
    };

    return (
        <>
            {/* <button onClick={printOutputParamsToConsole}> Options в консоли </button> */}
            <div className='node' tabIndex="0">
                <Handle
                    className='HandleComponent'
                    type="target"
                    position={Position.Left}
                    isConnectable={isConnectable}
                />
                <div >
                    {data.label}
                    <hr></hr>
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
                                            <input placeholder="Имя параметра" style={{ height: '100%' }}
                                                onChange={(e) => changeName(parameter.id, e.target.value)}
                                            ></input>
                                        </div>
                                        <div className='type_value'>
                                            <select
                                                onChange={(e) => changeType(parameter.id, e.target.value)}
                                            >
                                                {/* <option value="string">string</option>
                                                <option value="number">number</option>
                                                <option value="boolean">boolean</option> */}
                                                {dataTypes.map((item, index) => (
                                                    <option key={index} value={item.type}>{item.type}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className='value'>
                                            <CustomSelect
                                                options={options}
                                                blockId={data.id}
                                                funcParamType={parameter.type}
                                                funcParamName={parameter.id}
                                                type='parameters'
                                            >
                                            </CustomSelect>
                                        </div>
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