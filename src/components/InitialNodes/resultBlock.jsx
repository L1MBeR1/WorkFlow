import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import CustomCheckBox from './CustomCheckBox.jsx';
import './initialNodes.css';
export default memo(({ data, isConnectable }) => {
    return (
      <>
        <div >
            <Handle
            className='HandleComponent'
            type="source"
            position={Position.Left}
            isConnectable={isConnectable}
            />
            <div className='node result-block'tabIndex="0">
                {data.label}
                <hr></hr>
                <div className='result-block-content'>
                    <CustomCheckBox></CustomCheckBox>
                </div>
            </div >

        </div>
      </>
    );
  });