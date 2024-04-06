import ComponentPanel from './componentPanel/componentPanel';
import './css/app.css';
import CustomNode from './components/mycomponent/CustomNode';

import StartNode from './components/InitialNodes/startBlock';
import EndNode from './components/InitialNodes/endBlock';
import ParametrBlock from './components/InitialNodes/parametrBlock';


import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactFlow, {
    getOutgoers,
    getIncomers,
    ReactFlowProvider,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Panel,
    applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';


const nodeTypes = {
    custom: CustomNode,
    startBlock: StartNode,
    endBlock: EndNode,
    parametrBlock: ParametrBlock,
};


let id = 1;
const getId = () => `${id++}`;
const initialNodes = [
    // {
    //     id: getId(),
    //     type: 'startBlock',
    //     position: { x: 300, y: 100 },
    //     data: { label: 'Начальный блок' }
    // },
    // {
    //     id: getId(),
    //     type: 'endBlock',
    //     position: { x: 500, y: 100 },
    //     data: { label: 'Конечный блок' }
    // }
];

const initialEdges = [];

export default function App() {
    const [options_lists_data, setOptions] = useState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(/*initialNodes*/[]);
    const [edges, setEdges] = useEdgesState(/*initialEdges*/[]);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [settedEdge, setEdge] = useState(null);


    const updateOptions = (id, newData) => {
        setOptions(prevState => ({
            ...prevState,
            [id]: newData
        }));
        console.log('VVVVVV', options_lists_data);
        setSelectedNodeId([id, Math.random()]);
    };





    const get_outgoers_node = useCallback((node) => {
        //const NODE = nodes.find(node => node.id === ids);
        //console.log('self: ', NODE);

        const incomers = getOutgoers(
            node,
            nodes,
            edges,
        );
        console.log('connected with: ', incomers);
        return incomers;

    },
        [setNodes, nodes, edges, options_lists_data]
    );

    const get_incomers_node = useCallback((node) => {
        //const NODE = nodes.find(node => node.id === ids);
        //console.log('self: ', NODE);

        const incomers = getIncomers(
            node,
            nodes,
            edges,
        );
        console.log('connected with: ', incomers);
        return incomers;

    },
        [setNodes, nodes, edges, options_lists_data]
    );

    useEffect(() => {
        if (selectedNodeId != null) {
            const NODE = nodes.find(node => node.id === selectedNodeId[0]);
            let connected_custom_nodes_to_parameter = get_outgoers_node(NODE);

            connected_custom_nodes_to_parameter.forEach(element => {
                let parameters_of_connected_custom_node = get_incomers_node(element);
                let united_data = parameters_of_connected_custom_node.map(ee => options_lists_data[ee.id]);
                united_data = united_data.flat();
                console.log(united_data);
                updateNodeDataOptions(element.id, united_data);
            });

            // connected_custom_nodes_to_parameter.forEach(element => {
            //     let parameters_of_connected_custom_node = get_incomers_node(element);
            //     let united_data = [];
            //     /*parameters_of_connected_custom_node.forEach(ee => {
            //         console.log('kkla', options_lists_data[ee.id]);

            //     });*/

            //     parameters_of_connected_custom_node.forEach(ee => {
            //         united_data = [...united_data, options_lists_data[ee.id]];
            //     });

            //     console.log(united_data);

            //     //updateNodeDataOptions(element.id, options_lists_data[NODE.id])
            //     updateNodeDataOptions(element.id, united_data)
            // });



        }

    }, [setOptions, selectedNodeId, options_lists_data]);



    const updateNodeDataOptions = (nodeId, options) => {
        setNodes((prevNodes) =>
            prevNodes.map((node) =>
                node.id === nodeId ? { ...node, data: { ...node.data, options: options } } : node
            )
        );
    };

    const onEdgesChange = useCallback(
        (changes) => {
            const connected_nodes_regexp = /^\w*-(\d+)-(\d+)$/gm;
            let SOURCE_NODE;
            let TARGET_NODE;

            changes.forEach(({ id, type, selected }) => {
                const matches = [...id.matchAll(connected_nodes_regexp)];
                /*for (const match of matches) {
                    const [fullMatch, left_node_id, right_node_id] = match;
                    SOURCE_NODE = nodes.find(node => node.id === left_node_id);
                    TARGET_NODE = nodes.find(node => node.id === right_node_id);
                    if (type === 'remove'){
                        let parameters_of_connected_custom_node = get_incomers_node(TARGET_NODE);
                        let united_data = parameters_of_connected_custom_node.map(ee => options_lists_data[ee.id]);
                        united_data = united_data.flat();
                        console.log('TTT', united_data);
                        updateNodeDataOptions(TARGET_NODE.id, united_data);
                    }
                }*/
                for (const match of matches) {
                    const [fullMatch, left_node_id, right_node_id] = match;
                    SOURCE_NODE = nodes.find(node => node.id === left_node_id);
                    TARGET_NODE = nodes.find(node => node.id === right_node_id);
                    if (type === 'remove') {
                        let parameters_of_connected_custom_node = get_incomers_node(TARGET_NODE)
                            .filter(ee => ee.id !== left_node_id); // Исключаем left_node_id из parameters_of_connected_custom_node
                        let united_data = parameters_of_connected_custom_node
                            .map(ee => options_lists_data[ee.id])
                            .flat();
                        console.log('TTT', united_data);
                        updateNodeDataOptions(TARGET_NODE.id, united_data);
                    }
                }


            });

            //console.log('-=LEFT  Node:', SOURCE_NODE);
            //console.log('-=RIGHT Node:', TARGET_NODE);
            //console.log('FFF', options_lists_data);

            //updateNodeDataOptions(TARGET_NODE.id, null);



            setEdges((oldEdges) => applyEdgeChanges(changes, oldEdges));
        },
        [setEdges, nodes],
    );

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
            console.log("Source Node Data:", sourceNode.data.parameters);


            const targetNodeId = params.target;
            const targetNode = nodes.find(node => node.id === targetNodeId);
            if (!targetNode) {
                console.error("Target node not found:", targetNodeId);
                return;
            }



            console.log("Target Node ID:", targetNodeId, targetNode.id, get_incomers_node(targetNode));
            console.log("Target Node Data:", targetNode.data);

            setEdges((prevEdges) => addEdge(params, prevEdges));
            //handleCustomNode(targetNode);
            // if (targetNode.type === 'custom') {
            //     let parameters_of_connected_custom_node = get_incomers_node(targetNode);
            //     let united_data = parameters_of_connected_custom_node.map(ee => options_lists_data[ee.id]);
            //     united_data = united_data.flat();
            //     console.log('ffefe', united_data, parameters_of_connected_custom_node);
            //     updateNodeDataOptions(targetNode.id, united_data);
            //     // updateNodeDataOptions(targetNodeId, sourceNode.data.parameters);
            // }
            setEdge({ id: targetNodeId, type: targetNode.type });
        },
        [nodes]
    );

    useEffect(() => {
        if (settedEdge != null) {
            if (settedEdge.type === 'custom') {
                let parameters_of_connected_custom_node = get_incomers_node(settedEdge);
                let united_data = parameters_of_connected_custom_node.map(ee => options_lists_data[ee.id]);
                united_data = united_data.flat();
                console.log('ffefe', united_data, parameters_of_connected_custom_node);
                updateNodeDataOptions(settedEdge.id, united_data);
                // updateNodeDataOptions(targetNodeId, sourceNode.data.parameters);
            }
        }

    }, [settedEdge, options_lists_data]);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((event) => {
        event.preventDefault();

        const { type, function_name, function_id, component_id } = JSON.parse(event.dataTransfer.getData('application/reactflow'));

        const position = reactFlowInstance.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });


        if (!type) {
            return;
        }
        let newData;
        let newid = getId();
        switch (type) {
            case 'custom':
                newData = {
                    id: newid,
                    label: `${function_name}`,
                    function_id: function_id,
                    is_return: false,
                    component_id: component_id
                };
                break;
            case 'startBlock':
                newData = { label: 'Начальный блок' };
                break;
            case 'endBlock':
                newData = { label: 'Конечный блок' };
                break;
            case 'parametrBlock':
                newData = {
                    id: newid,
                    label: 'Блок с параметрами',
                    function_to_update_parameters: updateOptions,
                };
                break;
            default:
                newData = { label: `${type} node` };
                break;
        }

        const newNode = [
            {
                id: newid,
                type,
                position,
                data: newData,
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
