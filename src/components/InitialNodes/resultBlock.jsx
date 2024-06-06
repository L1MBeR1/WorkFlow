import React, { memo, useEffect, useState } from 'react';
import { Background, Handle, Position } from 'reactflow';
import CustomSelect from '../AdditionalComponents/customSelect.jsx';
import '../../css/initialNodes.css';
import { useBlocks, useDataTypes } from '../../stores/store.js';
import IntaractiveSection from '../AdditionalComponents/intaractiveSection.jsx';
import { v4 as uuidv4 } from 'uuid';
import { ReactComponent as Trash } from '../../images/InitialNodes/trash.svg';

const NodeComponent = ({ data, isConnectable }) => {
    const blocks = useBlocks((state) => state.blocks);
    const dataTypes = useDataTypes((state) => state.types);
    const updateBlock = useBlocks((state) => state.updateBlock);

    const [parameters, setParameters] = useState([{ id: uuidv4(), name: '', type: 'string', value: '' }]);
    const [dataFromConnectedNodes, setDataFromConnectedNodes] = useState([]);

    const addParameter = () => setParameters([...parameters, { id: uuidv4(), name: '', type: 'string', value: '' }]);
    const deleteParameter = (id) => setParameters(parameters.filter(param => param.id !== id));


    const updateParameters = (id, key, value) => {
        const block = blocks.find(block => block.selfId === data.id);
        if (!block) {console.log('no block'); return};

        const inputParams = block.data.parameters?.inputs || {};


        console.log('before', block.data.output_parameters);
        const newOutputParams = {
            ...block.data.output_parameters,
            [id]: {
                ...block.data.output_parameters?.[id],
                // blockId: block.incomeConnections[0],
                // from_block_id: block.data.output_parameters?.from_block_id || '',
                [key]: value,
                value: inputParams[id]?.value || '---',
                outputId: inputParams[id]?.id || '-p',
            },
        };


        const updatedParameters = parameters.map(param =>
            param.id === id ? { ...param, [key]: value } : param
        );

        setParameters(updatedParameters);
        updateBlock(data.id, { ...block.data, output_parameters: newOutputParams });
    };

    useEffect(() => {
        const leftIds = blocks
            .filter(
                block => (block.type === 'functionBlock' || block.type === 'codeBlock') &&
                    block.outcomeConnections.includes(data.id)
            )
            .map(block => block.selfId);

        const outputParams = blocks.reduce((acc, block) => {
            if (block.selfId === data.id) return acc;

            if (block.type === 'functionBlock' && leftIds.includes(block.selfId)) {
                acc[block.data.label] = block.data.output_parameters.map(param => ({
                    from_block_id: block.data.id,
                    id: param.id,
                    type: param.type,
                    value: param.value || '---',
                    name: param.name,
                }));
            } else if (block.type === 'codeBlock' && leftIds.includes(block.selfId)) {
                acc[block.data.label] = Object.values(block.data.output_parameters).map(paramCollection => ({
                    from_block_id: block.data.id,
                    id: paramCollection.id,
                    type: paramCollection.type,
                    value: paramCollection.value || '---',
                    name: paramCollection.name,
                }));
            }

            return acc;
        }, {});

        console.log(`%c LoadedData`, 'background: #222; color: #bada55; font-size: larger');
        console.log(outputParams);
        setDataFromConnectedNodes(outputParams);
    }, [blocks, data.id]);

    const cl1 = () => { console.log(parameters); };
    const cl2 = () => { console.log(blocks.find(block => block.selfId === data.id)); };

    return (
        <div className='node' tabIndex="0">
            <Handle
                className='HandleComponent'
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
            />

            <button onClick={() => cl1()} className='trash-button' style={{
                color: 'red',
            }}> Параметры в студию </button>
            <button onClick={() => cl2()} className='trash-button' style={{
                color: 'magenta',
            }}> Блок из хранилища </button>

            <div>
                {data.label}
                <hr />
                <div className='result-block-content'>
                    <IntaractiveSection
                        sectionName='Выходные параметры'
                        visible='true'
                        button={<div className='addButton' onClick={addParameter}>+</div>}
                    >
                        <header>
                            <div className='header-name'>Название</div>
                            <div className='header-type'>Тип</div>
                            <div className='header-value'>Значение</div>
                        </header>
                        <div className='parametrs'>
                            {parameters.map(parameter => (
                                <div key={parameter.id} className='parameter'>

                                    <div className='parameter_name'>
                                        <input
                                            placeholder="Имя параметра"
                                            onChange={(e) => updateParameters(parameter.id, 'name', e.target.value)}
                                        />
                                    </div>

                                    <div className='type_value'>
                                        <select
                                            value={parameter.type}
                                            onChange={(e) => updateParameters(parameter.id, 'type', e.target.value)}
                                        >
                                            {dataTypes.map((item, index) => (
                                                <option key={index} value={item.type}>{item.type}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className='value'>
                                        <CustomSelect
                                            options={dataFromConnectedNodes}
                                            blockId={data.id}
                                            funcParamType={parameter.type}
                                            funcParamName={parameter.id}
                                            // fromBlock={}
                                            type='parameters_from_resultblock'
                                        />
                                    </div>

                                    <div className='delete_button' onClick={() => deleteParameter(parameter.id)}>
                                        <Trash className='delete_img' />
                                    </div>
                                </div>
                            ))}
                        </div>

                    </IntaractiveSection>
                </div>
            </div>
        </div>
    );
};

export default memo(NodeComponent);
