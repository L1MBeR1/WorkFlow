import React, { useEffect, useState } from 'react';
import { ReactComponent as Arrow } from '../../images/AdditionalComponents/arrow.svg';
import { useBlocks } from '../../stores/store';
import IntaractiveSection from './intaractiveSection';

const CustomSelect = (props) => {
    const blocks = useBlocks((state) => state.blocks);
    // const updateBlock = useBlocks((state) => state.updateBlock);
    const [selectedOption, setSelectedOption] = useState({
        from_block_id: null,
        value: "Выберите",
        id: null,
        type: null,
    });
    const [isOpen, setIsOpen] = useState(false);
    const [selectCoords, setSelectCoords] = useState({ x: 0, y: 0 });

    const resetSelectedOption = () => {
        setSelectedOption({
            from_block_id: null,
            value: "Выберите",
            id: null,
            type: null,
        });
    };

    useEffect(() => {
        if (Object.values(props.options).flatMap(options => options).length === 0 && selectedOption.value !== "Выберите") {
            resetSelectedOption();
        }
    }, [props.options]);

    useEffect(() => {
        if (['parameters', 'parameters_from_resultblock'].includes(props.type) && selectedOption.id !== null) {
            const selectedOptionFromProps = Object.values(props.options)
                .flatMap(options => options)
                .find(option => option.id === selectedOption.id);

            if (selectedOptionFromProps) {
                setSelectedOption(prevState => {
                    const isDifferentType = selectedOptionFromProps.type !== prevState.type;
                    return isDifferentType ? {
                        value: "Выберите",
                        id: null,
                        type: null,
                        from_block_id: null,
                    } : {
                        value: selectedOptionFromProps.name,
                        id: selectedOptionFromProps.id,
                        type: selectedOptionFromProps.type,
                    };
                });
            }
        }
    }, [props.options, selectedOption.id, props.type]);

    const handleToggleSelect = (e) => {
        setSelectCoords({ x: e.target.offsetLeft, y: e.target.offsetTop + e.target.clientHeight + 5 });
        setIsOpen(!isOpen);
    };

    const closeSelector = () => {
        if (isOpen) {
            setIsOpen(false);
        }
    };

    const handleSelect = (item) => {
        const currentBlockIndex = blocks.findIndex(block => block.selfId === props.blockId);

        if (currentBlockIndex === -1) return;

        const currentBlock = blocks[currentBlockIndex];
        let variableKey, propToSave;

        switch (props.type) {
            case 'uri':
                variableKey = 'uri_id';
                propToSave = item.id;
                break;
            case 'services':
                variableKey = 'service_id';
                propToSave = item.id;
                break;
            case 'parameters':
            case 'parameters_from_resultblock':
            case 'conditions':
            case 'blocks':
                variableKey = props.funcParamName;
                propToSave = props.type === 'blocks' ? item.selfId : item;
                break;
            default:
                return;
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
        } else if (props.type === 'parameters_from_resultblock') {
            if (!currentBlock.data.parameters.inputs) {
                currentBlock.data.parameters.inputs = {};
            }
            currentBlock.data.parameters.inputs[variableKey] = propToSave;
            currentBlock.data.output_parameters[props.funcParamName].from_block_id = item.from_block_id;
            currentBlock.data.output_parameters[props.funcParamName].output_id = item.id;
        } else {
            currentBlock.data.parameters[variableKey] = propToSave;
        }

        switch (props.type) {
            case 'parameters':
            case 'services':
                setSelectedOption({ value: item.name, id: item.id, type: item.type });
                break;
            case 'uri':
                setSelectedOption({ value: item.uri, id: item.id, type: item.type });
                break;
            case 'parameters_from_resultblock':
                setSelectedOption({ from_block_id: item.from_block_id, value: item.name, id: item.id, type: item.type });
                break;
            case 'conditions':
                setSelectedOption({ value: item.description, id: item.id, type: item.condition });
                break;
            case 'blocks':
                setSelectedOption({ value: item.data.label, id: item.selfId, type: item.type });
                break;
            default:
                break;
        }

        setIsOpen(false);
    };

    const filterOptionsByType = (options, type) => {
        return type !== undefined ? options.filter(option => option && option.type === type) : options;
    };

    const renderOptions = (options) => {
        return options.map((item, index) => (
            <div key={index} className='custom-select-item' onClick={() => handleSelect(item)}>
                {item.name || item.uri || item.description || item.data?.label}
            </div>
        ));
    };

    const renderIntaractiveSection = () => {
        if (Object.keys(props.options).length === 0) {
            return <div className='not-clickable-text'>Нет данных</div>;
        }

        return Object.keys(props.options).map(key => (
            <IntaractiveSection key={key} sectionName={key}>
                {filterOptionsByType(props.options[key], props.funcParamType).map(item => (
                    item.name && <div key={item.id} className='custom-select-item' onClick={() => handleSelect(item)}>
                        <div className='custom-select-item-name'>{item.name}</div>
                    </div>
                ))}
            </IntaractiveSection>
        ));
    };

    return (
        <div tabIndex="0" onBlur={closeSelector}>
            <div className="custom-select" onClick={handleToggleSelect}>
                <div className='custom-select-title'>{selectedOption.value}</div>
                <div className='Arrow'>
                    <Arrow className='svg' style={{ transform: isOpen ? 'scaleY(-1)' : 'scaleY(1)' }} />
                </div>
            </div>
            {isOpen && (
                <div className='custom-select-content' style={{ display: 'flex', position: 'absolute', top: selectCoords.y, left: selectCoords.x }}>
                    {['parameters', 'parameters_from_resultblock'].includes(props.type) ? renderIntaractiveSection() : renderOptions(Object.values(props.options).flatMap(options => options))}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
