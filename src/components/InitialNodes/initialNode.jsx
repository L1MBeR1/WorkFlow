import React from 'react';
const InitialNode = (props) => {
    const onDragStart = (event, args) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify(args)); 
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className='function' onDragStart={(event) => onDragStart(event, {
            type:props.type,
            block_name: props.name,
        })} draggable>
            <p>{props.name}</p>
        </div>
    );
};
export default InitialNode;