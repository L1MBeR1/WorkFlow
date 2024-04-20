import React from 'react';

const CustomSelect = ({ isOpen, data, onSelect, selectCoords }) => {
  const handleSelectOption = (option) => {
    onSelect(option);
  };

  return (
    <div className='custom-select-content' style={{ display: isOpen ? 'flex' : 'none', position: 'absolute', top: selectCoords.y, left: selectCoords.x}}>
        <div className='custom-select-item'>dfgdgdgdgd
        </div>
        <div className='custom-select-item'>dfgdgdgdgd
        </div>
    </div>
  );
};

export default CustomSelect;
