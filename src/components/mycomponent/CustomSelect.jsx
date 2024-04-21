import React, { useEffect, useState } from 'react';
import { ReactComponent as Arrow } from './arrow.svg';
import { useBlocks } from '../../store';


const CustomSelect = (props) => {
    const blocks = useBlocks((state) => state.blocks);
    const [value, setValue] = useState("Выберите");
    const [isOpen, setIsOpen] = useState(false);
    const [selectCoords, setSelectCoords] = useState({ x: 0, y: 0 });
    // console.log(props.options);
    if (((props.options.length === 0) && !(value === "Выберите"))) {
        setValue("Выберите")
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
        console.log('props.options changed', props.options);

        //props.options = {...props.options, funcParamName: props.funcParamName, funcParamType: props.funcParamType};

    }, [props.options]);

    const handleSelect = (item) => {
        const currentBlock = blocks.find(block => block.selfId === props.blockId);

        if (currentBlock.data.parameters) {
            const existingParameterIndex = currentBlock.data.parameters.findIndex(param => param.paramName === props.funcParamName);

            if (existingParameterIndex !== -1) {
                // Если параметр с таким именем уже существует, обновляем его
                currentBlock.data.parameters[existingParameterIndex] = {
                    ...currentBlock.data.parameters[existingParameterIndex],
                    ...item,
                    funcParamName: props.funcParamName,
                    funcParamType: props.funcParamType
                };
            } else {
                // Если параметра с таким именем нет, добавляем новый параметр
                currentBlock.data.parameters.push({
                    ...item,
                    funcParamName: props.funcParamName,
                    funcParamType: props.funcParamType
                });
            }
        } else {
            // Если параметров нет, создаем новый массив с одним параметром
            currentBlock.data.parameters = [{
                ...item,
                funcParamName: props.funcParamName,
                funcParamType: props.funcParamType
            }];
        }

        setValue(item.name);
    };



    /*FIXME: надо добавить фильтр по типу (item.type)
    
    const filterOptionsByType = (options, type) => {
        return options
            .filter(option => option !== undefined)
            .filter(option => option.type === type);
    };*/

    /*FIXME: нужен ивент для обнуления параметров, 
        если удален конкретный блок с параметрами
        
     */

    return (
        <div className="custom-select" onClick={handleToggleSelect} tabIndex="0" onBlur={closeSelector}>
            <div className='custom-select-title'>{value}</div>
            <div className='Arrow'><Arrow className='svg' style={{ transform: isOpen ? 'scaleY(-1)' : 'scaleY(1)' }}></Arrow></div>
            <div className='custom-select-content' style={{ display: isOpen ? 'flex' : 'none', position: 'absolute', top: selectCoords.y, left: selectCoords.x }}>
                {props.type === 'parameters' && (
                    props.options.map((item, index) => (
                        <div key={index} className='custom-select-item' onClick={() => handleSelect(item)}>
                            {/* TODO: В прошлых списках использовалось локальное состояние "options" 
                                для хранения выбранных параметров вместо локальной переменной "item":

                                <select data-id={index} onClick={changeSelect} className='fucn_parameter_value'>
                                    {filterOptionsByType(options, item.type).map(option => (
                                        <option data-id={option.id} key={option.id} value={option.value}>
                                            {option.name} ({option.value})
                                        </option>
                                    ))}
                                </select>

                                В том случае данные обновлялись автоматически при обновлении состояния блока,
                            
                            */}
                            {item.name}
                        </div>
                    ))
                )}
                {props.type === 'services' && (
                    props.options.map((item, index) => (
                        <div key={index} className='custom-select-item' onClick={() => handleSelect(item.Название)}>
                            {item.Название}
                        </div>
                    ))
                )}
                {props.type === 'uri' && (
                    props.options.map((item, index) => (
                        <div key={index} className='custom-select-item' onClick={() => handleSelect(item.uri)}>
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
