import React, { useCallback,useEffect } from 'react';
import ComponentPanel from './componentPanel/componentPanel';
import ReactFlow, {
	MiniMap,
	Controls,
	Background,
	useNodesState,
	useEdgesState,
	addEdge,
} from 'reactflow';

import 'reactflow/dist/style.css';
import './css/app.css';

const initialNodes = [
	{ id: '1', position: { x: 500, y: 500 }, data: { label: '1' } },
	{ id: '2', position: { x: 500, y: 600 }, data: { label: '2' } },
];
const initialEdges = [];

export default function App() {
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	 


	return (
		<div className="App">
			<ComponentPanel></ComponentPanel>
			<div className='mainCanvas'>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					// onConnect={onConnect}
				>
					<Controls position="bottom-right" />
					{/* <MiniMap /> */}
					<Background variant="dots" color="#6e0cab" gap={15} size={1} />
				</ReactFlow>
			</div>
		</div>
	);
}
