// import React from "react";
import React, { useState, useEffect, memo, useRef } from 'react';
import './ResultPanel.css';
import { useBlocks } from '../../stores/store';
import ResultPanelStatus from '../../stores/storeResult';
import { ReactComponent as Close } from './close.svg';
import CodeContainer from '../CodeContainer';



const ResultPanel = () => {
    const blocks = useBlocks((state) => state.blocks);
    const { isOpen, setIsOpen } = ResultPanelStatus();
    const [specificationContent, setSpecificationContent] = useState();

    const convertJSONtoString = (json) => {

    };

    const makeSpecification = (queue) => {
        let specification_json = {
            service_data: [],
            blocks: [],
            result: []
        };

        function fillBlock({ id = null, type = null, specification = {}, inputs = [], outputs = [], transition = {} }) {
            let block_json = {
                id: id,
                type_of_block: type,
                specification: specification,
                inputs: inputs,
                outputs: outputs,
                transition: transition
            }
            return block_json;
        }


        queue.forEach(blockId => {
            let block = blocks.find((block) => block.selfId === blockId);
            block = fillBlock({
                id: block.data.function_id,
                type: block.type,
                inputs: block.incomeConnections,
                outputs: block.outcomeConnections,
            });
            specification_json.blocks.push(block);
        });

        setSpecificationContent(JSON.stringify(specification_json, null, 2));
    };

    useEffect(() => {
        console.log('Open');
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
            if (block.type === 'custom' || block.type === 'endBlock') {
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
        // console.log(blocksQueue);
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
