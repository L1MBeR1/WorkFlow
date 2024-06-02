import ComponentPanel from './components/ComponentPanel/componentPanel.jsx';
import ResultPanel from './components/ResultPanel/resultPanel.jsx';
import './css/app.css';
import CustomNode from './components/Functions/functionNode.jsx';

import StartNode from './components/InitialNodes/startBlock.jsx';
import EndNode from './components/InitialNodes/endBlock.jsx';
import ParametrBlock from './components/InitialNodes/parametrBlock.jsx';
import ResultBlock from './components/InitialNodes/resultBlock.jsx';
import CodeBlock from './components/InitialNodes/codeBlock.jsx';
import ConditionBlock from './components/InitialNodes/conditionBlock.jsx';

import HeaderPanel from './components/HeaderPanel/headerPanel.jsx';

import { useBlocks } from './stores/store';
import { useDataTypes } from './stores/store';
import { useParameterBlocksData } from './stores/store';


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
    resultBlock: ResultBlock,
    codeBlock: CodeBlock,
    conditionBlock: ConditionBlock,
};

export default function App() {
    let lastId = 0;
    const blocks = useBlocks((state) => state.blocks);
    const addBlock = useBlocks((state) => state.addBlock);
    const loadDataTypes = useDataTypes((state) => state.loadTypes);
    const datatypes = useDataTypes((state) => state.types);
    const addParameterBlock = useParameterBlocksData((state) => state.add);
    // const parameterBlocks = useParameterBlocksData((state) => state.blocks);
    const updateBlockIncomers = useBlocks((state) => state.updateBlockIncomers);
    const updateBlockOutcomers = useBlocks((state) => state.updateBlockOutcomers);
    const deleteBlockIncomer = useBlocks((state) => state.deleteBlockIncomer);
    const deleteBlockOutcomer = useBlocks((state) => state.deleteBlockOutcomer);
    const checkIfBlockExists = useBlocks((state) => state.checkIfBlockExists);

    // const [options_lists_data, setOptions] = useState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);


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

    useEffect(() => {
        loadDataTypes();
    }, []);


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
                        deleteBlockIncomer(TARGET_NODE.id, SOURCE_NODE.id);
                        deleteBlockOutcomer(SOURCE_NODE.id, TARGET_NODE.id);
                    }
                }
            });
            setEdges((oldEdges) => applyEdgeChanges(changes, oldEdges));
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
            let leftNodes = getIncomingNodes(rightSideNode);
            leftNodes.forEach(element => {
                updateBlockIncomers(rightSideNode.id, element.id);
                updateBlockOutcomers(element.id, rightSideNode.id);
            });
        }
    }, [rightSideNode]);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((event) => {
        event.preventDefault();

        const { id, type, function_name, function_id, component_id } = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const position = reactFlowInstance.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });


        if (!type) {
            return;
        }


        let newData;
        let newid = `${lastId++}`;
        switch (type) {
            case 'custom':
                newData = {
                    id: newid,
                    label: `${function_name} (${newid})`,
                    function_id: function_id,
                    is_return: false,
                    component_id: component_id
                };
                break;
            case 'startBlock':
                newData = { label: `Начальный блок (${newid})` };
                break;
            case 'endBlock':


                newData = {
                    id: newid,
                    label: `Конечный блок (${newid})`
                };
                break;
            case 'parametrBlock':
                newData = {
                    id: newid,
                    label: `Блок с параметрами (${newid})`,
                    /*function_to_update_parameters: updateOptions,*/
                };
                break;
            case 'resultBlock':
                newData = {
                    id: newid,
                    label: `Блок с результатами (${newid})`,
                };
                break;
            case 'codeBlock':
                newData = {
                    id: newid,
                    label: `Блок с кодом (${newid})`,
                    // output_parameters: [],
                };
                break;
            case 'conditionBlock':
                newData = {
                    id: newid,
                    label: `Условный блок (${newid})`,
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
        if (type === 'parametrBlock') {
            addParameterBlock(newNode[0].id, newNode[0].type, newNode[0].data.label, newNode[0].data);
        }
        if (type !== 'parametrBlock') {
            addBlock(newNode[0].id, newNode[0].type, [], [], newNode[0].data);
        }

    }, [reactFlowInstance],);

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
                        <Background variant="dots" color="#1e31db" gap={15} size={1} />
                    </ReactFlow>
                </div>
                <ResultPanel></ResultPanel>
            </div>

        </div>
    );
}
