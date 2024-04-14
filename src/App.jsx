import ComponentPanel from './componentPanel/componentPanel';
import './css/app.css';
import CustomNode from './components/mycomponent/CustomNode';
 
import StartNode from './components/InitialNodes/startBlock';
import EndNode from './components/InitialNodes/endBlock';
import ParametrBlock from './components/InitialNodes/parametrBlock';
import { v4 as uuidv4 } from 'uuid';

import { useBlocks } from './store';


import React, { useState, useEffect, useCallback } from 'react';
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


// let id = 1;
// const getId = () => `${id++}`;


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
    const blocks = useBlocks((state) => state.blocks);
    const addBlock = useBlocks((state) => state.addBlock);

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
        setSelectedNodeId([id, Math.random()]);
    };


    const get_outgoers_node = useCallback((node) => {
        const incomers = getOutgoers(
            node,
            nodes,
            edges,
        );
        return incomers;

    },
        [setNodes, nodes, edges, options_lists_data]
    );

    useEffect(() => {
        console.log('Nodes updated');
        console.log(nodes);
        
        
    }, [nodes]);

    const get_incomers_node = useCallback((node) => {
        const incomers = getIncomers(
            node,
            nodes,
            edges,
        );
        //console.log('connected with: ', incomers);
        return incomers;

    },
        [setNodes, nodes, edges, options_lists_data]
    );

    useEffect(() => {
        if (selectedNodeId != null) {


            const NODE = nodes.find(node => node.id === selectedNodeId[0]);
            //if (NODE.type === 'custom') {
            let connected_custom_nodes_to_parameter = get_outgoers_node(NODE);

            connected_custom_nodes_to_parameter.forEach(element => {
                let parameters_of_connected_custom_node = get_incomers_node(element);
                parameters_of_connected_custom_node = parameters_of_connected_custom_node.filter(item => item.type === 'parametrBlock');
                let united_data = parameters_of_connected_custom_node.map(ee => options_lists_data[ee.id]);
                united_data = united_data.flat();
                console.log('HHH', united_data);
                updateNodeDataOptions(element.id, united_data);
                update_end();
            });
            //}
        }

    }, [setOptions, selectedNodeId, options_lists_data]);






    const updateNodeDataOptions = (nodeId, options) => {
        setNodes((prevNodes) =>
            prevNodes.map((node) =>
                node.id === nodeId ? { ...node, data: { ...node.data, options: options } } : node
            )
        );
    };



    const updateNodeDataLabel = (nodeId, label) => {
        setNodes((prevNodes) =>
            prevNodes.map((node) =>
                node.id === nodeId ? { ...node, data: { ...node.data, label: label } } : node
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
                        updateNodeDataOptions(TARGET_NODE.id, united_data);
                    }
                }
            });
            setEdges((oldEdges) => applyEdgeChanges(changes, oldEdges));
            console.log('rre');
        },
        [setEdges, nodes],
    );

    const onConnect = useCallback(
        (params) => {
            console.log("Connection parameters:", params);
            const sourceNodeId = params.source;
            const sourceNode = nodes.find(node => node.id === sourceNodeId);
            if (!sourceNode) {
                //console.error("Source node not found:", sourceNodeId);
                return;
            }
            //console.log("Source Node ID:", sourceNodeId);
            //console.log("Source Node Data:", sourceNode.data.parameters);


            const targetNodeId = params.target;
            const targetNode = nodes.find(node => node.id === targetNodeId);
            if (!targetNode) {
                //console.error("Target node not found:", targetNodeId);
                return;
            }

            //console.log("Target Node ID:", targetNodeId, targetNode.id, get_incomers_node(targetNode));
            //console.log("Target Node Data:", targetNode.data);



            setEdges((prevEdges) => addEdge(params, prevEdges));
            setEdge({ id: targetNodeId, type: targetNode.type });


        },
        [nodes]
    );

    useEffect(() => {
        if (settedEdge != null) {
            if (settedEdge.type === 'custom') {
                let parameters_of_connected_custom_node = get_incomers_node(settedEdge);
                parameters_of_connected_custom_node = parameters_of_connected_custom_node.filter(item => item.type === 'parametrBlock');
                let united_data = parameters_of_connected_custom_node.map(ee => options_lists_data[ee.id]);
                united_data = united_data.flat();
                //console.log('ffefe', united_data, parameters_of_connected_custom_node);
                updateNodeDataOptions(settedEdge.id, united_data);
            }
            update_end();
            /*else if (settedEdge.type === 'endBlock') {
                update_end();
            }*/
        }

    }, [settedEdge, options_lists_data]);

    function update_end() {
        console.log('llawkd');

        /*nodes.forEach(element => {
            if (element.type !== 'endBlock') return;
            function f(incomer) {
                if (incomer.length === 0) return;
                if (incomer.type === 'custom') {
                    data_chain.push(incomer.data);
                }
                let incomers = get_incomers_node(incomer);
                incomers.forEach(incomer => {
                    f(incomer);
                });
            }
            let data_chain = [];
            let incomers = get_incomers_node(element);
            incomers.forEach(incomer => {
                f(incomer);
            });
            //console.log('CD - ', data_chain);
            let lab = [];
            data_chain.forEach(element => {
                lab.push(element.id);
            });
            updateNodeDataLabel(element.id, lab);
        });*/

        console.log('llawkd2');
    }

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
        let newid = uuidv4();
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
                newData = {
                    id: newid,
                    label: 'Конечный блок'
                };
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
        addBlock(newNode[0].id, [], [], newNode[0].data);
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
