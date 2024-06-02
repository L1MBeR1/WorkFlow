import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { ReactComponent as Trash } from '../../images/InitialNodes/trash.svg';
import '../../css/initialNodes.css';
import { useParameterBlocksData, useDataTypes } from '../../stores/store';
import { v4 as uuidv4 } from 'uuid';
import IntaractiveSection from '../AdditionalComponents/intaractiveSection';

export default memo(({ data, isConnectable }) => {
    const dataTypes = useDataTypes((state) => state.types);
    const updateParameterBlock = useParameterBlocksData((state) => state.update);
    const updateParameterBlockLabel = useParameterBlocksData((state) => state.updateLabel);
    const [parameters, setParameters] = useState([{ id: uuidv4(), name: '', type: 'string', value: '' }]);
    const [header, setHeader] = useState(data.label);

    const addParameter = () => {
        let newParameter = {
            id: `${uuidv4()}`,
            name: '',
            type: 'string',
            value: ''
        };
        setParameters([...parameters, newParameter]);
    };
    const handleDeleteParameter = (paramid) => {
        const updatedParameters = parameters.filter(param => param.id !== paramid);
        setParameters(updatedParameters);
        updateParameterBlock(data.id, updatedParameters);
    };

    const updateParameter = (paramid, updates) => {
        const updatedParameters = parameters.map(param => {
            return param.id === paramid ? { ...param, ...updates } : param;
        });
        setParameters(updatedParameters);
        updateParameterBlock(data.id, updatedParameters);
    };

    const handleNameChange = (paramid, newName) => updateParameter(paramid, { name: newName });
    const handleTypeChange = (paramid, newType) => updateParameter(paramid, { type: newType });
    const handleValueChange = (paramid, newValue) => updateParameter(paramid, { value: newValue });


    const handleBlur = (e) => {
        setHeader(e.target.textContent);
        updateParameterBlockLabel(data.id, e.target.textContent)
    };

    return (
        <>
            <div className='node' tabIndex="0">
                <div  >
                    <div
                        onBlur={handleBlur}>
                        {header}
                    </div>
                    <hr></hr>
                    <IntaractiveSection sectionName='Параметры' visible='true'
                        button={
                            <div className='addButton' onClick={addParameter}>
                                +
                            </div>}>
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
                                            {/* <option value="string">String</option>
                                            <option value="number">Number</option>
                                            <option value="boolean">Boolean</option> */}
                                            {dataTypes.map((item, index) => (
                                                    <option key={index} value={item.type}>{item.type}</option>
                                                ))}
                                        </select>
                                        <input placeholder="Значение" onChange={(e) => handleValueChange(parameter.id, e.target.value)}></input>
                                    </div>
                                    <div className='delete_button' onClick={() => handleDeleteParameter(parameter.id)}>
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