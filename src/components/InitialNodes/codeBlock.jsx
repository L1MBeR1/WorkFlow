import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-dracula';

export default memo(({ data, isConnectable }) => {
    // const [code, setCode] = useState(data.code || '');

    const printToConsole = () => {
        console.log(data.code);
    }

    return (
        <>
            <button onClick={printToConsole}> Выходные параметры в консоли </button>
            <div className='node' tabIndex="0">
                <Handle
                    className='HandleComponent'
                    type="target"
                    position={Position.Left}
                    isConnectable={isConnectable}
                />

                <Handle
                    className='HandleComponent'
                    type="source"
                    position={Position.Right}
                    isConnectable={isConnectable}
                />

                <div style={{ height: '100px', width: '200px' }}>
                    <AceEditor
                        mode="python"
                        theme="dracula"
                        name="code-editor"
                        width="100%"
                        height="100%"
                        value={data.code || ''}
                        onChange={(newValue) => {
                            // setCode(newValue);
                            data.code = newValue;
                        }}
                        setOptions={{
                            showLineNumbers: true,
                            tabSize: 2,
                        }}
                    />
                </div>
            </div>
        </>
    );
});
