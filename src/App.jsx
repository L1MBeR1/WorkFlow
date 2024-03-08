import ComponentPanel from './componentPanel/componentPanel';
import './css/app.css';
import ReactFlowSpace from './ReactFlow/ReactFlow'
export default function App() {

	return (
		<div className="App">
			<ComponentPanel></ComponentPanel>
			<div className='mainCanvas'>
				<ReactFlowSpace></ReactFlowSpace>
			</div>
		</div>
	);
}
