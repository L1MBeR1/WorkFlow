const express = require("express");
const {
    select_all_components,
    select_all_functions,
    select_component_functions_by_component_id,
    select_services_by_component_id,
    select_component_function_parameters_by_function_id,
    select_service_points_by_service_id,
    select_data_types
} = require("../database/functions/functions");

const router = express.Router();

const handleRequest = async (res, queryFunction, args, errorMessage) => {
    try {
        const response = await queryFunction(...args);

        if (response) {
            res.json(response);
        } else {
            res.status(404).json({ error: errorMessage });
        }
    } catch (error) {
        console.error("err:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

router.post("/database/components/all", async (req, res) => {
    await handleRequest(
        res,
        select_all_components,
        [],
        "Components not found"
    );
});

router.post("/database/functions/all", async (req, res) => {
    await handleRequest(
        res,
        select_all_functions,
        [],
        "Functions not found"
    );
});

router.post("/database/components/functions/by_component_id", async (req, res) => {
    const { component_id } = req.body;
    await handleRequest(
        res,
        select_component_functions_by_component_id,
        [component_id],
        "Component functions not found"
    );
});

router.post("/database/services/by_component_id", async (req, res) => {
    const { component_id } = req.body;
    await handleRequest(
        res,
        select_services_by_component_id,
        [component_id],
        "Services not found"
    );
});

router.post("/database/components/functions/parameters/by_function_id", async (req, res) => {
    const { function_id, is_return } = req.body;
    await handleRequest(
        res,
        select_component_function_parameters_by_function_id,
        [function_id, is_return],
        "Function parameters not found"
    );
});

router.post("/database/services/service_points/by_service_id", async (req, res) => {
    const { service_id } = req.body;
    await handleRequest(
        res,
        select_service_points_by_service_id,
        [service_id],
        "Service points not found"
    );
});

router.post("/database/data_types", async (req, res) => {
    await handleRequest(
        res,
        select_data_types,
        [],
        "Data types not found"
    );
});

module.exports = router;
