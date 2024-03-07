
const express = require("express");
const { select_all_components, select_component_functions_by_component_id } = require("../database/functions/functions");

const router = express.Router();

router.post("/database/components/all", async (req, res) => {
    try {
        const response = await select_all_components();
        res.json(response);
    } catch (error) {
        console.error("err:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post("/database/components/functions/by_component_id", async (req, res) => {

    const { component_id } = req.body;
    //const component_id = req.body['component_id'];

    try {
        const response = await select_component_functions_by_component_id(component_id);

        if (response) {
            res.json(response);
        } else {
            res.status(404).json({ error: "Component not found" });
        }
    } catch (error) {
        console.error("err:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



module.exports = router;
