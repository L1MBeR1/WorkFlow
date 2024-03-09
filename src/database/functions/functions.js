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


module.exports = {
	select_all_components,
	select_component_functions_by_component_id,
};
