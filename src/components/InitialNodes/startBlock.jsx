import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
export default memo(({ data, isConnectable }) => {
    return (
      <>
        
        <div>
            {data.label}
        </div>

        <Handle
          type="source"
          position={Position.Right}
          id="a"
          style={{ top: 10, background: '#555' }}
          isConnectable={isConnectable}
        />
      </>
    );
  });