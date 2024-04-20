import React, { memo, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { useBlocks } from '../../store';


export default memo(({ data, isConnectable }) => {
    const blocks = useBlocks((state) => state.blocks);
    //const {blocks} = useBlocks();
    const labelRef = useRef(null);


    useEffect(() => {
        //labelRef.current.innerHTML = blocks;  //data.label;
        console.log(blocks);
        

    }, [blocks]);


    return (
        <>
            <div >
                <Handle
                    className='HandleComponent'
                    type="target"
                    position={Position.Left}
                    isConnectable={isConnectable}
                />

                <div ref={labelRef} className='node'tabIndex="0">
                    {blocks.map((block, index) => (
                        <option key={index} value={index}>
                            {block.selfId}
                        </option>
                    ))}
                </div>

            </div>
        </>
    );
});