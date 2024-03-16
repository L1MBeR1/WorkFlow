const pool = require("../database");

async function select_all_components() {
	const query = `
					SELECT DISTINCT c.id, c.name as "Название", c.description as "Описание"
					FROM components.components c
					JOIN components.component_function cf
					ON c.id = cf.id_of_component
					WHERE (cf.name is not null) AND (cf.name <> '')
	`;

	try {
		const result = await pool.query(query);
		return result.rows;
	} catch (error) {
		console.error("Error executing query:", error);
		throw error;
	}
}

async function select_component_functions_by_component_id(component_id) {
	const query = `
					SELECT cf.id, cf.name as "Название"
					FROM components.component_function cf
					JOIN components.components c
					ON c.id = cf.id_of_component
					WHERE (c.id = $1) AND (cf.name <> '') AND (cf.name is not null)
	`;

	try {
		const result = await pool.query(query, [Number(component_id)]);
		return result.rows;
	} catch (error) {
		console.error("Error executing query:", error);
		throw error;
	}
}

async function select_services_by_component_id(component_id) {
	const query = `
					SELECT s.id, s.uri as "Ссылка", s.token, s.name as "Название"
                    FROM services.service s
                    JOIN semantic_annotation.compon_by_service cbs
                    ON cbs.service_id = s.id
                    JOIN components.components c
                    ON cbs.component_function_parameter_id = c.id
                    WHERE c.id = $1
	`;

	try {
		const result = await pool.query(query, [Number(component_id)]);
		return result.rows;
	} catch (error) {
		console.error("Error executing query:", error);
		throw error;
	}
}

async function select_component_function_parameters_by_function_id(function_id, is_return) {
	const query = `
					SELECT cfp.id, cfp.name as "Название", t.type
                    FROM components.component_function_parameter cfp
                    JOIN components.component_function cf
                    ON cf.id = cfp.id_of_component_function
                    JOIN components.type t
                    ON t.id = cfp.id_type
                    WHERE cf.id = $1 AND cfp."is return value" = $2
	`;

	try {
		const result = await pool.query(query, [Number(function_id), Boolean(is_return)]);
		return result.rows;
	} catch (error) {
		console.error("Error executing query:", error);
		throw error;
	}
}

async function select_service_points_by_service_id(service_id) {
	const query = `
					SELECT s.id,s.uri
                    FROM services.service_points s
                    WHERE s.service_id = $1
	`;

	try {
		const result = await pool.query(query, [Number(service_id)]);
		return result.rows;
	} catch (error) {
		console.error("Error executing query:", error);
		throw error;
	}
}

module.exports = {
	select_all_components,
	select_component_functions_by_component_id,
	select_services_by_component_id,
	select_component_function_parameters_by_function_id,
	select_service_points_by_service_id,
};
