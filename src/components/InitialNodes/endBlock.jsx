import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
export default memo(({ data, isConnectable }) => {
    return (
      <>
        <div>
        <Handle
          type="target"
          position={Position.Left}
          style={{background: '#555' }}
          isConnectable={isConnectable}
        />
        <div className='node'>
            {data.label}
        </div>

        </div>
      </>
    );
  });