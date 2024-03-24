import ComponentPanel from './componentPanel/componentPanel';
import './css/app.css';
// import ReactFlowSpace from './ReactFlow/ReactFlow'
import CustomNode from './components/mycomponent/CustomNode';

import StartNode from './components/InitialNodes/startBlock';
import EndNode from './components/InitialNodes/endBlock';
import ParametrBlock from './components/InitialNodes/parametrBlock';




import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';


const nodeTypes = {
    custom: CustomNode,
    startBlock:StartNode,
    endBlock:EndNode,
    parametrBlock:ParametrBlock,
};





let id = 1;
const getId = () => `${id++}`;
const initialNodes = [
    {
        id: getId(),
        type: 'startBlock',
        position: { x: 300, y: 100 },
        data: { label: 'Начальный блок' }
    },
    {
        id: getId(),
        type: 'endBlock',
        position: { x: 500, y: 100 },
        data: { label: 'Конечный блок' }
    }
];

const initialEdges = [];
//fgdgfgfdg
export default function App() {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    const onConnect = useCallback(
      (params) => {
        console.log("Connection parameters:", params);
        const sourceNodeId = params.source;
    const sourceNode = nodes.find(node => node.id === sourceNodeId);
    if (!sourceNode) {
        console.error("Source node not found:", sourceNodeId);
        return;
    }
    console.log("Source Node ID:", sourceNodeId); 
    console.log("Source Node Data:", sourceNode.data); 

 
    const targetNodeId = params.target;
    const targetNode = nodes.find(node => node.id === targetNodeId);
    if (!targetNode) {
        console.error("Target node not found:", targetNodeId);
        return;
    }
    console.log("Target Node ID:", targetNodeId); 
    console.log("Target Node Data:", targetNode.data); 
  
          
          setEdges((prevEdges) => addEdge(params, prevEdges));
      },
      [nodes] 
  );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    /*const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

            if (typeof type === 'undefined' || !type) {
                return;
            }


            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            const newNode = {
                id: getId(),
                type,
                position,
            sourcePosition: 'right',
            targetPosition: 'left',
                data: { label: `${type}` },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance],
    );*/

    const onDrop = useCallback((event) => {
        event.preventDefault();

        const { type,function_name, function_id, component_id } = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        /*if (typeof type === 'undefined' || !type) {
            return;
        }*/

        const position = reactFlowInstance.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

       
        if (!type) {
            return;
        }
        let newData
        console.log(type)
        switch (type) {
            case 'custom':
                
                console.log(function_name, ' HHHH', function_id);
                newData = { 
                        label: `${function_name}` ,
                        function_id: function_id,
                        is_return: false,
                        component_id: component_id
                    };
                break;
            case 'startBlock':
                newData = { label: 'Начальный блок'};
                break;
            case 'endBlock':
                newData = { label: 'Конечный блок'};
                break;
            case 'parametrBlock':
                newData = { label: 'Блок с параметрами'};
                break;
            default:
                newData = { label: `${type} node` };
        }

        const newNode = [
            {
                id: getId(),
                type,
                position,
                data: newData
            }
        ];

        setNodes((nds) => nds.concat(newNode));
    },
        [reactFlowInstance],
    );


    return (
        <div className="App">

            <ComponentPanel></ComponentPanel>
            <div className="mainCanvas" >
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onInit={setReactFlowInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    fitView
                    nodeTypes={nodeTypes}
                >

                    <Controls position="bottom-right" />

                    {/* <MiniMap /> */}
                    <Background variant="dots" color="#6e0cab" gap={15} size={1} />
                </ReactFlow>
            </div>

        </div>
    );
}
