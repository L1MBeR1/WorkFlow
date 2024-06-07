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

    const cleanData = (deletedIds) => {
        const blocks = useBlocks.getState().blocks;  // Получаем текущее состояние блоков
        const currentBlock = blocks.find((block) => block.selfId === data.id);
        console.log('%c n-1', 'color: red; background: black; font-weight: bold');
        if (!currentBlock) return;

        // Фильтруем output_parameters, удаляя те, у которых from_block_id находится в deletedIds
        const newOutputParameters = Object.fromEntries(
            Object.entries(currentBlock.data.output_parameters).filter(
                ([key, param]) => !deletedIds.includes(param.from_block_id)
            )
        );
        console.log('%c n-2', 'color: red; background: black; font-weight: bold');
        console.log(newOutputParameters);
        // Прямо обновляем данные блока без создания события
        useBlocks.getState().setBlockData(data.id, { ...currentBlock.data, output_parameters: newOutputParameters });
    };



    useEffect(() => {
        console.log('%c Blocks or data.id changed', 'color: yellow; background: black; font-weight: bold');

        const leftIds = blocks
            .filter(
                (block) =>
                    (block.type === 'functionBlock' || block.type === 'codeBlock') &&
                    block.outcomeConnections.includes(data.id)
            )
            .map((block) => block.selfId);

        const getContainedIds = () => {
            const block = blocks.find((b) => b.selfId === data.id);
            if (!block || !block.data.output_parameters) {
                return [];
            }

            return Object.values(block.data.output_parameters).map(
                (param) => param.from_block_id
            );
        };

        const arrayDifference = (arr1, arr2) => {
            return arr1.filter(id => !arr2.includes(id));
        };

        const checkForDeletedBlocks = () => {
            console.log('%c leftIds', 'color: yellow; background: black; font-weight: bold');
            console.log(leftIds);
            console.log('%c Containded ids', 'color: yellow; background: black; font-weight: bold');
            console.log(getContainedIds());
    
            const containedIds = getContainedIds();
            if (!containedIds[0]) {
                return;
            }
            const diff = arrayDifference(containedIds, leftIds);
    
            if (diff.length > 0) {
                cleanData(diff);
            }
        };
    
        checkForDeletedBlocks();

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
