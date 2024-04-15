import React from 'react';

const CustomSelect = ({ isOpen, data, onSelect, selectCoords }) => {
  const handleSelectOption = (option) => {
    onSelect(option);
  };

  return (
    <div style={{ display: isOpen ? 'block' : 'none', position: 'absolute', top: selectCoords.y, left: selectCoords.x, border: '1px solid black', backgroundColor: 'white', zIndex: 9999, minWidth: '100px' }}>
        <div>dfgdgdgdgd</div>
    </div>
  );
};

export default CustomSelect;
