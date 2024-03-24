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
            <div className='component-Function-Block'>
                <div className="block-Header">
                    {data.label}
                </div>
                <div className='parameters-Box'>
                    <div>
                        <table>
                            <tr>
                                <td>
                                    +
                                </td>
                                <td>
                                    <table className='tablep'>
                                        <tr>
                                            <th>
                                                <p>Название</p>
                                            </th>
                                            <th>
                                                <p>Поле ввода</p>
                                            </th>
                                        </tr>
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
                                    </table>
                                </td>
                                <td>
                                    +
                                </td>
                            </tr>
                        </table>
                    </div>
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