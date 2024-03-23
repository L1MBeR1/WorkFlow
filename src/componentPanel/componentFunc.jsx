import React from 'react';

import '../css/componentPanel.css';

const ComponentFunc = (props) => {
    const onDragStart = (event, args) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify(args)); 
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className='function' onDragStart={(event) => onDragStart(event, {
            function_name: props.name,
            function_id: props.function_id
        })} draggable>
            <p>{props.name}</p>
        </div>
    );
};

export default ComponentFunc;