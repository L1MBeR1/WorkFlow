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
        console.log('Cond', id, newText);
        if (id === 'true') {
            data.true = newText;
        } else if (id === 'false') {
            data.false = newText;
        }
    };

    return (
        <div className='condition-block'>
            <div className='condition-input'>
                <label>Условие:</label>
                <input type='text' value={condition} onChange={handleConditionChange} />
            </div>
            <div className='options-list'>
                {options.length > 0 ?
                    // options.map((option, index) => (
                    //     <div key={index} className='option-item'>
                    //         <label>Вариант {option}:</label>
                    //         <select
                    //             value={option.text}
                    //             onChange={(e) => handleOptionChange(option, e.target.value)}
                    //         >
                    //             {options.map((opt, ind) => (
                    //                 <option key={ind} value={opt}>{opt}</option>
                    //             ))}
                    //         </select>
                    //     </div>
                    // ))
                    <>
                        <div className='selector-true'>
                            <div key={1} className='option-item'>
                                <label>Вариант если TRUE:</label>
                                <select
                                    onChange={(e) => handleOptionChange('true', e.target.value)}
                                >
                                    {options.map((opt, ind) => (
                                        <option key={ind} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='selector-false'>
                            <div key={2} className='option-item'>
                                <label>Вариант если FALSE:</label>
                                <select
                                    onChange={(e) => handleOptionChange('false', e.target.value)}
                                >
                                    {options.map((opt, ind) => (
                                        <option key={ind} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </>



                    :
                    <div>None</div>
                }
            </div>
        </div>
    );
};

export default memo(({ data, isConnectable }) => {
    const [header, setHeader] = useState(data.label);

    /*const handleBlur = (e) => {
                setHeader(e.target.textContent);
    };*/

    return (
        <>
            <div className='node' tabIndex="0">
                <div>
                    <div>{header}</div>
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
