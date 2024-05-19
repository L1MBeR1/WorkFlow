import React, { memo, useEffect, useState, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import CustomSelect from '../mycomponent/CustomSelect.jsx';
import './initialNodes.css';
import { useBlocks } from '../../stores/store.js';
import IntaractiveSection from '../mycomponent/intaractiveSection.jsx';
import { v4 as uuidv4 } from 'uuid';
import { ReactComponent as Trash } from './trash.svg';
export default memo(({ data, isConnectable }) => {
    const blocks = useBlocks((state) => state.blocks);
    const [options, setOptions] = useState([]);
    const [incomingParameterBlocksIds, setincomingParameterBlocksIds] = useState([]);
    const [parameters, setParameters] = useState([{ id: uuidv4(), name: '', type: 'string', value: '' }]);

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
    };

    // TODO: Переписать
    useEffect(() => {
        let left_ids = [];
        const get_left = (id) => {
            blocks.forEach(element => {
                if (
                    element.type === 'custom' &&
                    element.outcomeConnections.includes(id)
                ) {
                    left_ids.push(element.selfId);
                }
            });
        }
        get_left(data.id);

        let outputParams = {};
        blocks.forEach(block => {
            if (block.selfId === data.id) {
                setincomingParameterBlocksIds(block.incomeConnections);
            }
            if (left_ids.includes(block.selfId)) {
                outputParams[block.data.label] = block.data.output_parameters.map(param => ({
                    id: param.id,
                    type: param.type,
                    value: '---',
                    name: param.name,
                }));
            }
        });

        setOptions(outputParams);
    }, [incomingParameterBlocksIds, blocks]);

    const handleTypeChange = (paramid, newType) => {
        console.log(parameters)
        const updatedParameters = parameters.map(param => {
            if (param.id === paramid) {
                return { ...param, type: newType };
            }
            return param;
        });
        setParameters(updatedParameters);
        /*data.function_to_update_parameters(data.id, updatedParameters);*/
    };



    const printOutputParamsToConsole = () => {
        console.log('options', options);
    }
    return (
        <>
            <button onClick={printOutputParamsToConsole}> Options в консоли </button>
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
                                <div className='header-name'>Название</div>
                                <div className='header-type'>Тип</div>
                                <div className='header-value'>Значение</div>
                            </header>
                            <div className='parametrs'>
                                {parameters.map(parameter => (
                                    <div key={parameter.id} className='parameter' >
                                        <div className='parameter_name'>
                                            <input placeholder="Имя параметра" style={{ height: '100%' }}
                                            // onChange={(e) => handleNameChange(parameter.id, e.target.value)}
                                            ></input>
                                        </div>
                                        <div className='type_value'>
                                            <select
                                                onChange={(e) => handleTypeChange(parameter.id, e.target.value)}
                                            >
                                                <option value="string">string</option>
                                                <option value="number">number</option>
                                                <option value="boolean">boolean</option>
                                            </select>
                                        </div>
                                        <div className='value'>
                                            <CustomSelect
                                                options={options}
                                                blockId={data.id}
                                                funcParamType={parameter.type}
                                                type='parameters'
                                            >

                                            </CustomSelect>
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
            </div>
        </>
    );
});