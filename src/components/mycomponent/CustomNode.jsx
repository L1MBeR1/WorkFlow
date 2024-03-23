import React, { useState, useEffect, memo } from 'react';
import { Handle, Position } from 'reactflow';
import './ccc.css';

export default memo(({ data, isConnectable }) => {
    const [input_parameters, setInputParameters] = useState([]);

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

    console.log('InPar: ', input_parameters);

    return (
        <>
            <div className="CCC">
                {data.label}
            </div>
            <div className='parameters-Box'>
                {input_parameters.map((item, index) => (
                    <div key={index}>
                        
                        <table className='tablep'>
                            <thead>
                                <tr>
                                    <th>
                                        <p>Название</p>
                                    </th>
                                    <th>
                                        <p>Тип</p>
                                    </th>
                                    <th>
                                        <p>Поле</p>
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
                                            <p>{item.type}</p>
                                        </td>
                                        <td>
                                            <input type="text" name="" id="" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                ))}
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