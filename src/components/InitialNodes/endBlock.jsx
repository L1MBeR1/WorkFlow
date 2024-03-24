import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
export default memo(({ data, isConnectable }) => {
    return (
      <>
        <Handle
          type="target"
          position={Position.Left}
          id="a"
          style={{ top: 10, background: '#555' }}
          isConnectable={isConnectable}
        />
        <div>
            {data.label}
        </div>

      
      </>
    );
  });