const pool = require("../database");

async function select_all_components() {
	const query = `
		SELECT DISTINCT c.id, c.name as "name", c.description as "description"
		FROM services.service s
		JOIN semantic_annotation.compon_by_service cbs ON cbs.service_id = s.id
		JOIN components.components c ON cbs.component_function_parameter_id = c.id
		JOIN components.component_function cf ON c.id = cf.id_of_component
		JOIN services.service_points sp ON s.id = sp.service_id
		WHERE (cf.name is not null) AND (cf.name <> '')
	`;

	let client;
	try {
		client = await pool.connect();
		const result = await client.query(query);
		return result.rows;
	} catch (error) {
		console.error("Error executing query:", error);
		throw error;
	} finally {
		if (client) {
			client.release();
		}
	}
}

async function select_all_functions() {
	const query = `
		SELECT * 
		FROM components.component_function cf 
		WHERE (cf.name <> '') AND (cf.name is not null)
	`;

	let client;
	try {
		client = await pool.connect();
		const result = await client.query(query);
		return result.rows;
	} catch (error) {
		console.error("Error executing query:", error);
		throw error;
	} finally {
		if (client) {
			client.release();
		}
	}
}

async function select_data_types() {
	const query = `
		SELECT * 
		FROM  components.type c 
		WHERE (c.type <> '') AND (c.type is not null)
	`;

	let client;
	try {
		client = await pool.connect();
		const result = await client.query(query);
		return result.rows;
	} catch (error) {
		console.error("Error executing query:", error);
		throw error;
	} finally {
		if (client) {
			client.release();
		}
	}
}

async function select_component_functions_by_component_id() {
	const query = `
		SELECT cf.id, cf.name as "name"
		FROM components.component_function cf
		JOIN components.components c
		ON c.id = cf.id_of_component
		WHERE (c.id = $1) AND (cf.name <> '') AND (cf.name is not null)
	`;

	let client;
	try {
		client = await pool.connect();
		const result = await client.query(query);
		return result.rows;
	} catch (error) {
		console.error("Error executing query:", error);
		throw error;
	} finally {
		if (client) {
			client.release();
		}
	}
}

async function select_services_by_component_id() {
	const query = `
		SELECT s.id, s.uri as "uri", s.token, s.name as "name"
		FROM services.service s
		JOIN semantic_annotation.compon_by_service cbs
		ON cbs.service_id = s.id
		JOIN components.components c
		ON cbs.component_function_parameter_id = c.id
		WHERE c.id = $1
	`;

	let client;
	try {
		client = await pool.connect();
		const result = await client.query(query);
		return result.rows;
	} catch (error) {
		console.error("Error executing query:", error);
		throw error;
	} finally {
		if (client) {
			client.release();
		}
	}
}

async function select_component_function_parameters_by_function_id() {
	const query = `
		SELECT cfp.id, cfp.name as "name", t.type
		FROM components.component_function_parameter cfp
		JOIN components.component_function cf
		ON cf.id = cfp.id_of_component_function
		JOIN components.type t
		ON t.id = cfp.id_type
		WHERE cf.id = $1 AND cfp."is return value" = $2
	`;

	let client;
	try {
		client = await pool.connect();
		const result = await client.query(query);
		return result.rows;
	} catch (error) {
		console.error("Error executing query:", error);
		throw error;
	} finally {
		if (client) {
			client.release();
		}
	}
}

async function select_service_points_by_service_id() {
	const query = `
		SELECT s.id,s.uri
		FROM services.service_points s
		WHERE s.service_id = $1
	`;

	let client;
	try {
		client = await pool.connect();
		const result = await client.query(query);
		return result.rows;
	} catch (error) {
		console.error("Error executing query:", error);
		throw error;
	} finally {
		if (client) {
			client.release();
		}
	}
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
