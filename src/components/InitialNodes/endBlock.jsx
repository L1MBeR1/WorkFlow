import React, { memo, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import '../../css/initialNodes.css';
import { useBlocks, useParameterBlocksData } from '../../stores/store';
export default memo(({ data, isConnectable }) => {
    const labelRef = useRef(null);
    const blocks = useBlocks((state) => state.blocks);

    return (
        <>
            {/* <button onClick={printToConsole}>  в консоли </button> */}
            <div className='node' tabIndex="0">
                <Handle
                    className='HandleComponent'
                    type="target"
                    position={Position.Left}
                    isConnectable={isConnectable}
                />
                <div ref={labelRef} >
                    Конечный блок
                </div>
            </div>
        </>
    );
});