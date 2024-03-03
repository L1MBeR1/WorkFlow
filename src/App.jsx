import React, { useCallback,useEffect } from 'react';
import React, { useCallback, useEffect } from 'react'; // Обратите внимание на добавление useEffect
import ReactFlow, {
	MiniMap,
	Controls,
	Background,
	useNodesState,
	useEdgesState,
	addEdge,
} from 'reactflow';

import 'reactflow/dist/style.css';

const initialNodes = [
	{ id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
	{ id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];
const initialEdges = [];

export default function App() {
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	 
	const onConnect = useCallback(


		/* Для запроса к server.js на localhost:4000/test при загрузке страницы*/
		async (params) => {
			try {
				const dataToSend = { /* данные, которые нужно отправить */ };

				const response = await fetch('http://localhost:4000/test', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(dataToSend),
				});

				if (response.ok) {
					const responseData = await response.json();
					console.log('Server response:', responseData);
				} else {
					console.error('Error:', response.status, response.statusText);
				}
			} catch (error) {
				console.error('Error sending data to the server:', error);
			}
		},
		[],
	);

	useEffect(() => {
		onConnect(); 
	}, [onConnect]);
	/* Конец  */


	return (
		<div style={{ width: '100vw', height: '100vh' }}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
			>
				<Controls position="bottom-right" />
				{/* <MiniMap /> */}
				<Background variant="dots" color="#6e0cab" gap={15} size={1} />
			</ReactFlow>
		</div>
	);
}
