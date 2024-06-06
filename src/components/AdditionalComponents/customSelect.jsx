import React, { useEffect, useState } from 'react';
import { ReactComponent as Arrow } from '../../images/AdditionalComponents/arrow.svg';
import { useBlocks } from '../../stores/store';
import IntaractiveSection from './intaractiveSection';

const CustomSelect = (props) => {
    const blocks = useBlocks((state) => state.blocks);
    const updateBlock = useBlocks((state) => state.updateBlock);
    const [selectedOption, setValue] = useState({
        from_block_id: null,
        value: "Выберите",
        id: null,
        type: null,
    });
    const [isOpen, setIsOpen] = useState(false);
    const [selectCoords, setSelectCoords] = useState({ x: 0, y: 0 });

    if (
        (Object.values(props.options).flatMap(options => options).length === 0) &&
        !(selectedOption.value === "Выберите")
    ) {
        setValue({
            from_block_id: null,
            value: "Выберите",
            id: null,
            type: null,
        });
    }

    const handleToggleSelect = (e) => {
        setSelectCoords({ x: e.target.offsetLeft, y: e.target.offsetTop + e.target.clientHeight + 5 });
        setIsOpen(!isOpen);
    };

    const closeSelector = () => {
        if (isOpen) {
            setIsOpen(false)
        }
    };

    useEffect(() => {
        const selectedOptionId = selectedOption.id;
        const isParameterType = props.type === 'parameters' || props.type === 'parameters_from_resultblock';
        const isSelectedOptionNotNull = selectedOptionId !== null;

        // Ищем выбранный объект в массиве options
        const selectedOptionFromProps = Object.values(props.options)
            .flatMap(options => options)
            .find(option => option.id === selectedOptionId);

        if (isParameterType && isSelectedOptionNotNull && selectedOptionFromProps) {
            const updatedValue = {
                value: selectedOptionFromProps.name,
                id: selectedOptionFromProps.id,
                type: selectedOptionFromProps.type,
            };

            const isDifferentType = selectedOptionFromProps.type !== selectedOption.type;
            setValue(isDifferentType ? { value: "Выберите", id: null, type: null, from_block_id: null, } : updatedValue);
        }
    }, [props.options]);


    const handleSelect = (item) => {
        const currentBlockIndex = blocks.findIndex(block => block.selfId === props.blockId);

        if (currentBlockIndex !== -1) {
            const currentBlock = blocks[currentBlockIndex];
            let variableKey;
            let propToSave;

            if (props.type === 'uri') {
                variableKey = 'uri_id';
                propToSave = item.id;
            } else if (props.type === 'services') {
                variableKey = 'service_id';
                propToSave = item.id;
            } else if (props.type === 'parameters' || props.type === 'parameters_from_resultblock') {
                variableKey = props.funcParamName;
                propToSave = item;
            } else if (props.type === 'conditions') {
                variableKey = props.funcParamName;
                propToSave = item;
            } else if (props.type === 'blocks') {
                variableKey = props.funcParamName;
                propToSave = item.selfId;
            }


            if (!currentBlock.data.parameters) {
                currentBlock.data = {
                    ...currentBlock.data,
                    parameters: {},
                };
            }

            if (props.type === 'parameters') {
                if (!currentBlock.data.parameters.inputs) {
                    currentBlock.data.parameters.inputs = {};
                }
                // updateBlock(currentBlock.selfId, {
                //     ...currentBlock.data,
                //     parameters: {
                //         ...currentBlock.data.parameters,
                //         inputs: {
                //             ...currentBlock.data.parameters.inputs,
                //             [variableKey]: propToSave,
                //         },
                //     },
                // });
                currentBlock.data.parameters.inputs[variableKey] = propToSave;
            } else if (props.type === 'parameters_from_resultblock') {
                if (!currentBlock.data.parameters.inputs) {
                    currentBlock.data.parameters.inputs = {};
                }
                currentBlock.data.parameters.inputs[variableKey] = propToSave;

                // Ищем выбранный объект в массиве options
                // const selectedOption = selectedOption;
                // console.log('soi', selectedOptionId);
                // const selectedOptionFromProps = Object.values(props.options)
                //     .flatMap(options => options)
                //     .find(option => option.id === selectedOptionId);

                console.log('%c TTTTTTT', 'color: green; font-weight: bold');
                console.log(props.options);

                // console.log('111-', currentBlock.data.output_parameters.from_block_id);
                console.log('1121-', currentBlock);
                console.log('2221-', Object.values(props.options));
                console.log('222-', Object.values(props.options)[0][0].from_block_id);
                console.log('333-', selectedOption);
                // currentBlock.data.output_parameters[props.funcParamName].from_block_id = selectedOption.from_block_id;
                // currentBlock.data.output_parameters[props.funcParamName].from_block_id = Object.values(props.options)[0][0].from_block_id;
                currentBlock.data.output_parameters[props.funcParamName].from_block_id = item.from_block_id;
                currentBlock.data.output_parameters[props.funcParamName].output_id = item.id;
            } else {
                currentBlock.data.parameters[variableKey] = propToSave;
            }
            console.log('vvv', item);

            if (props.type === 'parameters' || props.type === 'services') {
                setValue({
                    value: item.name,
                    id: item.id,
                    type: item.type,
                });
            } else if (props.type === 'uri') {
                setValue({
                    value: item.uri,
                    id: item.id,
                    type: item.type,
                });
            } else if (props.type === 'parameters_from_resultblock') {
                setValue({
                    from_block_id: item.from_block_id,
                    value: item.name,
                    id: item.id,
                    type: item.type,
                });
            } else if (props.type === 'conditions') {
                setValue({
                    value: item.description,
                    id: item.id,
                    type: item.condition,
                });
            } else if (props.type === 'blocks') {
                setValue({
                    value: item.data.label,
                    id: item.selfId,
                    type: item.type,
                });
            }
            setIsOpen(!isOpen);
        }
    };

    const filterOptionsByType = (options, type) => {
        if (type !== undefined) {
            return options
                .filter(option => option !== undefined)
                .filter(option => option.type === type);
        }
        else {
            return options
        }
    };

    return (
        <div tabIndex="0" onBlur={closeSelector}>
            <div className="custom-select" onClick={handleToggleSelect}  >
                <div className='custom-select-title'>{selectedOption.value}</div>
                <div className='Arrow'><Arrow className='svg' style={{ transform: isOpen ? 'scaleY(-1)' : 'scaleY(1)' }}></Arrow></div>
            </div>
            <div className='custom-select-content' style={{ display: isOpen ? 'flex' : 'none', position: 'absolute', top: selectCoords.y, left: selectCoords.x }}>
                {(props.type === 'parameters' || props.type === 'parameters_from_resultblock') && (
                    <>
                        {
                            Object.keys(props.options).length === 0 ? (
                                <div className='not-clickable-text'>Нет данных</div>
                            ) : (
                                Object.keys(props.options).map(key => (
                                    <IntaractiveSection key={key} sectionName={key}>
                                        {
                                            filterOptionsByType(props.options[key], props.funcParamType).map(item => (
                                                (item.name && item.name !== '') &&
                                                <div key={item.id} className='custom-select-item' onClick={() => handleSelect(item)}>
                                                    <div className='custom-select-item-name'>
                                                        {item.name}
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </IntaractiveSection>
                                ))
                            )
                        }
                    </>
                )}
                {props.type === 'services' && (
                    Object.values(props.options).flatMap(options => options).map((item, index) => (
                        <div key={index} className='custom-select-item' onClick={() => handleSelect(item)}>
                            {item.name}
                        </div>
                    ))
                )}
                {props.type === 'uri' && (
                    Object.values(props.options).flatMap(options => options).map((item, index) => (
                        <div key={index} className='custom-select-item' onClick={() => handleSelect(item)}>
                            {item.uri}
                        </div>
                    ))
                )}
                {props.type === 'conditions' && (
                    Object.values(props.options).flatMap(options => options).map((item, index) => (
                        <div key={index} className='custom-select-item' onClick={() => handleSelect(item)}>
                            {item.description}
                        </div>
                    ))
                )}
                {props.type === 'blocks' && (
                     Object.keys(props.options).length === 0 ? (
                        <div className='not-clickable-text'>Нет данных</div>
                    ) : (
                    Object.values(props.options).flatMap(options => options).map((item, index) => (
                        <div key={index} className='custom-select-item' onClick={() => handleSelect(item)}>
                            {item.data.label}
                        </div>
                    )))
                )}
            </div>
        </div>
    );
};

export default CustomSelect;
