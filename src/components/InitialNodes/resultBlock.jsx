import React, { memo, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import CustomSelect from '../AdditionalComponents/customSelect.jsx';
import '../../css/initialNodes.css';
import { useBlocks, useDataTypes } from '../../stores/store.js';
import IntaractiveSection from '../AdditionalComponents/intaractiveSection.jsx';
import { v4 as uuidv4 } from 'uuid';
import { ReactComponent as Trash } from '../../images/InitialNodes/trash.svg';

const NodeComponent = ({ data, isConnectable }) => {
    const blocks = useBlocks((state) => state.blocks);
    const dataTypes = useDataTypes((state) => state.types);
    const updateBlock = useBlocks((state) => state.updateBlock);

    const initialParameter = { id: uuidv4(), name: '', type: 'int', value: '' };
    const [parameters, setParameters] = useState([initialParameter]);
    const [dataFromConnectedNodes, setDataFromConnectedNodes] = useState([]);

    const addParameter = () =>
        setParameters([...parameters, { id: uuidv4(), name: '', type: 'int', value: '' }]);
    const deleteParameter = (id) =>
        setParameters(parameters.filter((param) => param.id !== id));

    const updateParameters = (id, key, value) => {
        const block = blocks.find((block) => block.selfId === data.id);
        if (!block) {
            console.log('no block');
            return;
        }

        const newOutputParams = {
            ...block.data.output_parameters,
            [id]: {
                ...block.data.output_parameters?.[id],
                [key]: value,
            },
        };

        const updatedParameters = parameters.map((param) =>
            param.id === id ? { ...param, [key]: value } : param
        );

        setParameters(updatedParameters);
        updateBlock(data.id, { ...block.data, output_parameters: newOutputParams });
    };

    useEffect(() => {
        const leftIds = blocks
            .filter(
                (block) =>
                    (block.type === 'functionBlock' || block.type === 'codeBlock') &&
                    block.outcomeConnections.includes(data.id)
            )
            .map((block) => block.selfId);

        const outputParams = blocks.reduce((acc, block) => {
            if (block.selfId === data.id) return acc;

            if (
                (block.type === 'functionBlock' || block.type === 'codeBlock') &&
                leftIds.includes(block.selfId)
            ) {
                const params = Object.values(block.data.output_parameters).map(
                    (param) => ({
                        from_block_id: block.data.id,
                        id: param.id,
                        type: param.type,
                        value: param.value || '---',
                        name: param.name,
                    })
                );

                acc[block.data.label] = params;
            }

            return acc;
        }, {});

        setDataFromConnectedNodes(outputParams);
    }, [blocks, data.id]);

    useEffect(() => {
        updateParameters(initialParameter.id, 'name', '-');
        updateParameters(initialParameter.id, 'type', 'int');
    }, []); 

    return (
        <div className='node' tabIndex='0'>
            <Handle
                className='HandleComponent'
                type='target'
                position={Position.Left}
                isConnectable={isConnectable}
            />

            <div>
                {data.label}
                <hr />
                <div className='result-block-content'>
                    <IntaractiveSection
                        sectionName='Выходные параметры'
                        visible='true'
                        button={<div className='addButton' onClick={addParameter}>+</div>}
                    >
                        <header>
                            <div className='header-name'>Название</div>
                            <div className='header-type'>Тип</div>
                            <div className='header-value'>Значение</div>
                        </header>
                        <div className='parameters'>
                            {parameters.map((parameter) => (
                                <div key={parameter.id} className='parameter'>
                                    <div className='parameter_name'>
                                        <input
                                            placeholder='Имя параметра'
                                            onChange={(e) =>
                                                updateParameters(parameter.id, 'name', e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className='type_value'>
                                        <select
                                            value={parameter.type}
                                            onChange={(e) =>
                                                updateParameters(parameter.id, 'type', e.target.value)
                                            }
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
                                            options={dataFromConnectedNodes}
                                            blockId={data.id}
                                            funcParamType={parameter.type}
                                            funcParamName={parameter.id}
                                            type='parameters_from_resultblock'
                                        />
                                    </div>

                                    <div className='delete_button' onClick={() => deleteParameter(parameter.id)}>
                                        <Trash className='delete_img' />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </IntaractiveSection>
                </div>
            </div>
        </div>
    );
};

export default memo(NodeComponent);
