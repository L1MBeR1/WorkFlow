import React, { memo, useRef, useEffect,useState } from 'react';
import { Handle, Position } from 'reactflow';
import { useBlocks } from '../../store';
import { ReactComponent as Trash } from './trash.svg';
import { v4 as uuidv4 } from 'uuid';
import IntaractiveSection from '../mycomponent/intaractiveSection';

export default memo(({ data, isConnectable }) => {
    const blocks = useBlocks((state) => state.blocks);
    //const {blocks} = useBlocks();
    const labelRef = useRef(null);

    const [inputParameters, setInputParameters] = useState([{ id: uuidv4(), name: '', type: 'string', value: '' }]);
    const [outputParameters, setOutputParameters] = useState([{ id: uuidv4(), name: '', type: 'string', value: '' }]);

    const addInputParameter= () => {
        let newParameter = {
            id: `${uuidv4()}`,
            name: '',
            type: 'string',
            value: ''
        };
        setInputParameters([...inputParameters, newParameter]);

    };
    const addOutputParameter= () => {
        let newParameter = {
            id: `${uuidv4()}`,
            name: '',
            type: 'string',
            value: ''
        };
        setOutputParameters([...outputParameters, newParameter]);

    };
    useEffect(() => {
        //labelRef.current.innerHTML = blocks;  //data.label;
        console.log(blocks);
        

    }, [blocks]);


    return (
        <>
            <div div className='node'tabIndex="0">
                <Handle
                    className='HandleComponent'
                    type="target"
                    position={Position.Left}
                    isConnectable={isConnectable}
                />

                <div ref={labelRef} >
                <div 
                    // contentEditable={true} 
                    // onBlur={handleBlur}
                    >
                        {data.label}
                    </div>
                    <hr></hr>
                    <IntaractiveSection sectionName='Входные параметры' visible=''
                     button={
                     <div className='addButton' onClick={addInputParameter}>
                     +
                    </div>}>
                        <header >
                            <div   className='header-name'>Название</div>
                            <div className='header-type'>Тип</div>
                            <div className='header-value'>Значение</div>
                        </header>
                        <div className='parametrs'>
                            {inputParameters.map(parameter => (
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
                                        <input placeholder="Значение" 
                                        // onChange={(e) => handleValueChange(parameter.id, e.target.value)}
                                        ></input>
                                    </div>
                                    <div className='delete_button' 
                                    // onClick={() => handleDeleteParameter(parameter.id)}
                                    >
                                        <Trash className='delete_img' />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </IntaractiveSection>
                    <IntaractiveSection sectionName='Выходные параметры' visible=''
                     button={
                     <div className='addButton' onClick={addOutputParameter}>
                     +
                    </div>}>
                        <header >
                            <div   className='header-name'>Название</div>
                            <div className='header-type'>Тип</div>
                            <div className='header-value'>Значение</div>
                        </header>
                        <div className='parametrs'>
                            {outputParameters.map(parameter => (
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
                                        <input placeholder="Значение" 
                                        // onChange={(e) => handleValueChange(parameter.id, e.target.value)}
                                        ></input>
                                    </div>
                                    <div className='delete_button' 
                                    // onClick={() => handleDeleteParameter(parameter.id)}
                                    >
                                        <Trash className='delete_img' />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </IntaractiveSection>
                </div>
                <Handle
                    className='HandleComponent'
                    type="source"
                    position={Position.Right}
                    isConnectable={isConnectable}
                />
            </div>
        </>
    );
});