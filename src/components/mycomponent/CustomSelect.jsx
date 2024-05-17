import React, { useEffect, useState } from 'react';
import { ReactComponent as Arrow } from './arrow.svg';
import { useBlocks } from '../../stores/store';
import IntaractiveSection from './intaractiveSection';

const CustomSelect = (props) => {
    const blocks = useBlocks((state) => state.blocks);
    const [selectedOption, setValue] = useState({
        value: "Выберите",
        id: null,
        type: null,
    });
    const [isOpen, setIsOpen] = useState(false);
    const [selectCoords, setSelectCoords] = useState({ x: 0, y: 0 });
    // console.log('PO', props.options);
    /*if (((props.options.length === 0) && !(selectedOption.value === "Выберите"))) {
        setValue({
            value: "Выберите",
            id: null,
            type: null,
        })
    }*/
    if (
        (Object.values(props.options).flatMap(options => options).length === 0) &&
        !(selectedOption.value === "Выберите")
    ) {
        setValue({
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

    /*useEffect(() => {
        const selectedOptionId = selectedOption.id;
        const isParameterType = props.type === 'parameters';
        const isSelectedOptionNotNull = selectedOptionId !== null;
        const selectedOptionFromProps = props.options.find(option => option.id === selectedOptionId);

        if (isParameterType && isSelectedOptionNotNull && selectedOptionFromProps) {
            const updatedValue = {
                value: selectedOptionFromProps.name,
                id: selectedOptionFromProps.id,
                type: selectedOptionFromProps.type,
            };

            const isDifferentType = selectedOptionFromProps.type !== selectedOption.type;

            setValue(isDifferentType ? { value: "Выберите", id: null, type: null } : updatedValue);
        }
    }, [props.options]);*/

    useEffect(() => {
        const selectedOptionId = selectedOption.id;
        const isParameterType = props.type === 'parameters';
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

            setValue(isDifferentType ? { value: "Выберите", id: null, type: null } : updatedValue);
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
            } else if (props.type === 'parameters') {
                variableKey = props.funcParamName;
                propToSave = item;
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

                currentBlock.data.parameters.inputs[variableKey] = propToSave;
            } else {
                currentBlock.data.parameters[variableKey] = propToSave;
            }

            if (props.type === 'parameters') {
                setValue({
                    value: item.name,
                    id: item.id,
                    type: item.type,
                });
            } else if (props.type === 'services') {
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
            }

            setIsOpen(!isOpen);
        }
    };



    const filterOptionsByType = (options, type) => { //TODO: Использовать
        return options
            .filter(option => option !== undefined)
            .filter(option => option.type === type);
    };



    return (
        <div tabIndex="0" onBlur={closeSelector}>
            <div className="custom-select" onClick={handleToggleSelect}  >
                <div className='custom-select-title'>{selectedOption.value}</div>
                <div className='Arrow'><Arrow className='svg' style={{ transform: isOpen ? 'scaleY(-1)' : 'scaleY(1)' }}></Arrow></div>
            </div>

            {/* <div className='custom-select-content' style={{ display: isOpen ? 'flex' : 'none', position: 'absolute', top: selectCoords.y, left: selectCoords.x }}>
                {props.type === 'parameters' && (
                    filterOptionsByType(props.options, props.funcParamType).map((item, index) => (
                        <div key={index} className='custom-select-item' onClick={() => handleSelect(item)}>
                            {item.name}
                        </div>
                    ))
                )} */}
            <div className='custom-select-content' style={{ display: isOpen ? 'flex' : 'none', position: 'absolute', top: selectCoords.y, left: selectCoords.x }}>
                {/* {props.type === 'parameters' && filterOptionsByType(props.options, props.funcParamType).length > 0 ? (
                    filterOptionsByType(props.options, props.funcParamType).map((item, index) => (
                        <div key={index} className='custom-select-item' onClick={() => handleSelect(item)}>
                            {item.name}
                        </div>
                    ))
                ) : (
                    
                    <div className='not-clickable-text'>Нет данных</div>
                )} */}
                {/* {props.type === 'parameters' && Object.entries(props.options).flatMap(([label, options]) => options).filter(item => item.type === props.funcParamType).length > 0 ? (
                    Object.entries(props.options).flatMap(([label, options]) => options).filter(item => item.type === props.funcParamType).map((item, index) => (
                        <div key={index} className='custom-select-item' onClick={() => handleSelect(item)}>
                            {label} - {item.name}
                        </div>
                    ))
                ) : (
                    <div className='not-clickable-text'>Нет данных</div>
                )} */}
                {props.type === 'parameters' && (
                    <>
                        {/* {Object.entries(props.options)
                            .flatMap(([label, options]) => options)
                            .filter(item => item.type === props.funcParamType)
                            .map((item, index) => (
                                <div key={index} className='custom-select-item' onClick={() => handleSelect(item)}>
                                    {Object.keys(props.options).find(key => props.options[key].includes(item))} - {item.name}
                                </div>
                            ))} */}
                        {
                            Object.keys(props.options).length === 0 ? (
                                <div className='not-clickable-text'>Нет данных</div>
                            ) : (
                                Object.keys(props.options).map(key => (
                                    <IntaractiveSection key={key} sectionName={key}>
                                        {
                                            props.options[key].map(item => (
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
                        {/* {Object.entries(props.options)
                            .flatMap(([label, options]) => options)
                            .filter(item => item.type === props.funcParamType)
                            .length === 0 && <div className='not-clickable-text'>Нет данных</div>} */}
                    </>
                )
                    // : (
                    //     <div className='not-clickable-text'>Нет данных</div>
                    // )
                }





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

                {/* props.options.map((item, index) => (
                    <div key={index} className='custom-select-item' onClick={() => handleSelect(item)}> {item.name || item.uri}</div>
                )) */}
            </div>
        </div>
    );
};

export default CustomSelect;
