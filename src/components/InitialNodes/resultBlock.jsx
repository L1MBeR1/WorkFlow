import React, { memo, useEffect, useState, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import CustomCheckBox from './CustomCheckBox.jsx';
import './initialNodes.css';
import { useBlocks } from '../../store'; 

export default memo(({ data, isConnectable }) => {
    const blocks = useBlocks((state) => state.blocks);
    const [textdata, settextdata] = useState([]);
    const [incomingParameterBlocksIds, setincomingParameterBlocksIds] = useState([]);
    const textfield_reference = useRef(null);

    useEffect(() => {
        console.log('handled update of blocks');
        console.log(blocks);

        let left_ids = [];
        const get_left = (id) => {
            blocks.forEach(element => {
                if (
                    element.type === 'custom' &&
                    element.outcomeConnections.includes(id)
                ) {
                    left_ids.push(element.selfId);
                    get_left(element.selfId)
                }
            });
        }
        get_left(data.id);

        let tmpParameters = [];
        blocks.forEach(element => {
            if (element.selfId === data.id) {
                setincomingParameterBlocksIds(element.incomeConnections);
            }
            if (left_ids.includes(element.selfId)) {
                tmpParameters = [...tmpParameters, element.data];
            }

        });


        function formatJSONText(jsonText) {
            let result = '';
            let indentLevel = 0;
            const tabSize = 4;
            const indentString = ' '.repeat(tabSize);

            for (let i = 0; i < jsonText.length; i++) {
                const char = jsonText[i];

                if (char === '{' || char === '[') {
                    result += char + '\n';
                    indentLevel++;
                    result += indentString.repeat(indentLevel);
                } else if (char === '}' || char === ']') {
                    result += '\n';
                    indentLevel--;
                    result += indentString.repeat(indentLevel);
                    result += char;
                } else if (char === ',') {
                    // result += char + '\n';
                    result += char + '';
                    result += indentString.repeat(indentLevel);
                } else {
                    result += char;
                }
            }

            return result;
        }


        //console.log('ggg', tmpParameters);
        let ttt = JSON.stringify(tmpParameters, null, 2);
        let text = formatJSONText(ttt);
        //textfield_reference.current.value = text;

        //console.log(text);
        settextdata(text);
        //textfield_reference.current.value = text;


    }, [blocks]);




    return (
        <>
            <div >
                <Handle
                    className='HandleComponent'
                    type="target"
                    position={Position.Left}
                    isConnectable={isConnectable}
                />
                <div className='node result-block' tabIndex="0">
                    {data.label}
                    <hr></hr>
                    <div className='result-block-content'>
                        <CustomCheckBox></CustomCheckBox>
                    </div>
                </div >


                <div className='Поле-для-параметров'>
                    <textarea
                        ref={textfield_reference}
                        name="generated-specification"
                        id="text-specification"
                        value={textdata}
                        rows={50}
                        cols={80}
                        
                    >

                    </textarea>
                </div>

            </div>
        </>
    );
});