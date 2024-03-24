import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import './initialNodes.css';
export default memo(({ data, isConnectable }) => {
    return (
      <>
        <div>
        <div className='node'>
            {data.label}
        </div>

        <Handle
          className='handle'
          type="source"
          position={Position.Right}
          style={{background: '#555' }}
          isConnectable={isConnectable}
        />
        </div>
      </>
    );
  });