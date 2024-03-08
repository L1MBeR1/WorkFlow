import React from 'react';

import '../css/componentPanel.css';

const ComponentFunc =(props)=>{
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
      };

    return(
        <div className='function' onDragStart={(event) => onDragStart(event, props.name)} draggable>
            <p>{props.name}</p>
        </div>
    );
};
export default ComponentFunc;