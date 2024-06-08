import React, { memo, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import '../../css/initialNodes.css';
import CustomSelect from '../AdditionalComponents/customSelect.jsx';
import { useBlocks, useParameterBlocksData } from '../../stores/store.js';

const ConditionBlock = ({ data, isConnectable }) => {
    const blocks = useBlocks((state) => state.blocks);
    const [options, setOptions] = useState([]);
    const [incomingParameterBlocksIds, setIncomingParameterBlocksIds] = useState([]);
    const parameterBlocks = useParameterBlocksData((state) => state.blocks);
    const [rightBlocks, setRightBlocks] = useState([]);

    

    useEffect(() => {
        const currentBlock = blocks.find(block => block.selfId === data.id);
        if (currentBlock) {
            setOptions(currentBlock.outcomeConnections);
        }


    }, [blocks, data.id]);

    const cleanData = (deletedIds) => {
        const blocks = useBlocks.getState().blocks;  // Получаем текущее состояние блоков
        const currentBlock = blocks.find((block) => block.selfId === data.id);
        if (!currentBlock) return;

        // Функция для фильтрации параметров
        const filterParameter = (param) => {
            return deletedIds.includes(param?.from_block_id) ? null : param;
        };

        // Очищаем параметры A и B
        const newParameterA = filterParameter(currentBlock.data.parameters.inputs.parameterA);
        const newParameterB = filterParameter(currentBlock.data.parameters.inputs.parameterB);

        // Обновляем данные блока без создания события
        useBlocks.getState().setBlockData(data.id, {
            ...currentBlock.data,
            parameters: {
                ...currentBlock.data.parameters,
                inputs: {
                    parameterA: newParameterA,
                    parameterB: newParameterB,
                },
            }
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

        const findRightBlocks = (blocks, id) => {
            return blocks
                .filter(block => (block.type === 'functionBlock' || block.type === 'codeBlock') && block.incomeConnections.includes(id));
        };

        const getOutputParameters = (blocks, leftIds) => {
            return blocks.reduce((acc, block) => {
                if (leftIds.includes(block.selfId)) {
                    acc[block.data.label] = Object.keys(block.data.output_parameters).map(key => {
                        const param = block.data.output_parameters[key];
                        return {
                            from_block_id: block.selfId,
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

        const currentBlock = blocks.find(block => block.selfId === data.id);
        if (currentBlock) {
            setIncomingParameterBlocksIds(currentBlock.incomeConnections);
        }

        setRightBlocks(findRightBlocks(blocks, data.id));

        const incomingParameters = getIncomingParameters(parameterBlocks, incomingParameterBlocksIds);
        const leftIds = findLeftIds(blocks, data.id);
        const outputParameters = getOutputParameters(blocks, leftIds);
        const combinedObj = { ...outputParameters, ...incomingParameters };

        setOptions(combinedObj);




        const leftIds2 = blocks
            .filter(
                (block) =>
                    (block.type === 'functionBlock' || block.type === 'codeBlock') &&
                    block.outcomeConnections.includes(data.id)
            )
            .map((block) => block.selfId);

        const getContainedIds = () => {
            const block = blocks.find((b) => b.selfId === data.id);
            if (!block || !block.data.parameters || !block.data.parameters.inputs) return [];

            const parameterA = block.data.parameters.inputs.parameterA || {};
            const parameterB = block.data.parameters.inputs.parameterB || {};
            return [parameterA, parameterB].map(param => param.from_block_id).filter(id => id);
        };

        const arrayDifference = (arr1, arr2) => {
            return arr1.filter(id => !arr2.includes(id));
        };

        const checkForDeletedBlocks = () => {
            const block = blocks.find((b) => b.selfId === data.id);
            if (!block) return;
            if (!block.data) return;
            if (!block.data.parameters) return;
            if (!block.data.parameters.inputs) return;
            
            const containedIds = getContainedIds();
            const diff = arrayDifference(containedIds, leftIds2);
            if (!containedIds.length || diff.length > 0) {
                cleanData(diff);
            }
        };

        checkForDeletedBlocks();


    }, [parameterBlocks, incomingParameterBlocksIds, blocks, data.id]);

    const conditions = [
        { id: 1, condition: "Equal", description: "Равно" },
        { id: 2, condition: "NotEqual", description: "Не равно" },
        { id: 3, condition: "GreaterThan", description: "Больше" },
        { id: 4, condition: "LessThan", description: "Меньше" },
        { id: 5, condition: "GreaterThanOrEqual", description: "Больше или равно" },
        { id: 6, condition: "LessThanOrEqual", description: "Меньше или равно" },
        { id: 7, condition: "BothTrue", description: "Оба истинны" },
        { id: 8, condition: "BothFalse", description: "Оба ложны" },
        { id: 9, condition: "EitherTrue", description: "Одно истинно" },
        { id: 0, condition: "EitherFalse", description: "Одно ложно" }
    ];

    return (
        <div className='condition-block'>
            <div className='condition-label-if'>
                <label>Если</label>
            </div>
            <div className='condition-content'>
                <header className='condition-content-header'>
                    <div className='condition-header-item'>Параметр А</div>
                    <div className='condition-header-item'>Условие</div>
                    <div className='condition-header-item'>Параметр Б</div>
                </header>
                <div className='condition-selects'>
                    <CustomSelect
                        options={options}
                        blockId={data.id}
                        type='parameters'
                        funcParamName='parameterA'
                    />
                    <CustomSelect
                        options={conditions}
                        blockId={data.id}
                        type='conditions'
                        funcParamName='condition'
                    />
                    <CustomSelect
                        options={options}
                        blockId={data.id}
                        type='parameters'
                        funcParamName='parameterB'
                    />
                </div>
                <div className='condition-content-step'>
                    <header className='condition-content-header'>
                        <div className='condition-header-item'>Блок для перехода</div>
                    </header>
                    <CustomSelect
                        options={rightBlocks}
                        blockId={data.id}
                        type='blocks'
                        funcParamName='outputIfTrue'
                    />
                </div>
            </div>
            <div className='condition-label-else'>
                <label>Иначе</label>
            </div>
            <div className='condition-content-step'>
                <header className='condition-content-header'>
                    <div className='condition-header-item'>Блок для перехода</div>
                </header>
                <CustomSelect
                    options={rightBlocks}
                    blockId={data.id}
                    type='blocks'
                    funcParamName='outputIfFalse'
                />
            </div>
        </div>
    );
};

export default memo(({ data, isConnectable }) => {
    return (
        <>
            <Handle
                className='HandleComponent'
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
            />
            <div className='node' tabIndex="0">
                <div>
                    <div>{data.label}</div>
                    <hr></hr>
                </div>
                <ConditionBlock data={data} isConnectable={isConnectable} />
            </div>
            <Handle
                className='HandleComponent'
                type="source"
                id="a"
                position={Position.Right}
                isConnectable={isConnectable}
            />
        </>
    );
});
