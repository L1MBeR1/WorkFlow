import ComponentPanel from './componentPanel/componentPanel';
import './css/app.css';
// import ReactFlowSpace from './ReactFlow/ReactFlow'
import CustomNode from './components/mycomponent/CustomNode';




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
};


const initialNodes = [
    // { id: '1', position: { x: 500, y: 500 }, data: { label: '1' } },
    // { id: '2', position: { x: 500, y: 600 }, data: { label: '2' } },
];


const initialEdges = [];
let id = 0;
const getId = () => `dndnode_${id++}`;


export default function App() {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [],
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
                data: { label: `${type} node` },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance],
    );*/

    const onDrop = useCallback((event) => {
        event.preventDefault();

        const { function_name, function_id } = JSON.parse(event.dataTransfer.getData('application/reactflow'));

        console.log(function_name, ' HHHH', function_id);
        /*if (typeof type === 'undefined' || !type) {
            return;
        }*/

        const position = reactFlowInstance.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        const newNode = {
            id: getId(),
            type: 'custom',
            position,
            data: { 
                label: `${function_name}` ,
                function_id: function_id,
                is_return: false
            },
        };

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
