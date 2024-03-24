import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import './initialNodes.css';
export default memo(({ data, isConnectable }) => {
    
  
  
  return (
      <>
        <div>
        <div className='parametrNode'>
          <div>
           {data.label}
          </div>
          <hr></hr>
          <div className='parametrs'>
            <header >
              <div className='header-number'>№ </div>
              <div className='header-name'>Название </div>
              <div className='header-type'>Тип</div>
              <div className='header-value'>Значение </div>
              
            </header>
            <div className='parametr'>
              <div className='number'>1</div>
              <div className='name'>
                <input ></input>
              </div>
              
            </div>
          </div>
          <div className='addButton'>
            +
          </div>
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