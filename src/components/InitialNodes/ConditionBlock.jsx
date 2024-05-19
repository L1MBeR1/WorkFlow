import React, { memo, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import './initialNodes.css';
import CustomSelect from '../mycomponent/CustomSelect.jsx';
import { useBlocks, useParameterBlocksData } from '../../stores/store';

const ConditionBlock = ({ data, isConnectable }) => {
    const blocks = useBlocks((state) => state.blocks);

    const [options, setOptions] = useState([]);
    const [incomingParameterBlocksIds, setincomingParameterBlocksIds] = useState([]);
    const parameterBlocks = useParameterBlocksData((state) => state.blocks);
    const [rightBlocks, setrightBlocks] = useState([]);

    useEffect(() => {
        setOptions(blocks.find(block => block.selfId === data.id).outcomeConnections);
    }, [blocks.find(block => block.selfId === data.id).outcomeConnections]);

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
        const findRightBlocks = (blocks, id) => {
            return blocks
                .filter(block => (block.type === 'custom' || block.type === 'codeBlock') && block.incomeConnections.includes(id));
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
        setrightBlocks(findRightBlocks(blocks, data.id))
        console.log(findRightBlocks(blocks, data.id))
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
                    >
                    </CustomSelect>
                    <CustomSelect
                        options={conditions}
                        blockId={data.id}
                        type='conditions'
                        funcParamName='condition'
                    >
                    </CustomSelect>
                    <CustomSelect
                        options={options}
                        blockId={data.id}
                        type='parameters'
                        funcParamName='parameterB'
                    >
                    </CustomSelect>
                </div>
                <div className='condition-content-step'>
                    <header className='condition-content-header'>
                        <div className='condition-header-item'>Блок для перехода</div>
                    </header>
                    <CustomSelect
                            options={rightBlocks}
                            blockId={data.id}
                            type='blocks'
                            funcParamName='blocks'
                        >
                        </CustomSelect>
                </div>
            </div>
            <div className='condition-label-else'>
                <label>Иначе</label>
            </div>
            <div className='condition-content'>
                <header className='condition-content-header'>
                    <div className='condition-header-item'>Блок для перехода</div>
                </header>
                    <CustomSelect
                        options={rightBlocks}
                        blockId={data.id}
                        type='blocks'
                        funcParamName='blocks'
                    >
                    </CustomSelect>
            </div>
        </div>
    );
};

export default memo(({ data, isConnectable }) => {
    const blocks = useBlocks((state) => state.blocks);

    const printToConsole = () => {
      
        console.log(blocks.find(block => block.selfId === data.id));
    }

    return (
        <>
            <Handle
                    className='HandleComponent'
                    type="target"
                    position={Position.Left}
                    isConnectable={isConnectable}
                />
            <button onClick={printToConsole}> Выходные параметры в консоли </button>
            <div className='node' tabIndex="0"
            >
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
