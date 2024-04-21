import React, { useState } from 'react';
import { ReactComponent as Arrow } from './arrow.svg';

const CustomSelect = (props) => {
    const [value, setValue] = useState("Выберите");
    const [isOpen, setIsOpen] = useState(false);
    const [selectCoords, setSelectCoords] = useState({ x: 0, y: 0 });

    const handleToggleSelect = (e) => {
        setSelectCoords({ x: e.target.offsetLeft, y: e.target.offsetTop + e.target.clientHeight + 5 });
        setIsOpen(!isOpen);
    };

    const closeSelector = () => {
        if (isOpen) {
            setIsOpen(false)
        }
    };

    const handleSelect = (item) => {
        const displayValue = item.value || item.uri || 'Выберите'; // Выбираем доступное поле для отображения
        setValue(displayValue);
    };

    return (
        <div className="custom-select" onClick={handleToggleSelect} tabIndex="0" onBlur={closeSelector}>
            <div className='custom-select-title'>{value}</div>
            <div className='Arrow'><Arrow className='svg' style={{ transform: isOpen ? 'scaleY(-1)' : 'scaleY(1)' }}></Arrow></div>
            <div className='custom-select-content' style={{ display: isOpen ? 'flex' : 'none', position: 'absolute', top: selectCoords.y, left: selectCoords.x }}>
                {props.options.map((item, index) => (
                    <div key={index} className='custom-select-item' onClick={() => handleSelect(item)}> {item.name || item.uri}</div>
                ))}
            </div>
        </div>
    );
};

export default CustomSelect;
