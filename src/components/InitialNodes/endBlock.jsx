import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
export default memo(({ data, isConnectable }) => {
  return (
    <>
      <div>
        <Handle 
          className='HandleComponent'
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
        />

        <div className='node'>
          {data.label}
        </div>

      </div>
    </>
  );
});