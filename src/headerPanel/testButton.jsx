import React from 'react';
import ResultPanelStatus from '../storages/storeResult';

const TestButton=(props)=>{
    const { setIsOpen } = ResultPanelStatus();

    const handleClick = () => {
        setIsOpen(true); 
    };
    return(
        <div className='TestButton' onClick={handleClick}>{props.children}</div>
    );

};
export default TestButton;