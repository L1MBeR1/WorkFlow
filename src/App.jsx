import ComponentPanel from './componentPanel/componentPanel';
import './css/app.css';
import CustomNode from './components/mycomponent/CustomNode';

import StartNode from './components/InitialNodes/startBlock';
import EndNode from './components/InitialNodes/endBlock';
import ParametrBlock from './components/InitialNodes/parametrBlock';
import ResultBlock from './components/InitialNodes/resultBlock';

import HeaderPanel from './headerPanel/panel';

import { v4 as uuidv4 } from 'uuid';

import { useBlocks } from './store';
import { useParameterBlocksData } from './store';


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
    resultBlock:ResultBlock,
};

export default function App() {
    const blocks = useBlocks((state) => state.blocks);
    const addBlock = useBlocks((state) => state.addBlock);
    const addParameterBlock = useParameterBlocksData((state) => state.add);
    const parameterBlocks = useParameterBlocksData((state) => state.blocks);
    const updateBlockIncomers = useBlocks((state) => state.updateBlockIncomers); 
    const updateBlockOutcomers = useBlocks((state) => state.updateBlockOutcomers);
    const deleteBlockIncomer = useBlocks((state) => state.deleteBlockIncomer);
    const deleteBlockOutcomer = useBlocks((state) => state.deleteBlockOutcomer);

    const [options_lists_data, setOptions] = useState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);

    /*
        TODO: сделать удаление узла из списка узлов blocks и parameterBlocks
        при его удалении с холста
    
    **/
    


    const [edges, setEdges] = useEdgesState([]);
    const [rightSideNode, setRightSideNode] = useState(null);

    const getOutgoingNodes = useCallback((node) => {
        const outgoingNodes = getOutgoers(node, nodes, edges);
        return outgoingNodes;
    }, [nodes, edges]);

    const getIncomingNodes = useCallback((node) => {
        const incomingNodes = getIncomers(node, nodes, edges);
        return incomingNodes;
    }, [nodes, edges]);


    const onEdgesChange = useCallback(
        (changes) => {
            const connected_nodes_regexp = /^\w*-(\w+)-(\w+)$/gm;
            let SOURCE_NODE;
            let TARGET_NODE;

            changes.forEach(({ id, type, selected }) => {
                const matches = [...id.matchAll(connected_nodes_regexp)];
                for (const match of matches) {
                    const [fullMatch, left_node_id, right_node_id] = match;
                    SOURCE_NODE = nodes.find(node => node.id === left_node_id);
                    TARGET_NODE = nodes.find(node => node.id === right_node_id);
                    if (type === 'remove') {
                        let parameters_of_connected_custom_node = getIncomingNodes(TARGET_NODE)
                            .filter(ee => ee.id !== left_node_id); // Исключаем left_node_id из parameters_of_connected_custom_node
                        let united_data = parameters_of_connected_custom_node
                            .map(ee => options_lists_data[ee.id])
                            .flat();
                            
                        deleteBlockIncomer(TARGET_NODE.id, SOURCE_NODE.id);
                        deleteBlockOutcomer(SOURCE_NODE.id, TARGET_NODE.id);

                    }
                }
            });
            setEdges((oldEdges) => applyEdgeChanges(changes, oldEdges));
            console.log('rre');
            console.log(nodes);
            console.log('rre');
            console.log(parameterBlocks);
        },
        [setEdges, nodes],
    );

    const onConnect = useCallback(
        ({ source, target }) => {
            const sourceNode = nodes.find(node => node.id === source);
            const targetNode = nodes.find(node => node.id === target);
            if (sourceNode && targetNode) {
                setEdges(prevEdges => addEdge({ source, target }, prevEdges));
                setRightSideNode({ id: target, type: targetNode.type });
            }
        },
        [nodes]
    );

    useEffect(() => {
        if (rightSideNode != null) {
            /*if (rightSideNode.type === 'custom') {
                let parameters_of_connected_custom_node = getIncomingNodes(rightSideNode);
                parameters_of_connected_custom_node = parameters_of_connected_custom_node.filter(item => item.type === 'parametrBlock');
                let united_data = parameters_of_connected_custom_node.map(ee => options_lists_data[ee.id]);
                united_data = united_data.flat();
                //updateNodeDataOptions(rightSideNode.id, united_data);
            }*/

            let leftNodes = getIncomingNodes(rightSideNode);
            leftNodes.forEach(element => {
                updateBlockIncomers(rightSideNode.id, element.id);
                updateBlockOutcomers(element.id, rightSideNode.id);
            });
        }
    }, [rightSideNode/*, options_lists_data*/]);

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
        let newid = uuidv4().replaceAll("-", "");
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
                    /*function_to_update_parameters: updateOptions,*/
                };
                break;
            case 'resultBlock':
                newData = {
                    id: newid,
                    label: 'Блок с результатами',
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
        console.log('spawned with id ', newid);
        if (type === 'parametrBlock') {
            addParameterBlock(newNode[0].id, newNode[0].type, newNode[0].data);
        }
        if (type !== 'parametrBlock') {
            addBlock(newNode[0].id, newNode[0].type, [], [], newNode[0].data);
        }

    },
        [reactFlowInstance],
    );


    return (
        <div className="App">
            <HeaderPanel></HeaderPanel>
            <div className='reactFlowDiv'>
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
                    <Background variant="dots" color="#1e31db" gap={15} size={1} />
                </ReactFlow>
            </div>
            </div>
        </div>
    );
}
