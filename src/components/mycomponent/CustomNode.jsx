import React, { useState, useEffect, memo, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import './ccc.css';

export default memo(({ data, isConnectable }) => {
    const [input_parameters, setInputParameters] = useState([]);
    const [services_functions, setServicesFunctions] = useState([]);
    const [entry_points, setEntryPoints] = useState([]);
    const selectRef = useRef(null);
    const selectRef2 = useRef(null);

    useEffect(() => {
        const fetchInputParameters = async () => {
            try {
                const response = await fetch('http://localhost:4000/database/components/functions/parameters/by_function_id', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "function_id": data.function_id,
                        "is_return": data.is_return
                    }),
                });
                const responseData = await response.json();
                setInputParameters(responseData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchInputParameters();
    }, [data]);

    useEffect(() => {
        const fetchInputParameters = async () => {
            try {
                const response = await fetch('http://localhost:4000/database/services/by_component_id', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "component_id": data.component_id
                    }),
                });
                const responseData = await response.json();
                setServicesFunctions(responseData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchInputParameters();
    }, [data]);

    useEffect(() => {
        const fetchEntryPoints = async () => {
            try {
                if (services_functions.length > 0) {
                    const response = await fetch('http://localhost:4000/database/services/service_points/by_service_id', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            "service_id": services_functions[0].id
                        }),
                    });
                    const responseData = await response.json();
                    setEntryPoints(responseData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchEntryPoints();
    }, [services_functions]);

    useEffect(() => {
        const selectedServiceOption = selectRef.current.value;
        data.selectedService = selectedServiceOption;
        const selectedEntryOption = selectRef2.current.value;
        data.selectedEntry = selectedEntryOption;
        console.log(data);

    }, [data, entry_points]);

    const handleServiceChange = (event) => {
        const selectedOption = event.target.value;
        // const selectedOption = event.target.innerText;
        data.selectedService = selectedOption;
        console.log(data);
    };

    const handleEntryChange = (event) => {
        const selectedOption = event.target.value;
        // const selectedOption = event.target.innerText;
        data.selectedEntry = selectedOption;
        console.log(data);
    };


    return (
        <>
            <div className='component-Function-Block'>
                <div className="block-Header">
                    {data.label}
                </div>
                <div className='parameters-Box'>

                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <Handle
                                        className='HandleComponent'
                                        type="target"
                                        position={Position.Left}
                                        onConnect={(params) => console.log('handle onConnect', params)}
                                        isConnectable={isConnectable}
                                    />
                                </td>
                                <td>
                                    <table className='table-Parameters'>
                                        <thead>
                                            <tr>
                                                <th>
                                                    <p>Название</p>
                                                </th>
                                                <th>
                                                    <p>Поле ввода</p>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {input_parameters.map((item, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <p>{item.Название}</p>
                                                    </td>
                                                    <td>
                                                        <input type="text" name="" id="" placeholder={item.type} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>

                                    </table>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>
                                                    Название
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div className="custom-select">
                                                        <select ref={selectRef} onChange={handleServiceChange}>
                                                            {services_functions.map((item, index) => (
                                                                <option key={index} value={index}>
                                                                    {item.Название}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>


                                    <table>
                                        <thead>
                                            <tr>
                                                <th>
                                                    URI
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div className="custom-select">
                                                        <select ref={selectRef2} onChange={handleEntryChange}>
                                                            {entry_points.map((item, index) => (
                                                                <option key={index} value={index}>
                                                                    {item.uri}
                                                                </option>
                                                            ))}

                                                        </select>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                                <td>
                                    <Handle
                                        className='HandleComponent'
                                        type="source"
                                        position={Position.Right}
                                        id="b"
                                        isConnectable={isConnectable}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
});


/*
{Object.entries(item).map(([key, value]) => (
                            <p key={key}>
                                <strong>{key}:</strong> {value}
                                <input type="text" name={key} id="" />
                            </p>
                        ))}
*/