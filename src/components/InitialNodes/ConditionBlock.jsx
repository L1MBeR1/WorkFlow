import React, { memo, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import './initialNodes.css';
import { useBlocks } from '../../stores/store';
import CustomSelect from '../mycomponent/CustomSelect.jsx';


const ConditionBlock = ({ data, isConnectable }) => {
    const blocks = useBlocks((state) => state.blocks);
    const [condition, setCondition] = useState('');
    const [options, setOptions] = useState([]);

    const handleConditionChange = (e) => {
        setCondition(e.target.value);
    };

    useEffect(() => {
        setOptions(blocks.find(block => block.selfId === data.id).outcomeConnections);
    }, [blocks.find(block => block.selfId === data.id).outcomeConnections]);

    const handleOptionChange = (id, newText) => {
        if (id === 'true') {
            data.true = newText;
        } else if (id === 'false') {
            data.false = newText;
        }
    };

    useEffect(() => {
        if (options.length > 0) {
            handleOptionChange('true', options[0]);
            handleOptionChange('false', options[0]);
        }
    }, [options]);
    const conditions = [
        { condition: "Equal", description: "Равно" },
        { condition: "NotEqual", description: "Не равно" },
        { condition: "GreaterThan", description: "Больше" },
        { condition: "LessThan", description: "Меньше" },
        { condition: "GreaterThanOrEqual", description: "Больше или равно" },
        { condition: "LessThanOrEqual", description: "Меньше или равно" },
        { condition: "BothTrue", description: "Оба истинны" },
        { condition: "BothFalse", description: "Оба ложны" },
        { condition: "EitherTrue", description: "Одно истинно" },
        { condition: "EitherFalse", description: "Одно ложно" }
    ];
    return (
        <div className='condition-block'>
            <div className='condition-label-if'>
                <label>Если</label>
                {/* <input type='text' value={condition} onChange={handleConditionChange} /> */}
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
                    >
                    </CustomSelect>
                    <CustomSelect
                    options={conditions}
                    blockId={data.id} // TODO Не уверен что именно так
                    type='conditions'
                    >
                    </CustomSelect>
                    <CustomSelect
                    options={options}
                    blockId={data.id}
                    type='parameters'
                    >
                    </CustomSelect>
                </div>
            </div>
            <div className='condition-label-else'>
                <label>Иначе</label>
            </div>
            {/* <div className='options-list'>
                {
                options.length > 0 ? (
                    <>
                        <div className='selector-true'>
                            <div className='option-item'>
                                <label>Вариант если TRUE:</label>
                                <select
                                    defaultValue={options[0]}
                                    onChange={(e) => handleOptionChange('true', e.target.value)}
                                >
                                    {options.map((opt, ind) => (
                                        <option key={ind} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='selector-false'>
                            <div className='option-item'>
                                <label>Вариант если FALSE:</label>
                                <select
                                    defaultValue={options[0]}
                                    onChange={(e) => handleOptionChange('false', e.target.value)}
                                >
                                    {options.map((opt, ind) => (
                                        <option key={ind} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </>
                ) : (
                    <div>Подключите узлы</div>
                )}
            </div> */}
        </div>
    );
};

export default memo(({ data, isConnectable }) => {
    return (
        <>
            <div className='node' tabIndex="0">
                <div>
                    <div>{data.label}</div>
                    <hr></hr>
                </div>

                <ConditionBlock data={data} isConnectable={isConnectable} />


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
                    style={{ top: 60}}
                    isConnectable={isConnectable}
                />
                <Handle
                    className='HandleComponent'
                    type="source"
                    position={Position.Right}
                    style={{  top: 125}}
                    isConnectable={isConnectable}
                />
            </div>
        </>
    );
});
