async function select_all_components() {
	const mockData = [
		{ id: 1, name: "Component 1", description: "Description of Component 1" },
		{ id: 2, name: "Component 2", description: "Description of Component 2" },
		{ id: 3, name: "Component 3", description: "Description of Component 3" }
	];
	return mockData;
}

async function select_all_functions() {
	const mockData = [
		{ id: 1, id_of_component: 1, name: "Function 1" },
		{ id: 2, id_of_component: 1, name: "Function 2" },
		{ id: 3, id_of_component: 1, name: "Function 3" },
		{ id: 4, id_of_component: 2, name: "Function 4" },
		{ id: 5, id_of_component: 2, name: "Function 5" },
		{ id: 6, id_of_component: 2, name: "Function 6" },
		{ id: 7, id_of_component: 3, name: "Function 7" },
		{ id: 8, id_of_component: 3, name: "Function 8" },

	];
	return mockData;
}

async function select_data_types() {
	const mockData = [
		{ id: 1, type: "Type 1" },
		{ id: 2, type: "Type 2" },
		{ id: 3, type: "Type 3" }
	];
	return mockData;
}

async function select_component_functions_by_component_id(component_id) {
	const mockData = [
		{ id: 1, name: "Function 1-1" },
		{ id: 2, name: "Function 1-2" },
		{ id: 3, name: "Function 2" }
	];
	return mockData;
	// return mockData.filter(item => item.id === component_id);
}

async function select_services_by_component_id(component_id) {
	const mockData = [
		{ id: 1, uri: "http://example.com/service1", token: "token1", name: "Service 1" },
		{ id: 2, uri: "http://example.com/service2", token: "token2", name: "Service 2" }
	];
	return mockData.filter(item => item.id === component_id);
}

async function select_component_function_parameters_by_function_id(function_id, is_return) {
	const mockData = [
		{ id: 1, name: "Parameter 1", type: "Type 1" },
		{ id: 2, name: "Parameter 2", type: "Type 2" },
		{ id: 3, name: "Parameter 3", type: "Type 2" },
		{ id: 4, name: "Parameter 4", type: "Type 3" },
		{ id: 5, name: "Parameter 5", type: "Type 1" },
		{ id: 6, name: "Parameter 6", type: "Type 2" },
		{ id: 7, name: "Parameter 7", type: "Type 2" },
		{ id: 8, name: "Parameter 8", type: "Type 2" },
		{ id: 9, name: "Parameter 9", type: "Type 1" },
		{ id: 10, name: "Parameter 10", type: "Type 1" },
		{ id: 11, name: "Parameter 11", type: "Type 1" },
		{ id: 12, name: "Parameter 12", type: "Type 1" },
		{ id: 13, name: "Parameter 13", type: "Type 1" },
		
	];
	return mockData.filter(item => item.id === function_id /*&& item.is_return === is_return*/);
}

async function select_service_points_by_service_id(service_id) {
	const mockData = [
		{ id: 1, uri: "http://example.com/point1" },
		{ id: 2, uri: "http://example.com/point2" }
	];
	return mockData.filter(item => item.id === service_id);
}

module.exports = {
	select_all_components,
	select_all_functions,
	select_component_functions_by_component_id,
	select_services_by_component_id,
	select_component_function_parameters_by_function_id,
	select_service_points_by_service_id,
	select_data_types,
};
