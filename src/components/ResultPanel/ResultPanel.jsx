// import React from "react";
import React, { useState, useEffect, memo, useRef } from 'react';
import './ResultPanel.css';
import { useBlocks } from '../../stores/store';
import { useParameterBlocksData } from '../../stores/store';
import ResultPanelStatus from '../../stores/storeResult';
import { ReactComponent as Close } from './close.svg';
import CodeContainer from '../CodeContainer';



const ResultPanel = () => {
    const blocks = useBlocks((state) => state.blocks);
    const parameterBlocks = useParameterBlocksData((state) => state.blocks);
    const { isOpen, setIsOpen } = ResultPanelStatus();
    const [specificationContent, setSpecificationContent] = useState();

    const convertJSONtoString = (json) => {

    };

    const getSingleParameterBlock = () => {
        let parameterBlock = [];
        parameterBlocks.forEach(element => {
            console.log('ELEMENT', element);
            if (element.data && element.data.length > 0) {

                parameterBlock = [...parameterBlock, ...element.data];
            }
        });
        return parameterBlock;
    };

    const makeSpecification = (queue) => {
        console.log('queue', queue);
        let parameterBlock = getSingleParameterBlock();

        let specification_json = {
            service_data: [],
            blocks: [],
            result: []
        };

        function fillServiceSample({ id = null, serviceID = null, entry_pointID = null }) {
            let block_json = Object.assign({},
                id && { id },
                serviceID && { serviceID },
                entry_pointID && { entry_pointID }
            );

            return block_json;
        }

        function fillBlock({ id = null, type = null, specification = {}, inputs = [], outputs = [], transition = {} }) {
            let block_json = Object.assign({},
                id && { id },
                type && { type_of_block: type },
                Object.keys(specification).length && { specification },
                inputs.length && { inputs },
                outputs.length && { outputs },
                Object.keys(transition).length && { transition }
            );

            return block_json;
        }

        queue.forEach(blockId => {
            let block = blocks.find((block) => block.selfId === blockId);

            // заполнение списка service_data
            if (block.type === 'custom') {
                if (block.data) {
                    if (block.data.parameters) {
                        if (block.data.parameters[0]) {


                            let serviceSample = fillServiceSample({
                                id: block.data.function_id,
                                serviceID: block.data.parameters[0].service_id ?
                                    block.data.parameters[0].service_id : null,
                                entry_pointID: block.data.parameters[0].uri_id ?
                                    block.data.parameters[0].uri_id : null
                            });
                            specification_json.service_data.push(serviceSample);

                        }
                    }



                }




                block = fillBlock({
                    id: block.selfId, // или block.data.function_id
                    type: block.type,
                    inputs: block.incomeConnections,
                    outputs: block.outcomeConnections,
                    specification: {
                        componentID: block.data.component_id,
                        functionID: block.data.function_id
                    },
                    transition: {
                        "type": "jump",
                        "blockID": block.outcomeConnections // должен быть только один выход
                    }
                });
                specification_json.blocks.push(block);
            }
            else if (block.type === 'conditionBlock') {
                block = fillBlock({
                    id: block.selfId, // или block.data.function_id
                    type: block.type,
                    inputs: block.incomeConnections,
                    outputs: block.outcomeConnections,
                    specification: {
                        componentID: block.data.component_id,
                        functionID: block.data.function_id
                    },
                    transition: {
                        "type": "condition",
                        "blockID_true": block.data.true, // должен быть только один выход
                        "blockID_false": block.data.false, // должен быть только один выход
                    }
                });
                specification_json.blocks.push(block);
            }

        });
        specification_json.blocks.push(
            fillBlock({
                id: blocks.find(block => block.type === 'endBlock').selfId,
                type: 'end_block',
            })
        )

        specification_json.blocks.push(
            fillBlock({
                id: (Math.max(...queue.map(Number))) + 1,
                type: 'parameters_block',
                outputs: parameterBlock,
            })
        );

        setSpecificationContent(JSON.stringify(specification_json, null, 2));
    };

    useEffect(() => {
        /*if (!isOpen) {
            return 0;
        }*/

        /*if (blocks.length > 0) {
            let endBlock = blocks.find((block) => block.type === 'endBlock');
            if (endBlock) {
                if (endBlock.incomeConnections.length !== 0 && endBlock.incomeConnections) {
                    let blocksQueue = [];
                    const get_left = (block) => {
                        console.log('type', block);
                        if (block.type === 'custom' || block.type === 'endBlock') {
                            block.incomeConnections.forEach(incomer => {
                                
                                let incomerBlock = blocks.find((block) => block.selfId === incomer);
                                if (incomerBlock) {
                                    blocksQueue.unshift(incomer);
                                    get_left(incomerBlock);
                                }
                            });
                        }
                    }
                    get_left(endBlock);
                    console.log(blocksQueue);
                }
            }
        }*/
        if (blocks.length === 0) return;

        const endBlock = blocks.find(block => block.type === 'endBlock');
        if (!endBlock || endBlock.incomeConnections.length === 0) return;

        let blocksQueue = [];
        function traverseBlocks(block) {
            console.log('type', block);
            if (block.type === 'custom' || block.type === 'endBlock' || block.type === 'conditionBlock') {
                block.incomeConnections.forEach(incomerId => {
                    const incomerBlock = blocks.find(({ selfId }) => selfId === incomerId);
                    if (incomerBlock) {
                        blocksQueue.unshift(incomerId);
                        traverseBlocks(incomerBlock);
                        let tmp = [];
                        blocksQueue.forEach((blockId) => {
                            if (!tmp.includes(blockId)) {
                                tmp.push(blockId)
                            }
                        })
                        blocksQueue = tmp;
                    }
                });
            }
        }

        traverseBlocks(endBlock);
        makeSpecification(blocksQueue);

    }, [blocks, isOpen]);


    const panelStyle = {
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
    };
    const close = () => {
        setIsOpen(false)
    }
    return (
        <div className="resultPanel-wrap" style={panelStyle}>
            <div className="resultPanel">
                <div className="resultPanel-content">
                    <header className="resultPanel-content-header">
                        <div className="resultPanel-close" onClick={close}>
                            <Close className="svg"></Close>
                        </div>
                        <div className="resultPanel-title">
                            Спецификация
                        </div>
                    </header>
                    <hr></hr>
                    <div className="resultPanel-content-specification">
                        {/* <textarea
                            value={specificationContent}
                            readOnly
                            className="specification"
                        /> */}
                        <CodeContainer language="json" children={specificationContent} />
                        <div className="resultPanel-content-buttons">
                            <button className="resultPanel-content-copy">Скопировать</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultPanel;
