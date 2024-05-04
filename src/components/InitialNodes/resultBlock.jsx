import React, { memo, useEffect, useState, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import CustomSelect from '../mycomponent/CustomSelect.jsx';
import './initialNodes.css';
import { useBlocks } from '../../store'; 
import IntaractiveSection from '../mycomponent/intaractiveSection.jsx';
import { v4 as uuidv4 } from 'uuid';
import { ReactComponent as Trash } from './trash.svg';
export default memo(({ data, isConnectable }) => {
    const blocks = useBlocks((state) => state.blocks);
    const [textdata, settextdata] = useState([]);
    const [incomingParameterBlocksIds, setincomingParameterBlocksIds] = useState([]);
    const textfield_reference = useRef(null);
    
    const [parameters, setParameters] = useState([{ id: uuidv4(), name: '', type: 'string', value: '' }]);

    const addParameter = () => {
        //paramID = `${uuidv4()}`;
        let newParameter = {
            id: `${uuidv4()}`,
            name: '',
            type: 'string',
            value: ''
        };
        setParameters([...parameters, newParameter]);
        // console.log(paramID)
        // console.log(parameters)
    };
    const handleDeleteParameter = (paramid) => {
        const updatedParameters = parameters.filter(param => param.id !== paramid);
        setParameters(updatedParameters);
        /*data.function_to_update_parameters(data.id, updatedParameters);*/
        // updateParameterBlock(data.id, updatedParameters);
        //console.log('settedDel', updatedParameters);
        
    };
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
                        {/* <CustomCheckBox></CustomCheckBox> */}
                        <IntaractiveSection sectionName='Выходные параметры' visible='true'
                     button={
                     <div className='addButton' onClick={addParameter}>
                     +
                    </div>}>
                        <header >
                            <div   className='header-name'>Название</div>
                            <div className='header-type'>Тип</div>
                            <div className='header-value'>Значение</div>
                        </header>
                        <div className='parametrs'>
                            {parameters.map(parameter => (
                                <div key={parameter.id} className='parameter' >
                                    <div className='parameter_name'>
                                        <input placeholder="Имя параметра" 
                                        // onChange={(e) => handleNameChange(parameter.id, e.target.value)}
                                        ></input>
                                    </div>
                                    <div className='type_value'>
                                        <select 
                                        // onChange={(e) => handleTypeChange(parameter.id, e.target.value)}
                                        >
                                            <option value="string">String</option>
                                            <option value="number">Number</option>
                                            <option value="boolean">Boolean</option>
                                        </select>
                                       
                                    </div>
                                    <div className='delete_button' onClick={() => handleDeleteParameter(parameter.id)}>
                                        <Trash className='delete_img' />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </IntaractiveSection>
                    </div>
                </div >


                {/* <div className='Поле-для-параметров'>
                    <textarea
                        ref={textfield_reference}
                        name="generated-specification"
                        id="text-specification"
                        value={textdata}
                        rows={50}
                        cols={80}
                        
                    >

                    </textarea>
                </div> */}

            </div>
        </>
    );
});