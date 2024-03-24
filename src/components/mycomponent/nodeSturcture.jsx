export const customNodeStructure= {
            id: getId(),
            type:`${type}`,
            position,
            data: { 
                label: `${function_name}` ,
                function_id: function_id,
                is_return: false,
                component_id: component_id
            },
        };