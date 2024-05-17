import React, { memo, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import './initialNodes.css';
import { useBlocks } from '../../stores/store';



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

    return (
        <div className='condition-block'>
            <div className='condition-input'>
                <label>Условие:</label>
                <input type='text' value={condition} onChange={handleConditionChange} />
            </div>
            <div className='options-list'>
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
            </div>
        </div>
    );
};

export default memo(({ data, isConnectable }) => {
    return (
        <>
            <div className='node' tabIndex="0">
                <div>
                    <div>{data.label}</div>
                </div>

                <ConditionBlock data={data} isConnectable={isConnectable} />

                <Handle
                    className='HandleComponent'
                    type="source"
                    position={Position.Right}
                    isConnectable={isConnectable}
                />
                <Handle
                    className='HandleComponent'
                    type="target"
                    position={Position.Left}
                    isConnectable={isConnectable}
                />
            </div>
        </>
    );
});
