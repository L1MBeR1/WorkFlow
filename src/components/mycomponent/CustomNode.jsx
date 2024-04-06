import React, { useState, useEffect, memo, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import './ccc.css';
import { v4 as uuidv4 } from 'uuid';

export default memo(({ data, isConnectable }) => {
    const [input_parameters, setInputParameters] = useState([]);
    const [services_functions, setServicesFunctions] = useState([]);
    const [entry_points, setEntryPoints] = useState([]);
    const [options, setOptions] = useState([
        { id: '1', value: '-' },
    ]);
    
    // const [data, setData] = useState({
    //     options: null, // Начальное значение options устанавливаем как null
    // });
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
                //console.log(responseData)
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
        //console.log(data);

    }, [data, entry_points]);

    const handleServiceChange = (event) => {
        const selectedOption = event.target.value;
        // const selectedOption = event.target.innerText;
        data.selectedService = selectedOption;
        //console.log(data);
    };

    const handleEntryChange = (event) => {
        const selectedOption = event.target.value;
        // const selectedOption = event.target.innerText;
        data.selectedEntry = selectedOption;
        //console.log(data);
    };



    const changeSelect = (e) => {
        const selectedValue = e.target.value;
        const def = [{ id: '1', value: '-' }];
        console.log('nnnn', data.options, selectedValue);

        if (!data.options || !Array.isArray(data.options) || data.options.length === 0) {
            setOptions([{ id: '1', value: '-' }]);
        } else {
            const combinedOptions = def.concat(data.options);
            setOptions(combinedOptions);
        }
        //console.log('gg', data.connected_parameters);
    };


    return (
        <>
            <div className='component-Function-Block'>
                <Handle
                    className='HandleComponent'
                    type="target"
                    position={Position.Left}
                    isConnectable={isConnectable}
                />
                <header className='function-block__header'>
                    {data.label}
                </header>
                <hr></hr>
                <div className='parameters-Box'>
                    <div className='parameter-Block'>
                        <p className='h'>Входные параметры</p>
                        <header className='parameter-Header'>
                            <div className='parameter-Header_name'>Название</div>
                            <div className='parameter-Header_type'>Тип</div>
                            <div className='parameter-Header_type'>Значение</div>
                        </header>
                        <div className='parametrs'>
                            {input_parameters.map((item, index) => (
                                <div key={index} className='parameter'>
                                    <div className='fucn_parameter_name'>{item.Название}</div>
                                    <div className='fucn_parameter_type'>{item.type}</div>
                                    <select onClick={changeSelect} className='fucn_parameter_value'>
                                        {options.map(option => (
                                            <option key={option.id} value={option.value}>
                                                {option.value}
                                            </option>
                                        ))}
                                    </select>

                                </div>
                            ))}

                        </div>
                    </div>
                    <div className='parameter-Block'>
                        <div className='parameter-Container'>
                            <div className='parameter-Header'>
                                <p>Название</p>
                            </div>
                            <div className='parameter-Select'>
                                <div className="custom-select">
                                    <select ref={selectRef} onChange={handleServiceChange}>
                                        {services_functions.map((item, index) => (
                                            <option key={index} value={index}>
                                                {item.Название}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='parameter-Block'>
                        <div className='parameter-Container'>
                            <div className='parameter-Header'>
                                <p>URI</p>
                            </div>
                            <div className='parameter-Select'>
                                <div className="custom-select">
                                    <select ref={selectRef2} onChange={handleEntryChange}>
                                        {entry_points.map((item, index) => (
                                            <option key={index} value={index}>
                                                {item.uri}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <Handle
                    className='HandleComponent'
                    type="source"
                    position={Position.Right}
                    isConnectable={isConnectable}
                />
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

/*{options.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}*/