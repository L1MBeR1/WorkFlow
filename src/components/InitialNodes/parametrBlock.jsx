import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { ReactComponent as Trash } from './trash.svg';
import './initialNodes.css';
import { useParameterBlocksData } from '../../store';
import { v4 as uuidv4 } from 'uuid';

export default memo(({ data, isConnectable }) => {
    const updateParameterBlock = useParameterBlocksData((state) => state.update);
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
        updateParameterBlock(data.id, updatedParameters);
        //console.log('settedDel', updatedParameters);
        
    };
    const handleNameChange = (paramid, newName) => {
        const updatedParameters = parameters.map(param => {
            if (param.id === paramid) {
                return { ...param, name: newName };
            }
            return param;
        });
        setParameters(updatedParameters);
        /*data.function_to_update_parameters(data.id, updatedParameters);*/
        updateParameterBlock(data.id, updatedParameters);
    };

    const handleTypeChange = (paramid, newType) => {
        const updatedParameters = parameters.map(param => {
            if (param.id === paramid) {
                return { ...param, type: newType };
            }
            return param;
        });
        setParameters(updatedParameters);
        /*data.function_to_update_parameters(data.id, updatedParameters);*/
        updateParameterBlock(data.id, updatedParameters);
    };

    
    const handleValueChange = (paramid, newValue) => {
        const updatedParameters = parameters.map(param => {
            if (param.id === paramid) {
                return { ...param, value: newValue };
            }
            return param;
        });
        setParameters(updatedParameters);
        /*data.function_to_update_parameters(data.id, updatedParameters);*/
        updateParameterBlock(data.id, updatedParameters);
        //data.parameters = updatedParameters;
    };


    return (
        <>
            <div>
                <div className='parametrNode'tabIndex="0" >
                    <div>
                        {data.label}
                    </div>
                    <hr></hr>
                    <header >
                        <div className='header-name'>Название</div>
                        <div className='header-type'>Тип</div>
                        <div className='header-value'>Значение</div>
                    </header>
                    <div className='parametrs'>
                        {parameters.map(parameter => (
                            <div key={parameter.id} className='parameter' >
                                <div className='parameter_name'>
                                    <input placeholder="Имя параметра" onChange={(e) => handleNameChange(parameter.id, e.target.value)}></input>
                                </div>
                                <div className='type_value'>
                                    <select onChange={(e) => handleTypeChange(parameter.id, e.target.value)}>
                                        <option value="string">String</option>
                                        <option value="number">Number</option>
                                        <option value="boolean">Boolean</option>
                                    </select>
                                    <input placeholder="Значение" onChange={(e) => handleValueChange(parameter.id, e.target.value)}></input>
                                </div>
                                <div className='delete_button' onClick={() => handleDeleteParameter(parameter.id)}>
                                    <Trash className='delete_img' />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='addButton' onClick={addParameter}>
                        +
                    </div>
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