import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import '../../css/initialNodes.css';
export default memo(({ data, isConnectable }) => {
    return (
      <>
        <div className='node'tabIndex="0">
        <div >
            {data.label}
        </div>

        <Handle
          className='HandleComponent'
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
        />
        </div>
      </>
    );
  });