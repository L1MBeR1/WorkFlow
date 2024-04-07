import React, { memo, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
export default memo(({ data, isConnectable }) => {
    const labelRef = useRef(null);
    useEffect(() => {
        //console.log('l', labelRef.current, data.label);
        
        labelRef.current.innerHTML = data.label;

    }, [data]);


    return (
        <>
            <div>
                <Handle
                    className='HandleComponent'
                    type="target"
                    position={Position.Left}
                    isConnectable={isConnectable}
                />

                <div ref={labelRef} className='node'>
                    {data.label}
                </div>

            </div>
        </>
    );
});