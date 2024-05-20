import React, { useState, useEffect, useMemo } from 'react';
import './ResultPanel.css';
import { useBlocks, useParameterBlocksData } from '../../stores/store';
import ResultPanelStatus from '../../stores/storeResult';
import { ReactComponent as Close } from './close.svg';
import CodeContainer from '../CodeContainer';

const ResultPanel = () => {
    const blocks = useBlocks((state) => state.blocks);
    const parameterBlocks = useParameterBlocksData((state) => state.blocks);
    const { isOpen, setIsOpen } = ResultPanelStatus();
    const [specificationContent, setSpecificationContent] = useState('');

    const copyToClipBoard = () => {
        navigator.clipboard.writeText(specificationContent);
    };

    const getSingleParameterBlock = () => {
        let connectedParameterBlocks = [];

        blocks.forEach(element => {
            const matchingBlocks = parameterBlocks.filter(block =>
                element.incomeConnections.includes(block.selfId)
            );

            connectedParameterBlocks.push(...matchingBlocks);
        });

        connectedParameterBlocks = [...new Set(connectedParameterBlocks)];
        return connectedParameterBlocks.map(block => block.data || []);
    };

    const getSingleResultBlock = (queue) => {
        let connectedBlocks = [];

        blocks.forEach(element => {
            if (element.type === 'resultBlock') {
                connectedBlocks.push(element.data.output_parameters);
            }
        });

        // connectedBlocks = [...new Set(connectedBlocks)];
        // connectedBlocks = connectedBlocks.map(block => block.data || []);
        // connectedBlocks = connectedBlocks.output_parameters;

        connectedBlocks = Object.values(connectedBlocks[0]);
        return connectedBlocks;
    };

    const fillServiceSample = ({ id, serviceID, entry_pointID }) => ({
        ...(id && { id }),
        ...(serviceID && { serviceID }),
        ...(entry_pointID && { entry_pointID }),
    });

    const fillBlock = ({ id, type, specification, inputs, outputs, transition, code, outputIfTrue, outputIfFalse, condition }) => ({
        ...(id && { id }),
        ...(type && { type_of_block: type }),
        ...(specification && Object.keys(specification).length && { specification }),
        ...(inputs && inputs.length && { inputs }),
        ...(outputs && outputs.length && { outputs }),
        ...(condition && condition.length && { condition }),
        ...(outputIfTrue && Object.keys(outputIfTrue).length && { outputIfTrue }),
        ...(outputIfFalse && Object.keys(outputIfFalse).length && { outputIfFalse }),
        ...(transition && Object.keys(transition).length && { transition }),
        ...(code && Object.keys(code).length && { code }),
    });

    const makeSpecification = (queue) => {
        const singleParameterBlock = getSingleParameterBlock();
        const singleResultBlock = getSingleResultBlock(queue);

        const specification_json = {
            service_data: [],
            blocks: [],
            result: []
        };

        queue.forEach(blockId => {
            let block = blocks.find((block) => block.selfId === blockId);

            if (!block) return;

            if (block.type === 'custom' && block.data?.parameters?.[0]) {
                const serviceSample = fillServiceSample({
                    id: block.data.function_id,
                    serviceID: block.data.parameters[0].service_id,
                    entry_pointID: block.data.parameters[0].uri_id,
                });
                specification_json.service_data.push(serviceSample);
            }

            const transition = block.type === 'conditionBlock'
                ? { "type": "condition", "blockID_if_true": block.data.true, "blockID_if_false": block.data.false }
                : { "type": "jump", "blockID": block.outcomeConnections };



            if (block.type === 'endBlock') {
                const blockSpec = fillBlock({
                    id: block.selfId,
                    type: block.type,
                });
                specification_json.blocks.push(blockSpec);
            } else if (block.type === 'codeBlock') {
                console.log(block.data.input_parameters);
                const blockSpec = fillBlock({
                    id: block.selfId,
                    type: block.type,
                    inputs: Object.values(block.data.input_parameters),
                    outputs: Object.values(block.data.output_parameters),
                    code: block.data.code,
                });
                specification_json.blocks.push(blockSpec);
            } else if (block.type === 'conditionBlock') {
                console.log(block.data.input_parameters);
                const blockSpec = fillBlock({
                    id: block.selfId,
                    type: block.type,
                    inputs: Object.values(block.data.parameters &&
                        block.data.parameters.inputs ?
                        block.data.parameters.inputs : {}),
                    condition: [
                        {
                            parameterA: block.data.parameters &&
                                block.data.parameters.inputs.parameterA ?
                                block.data.parameters.inputs.parameterA : {}
                        },
                        {
                            parameterB: block.data.parameters &&
                                block.data.parameters.inputs.parameterB ?
                                block.data.parameters.inputs.parameterB : {}
                        },
                        {
                            operator: block.data.parameters &&
                                block.data.parameters.condition.condition ?
                                block.data.parameters.condition.condition : ''
                        },
                    ],
                    outputs: [
                        {
                            condition: true, blockID: block.data.parameters &&
                                block.data.parameters.outputIfTrue ?
                                block.data.parameters.outputIfTrue : ''
                        },
                        {
                            condition: false, blockID: block.data.parameters &&
                                block.data.parameters.outputIfFalse ?
                                block.data.parameters.outputIfFalse : ''
                        },
                    ],
                    code: block.data.code,
                });
                specification_json.blocks.push(blockSpec);
            } else {
                const blockSpec = fillBlock({
                    id: block.selfId,
                    type: block.type,
                    specification: {
                        componentID: block.data.component_id,
                        functionID: block.data.function_id,
                    },
                    inputs: block.data.parameters &&
                        block.data.parameters.inputs ?
                        Object.values(block.data.parameters.inputs) : [],
                    outputs: block.data.output_parameters ? block.data.output_parameters : [],
                    transition,
                });
                specification_json.blocks.push(blockSpec);
            }
        });

        // console.log('F1', singleParameterBlock);
        specification_json.blocks.push(
            fillBlock({
                id: Math.max(...queue.map(Number)) + 1,
                type: 'parameters_block',
                outputs: singleParameterBlock,
            })
        );

        singleResultBlock.forEach(element => {
            specification_json.result.push(
                element
            );
        });
        // console.log('F2', singleResultBlock);
        

        setSpecificationContent(JSON.stringify(specification_json, null, 2));
    };

    useEffect(() => {
        // console.log(blocks);
        if (blocks.length === 0) return;

        const endBlock = blocks.find(block => block.type === 'endBlock');
        if (!endBlock || endBlock.incomeConnections.length === 0) return;

        const traverseBlocks = (block, queue = []) => {
            if (!block) return queue;
            queue.unshift(block.selfId);
            block.incomeConnections.forEach(incomerId => {
                const incomerBlock = blocks.find(({ selfId }) => selfId === incomerId);
                traverseBlocks(incomerBlock, queue);
            });
            return queue;
        };

        const blocksQueue = [...new Set(traverseBlocks(endBlock))];
        makeSpecification(blocksQueue);
    }, [blocks, isOpen]);

    const panelStyle = useMemo(() => ({
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
    }), [isOpen]);

    const close = () => {
        setIsOpen(false);
    };

    return (
        <div className="resultPanel-wrap" style={panelStyle}>
            <div className="resultPanel">
                <div className="resultPanel-content">
                    <header className="resultPanel-content-header">
                        <div className="resultPanel-close" onClick={close}>
                            <Close className="svg" />
                        </div>
                        <div className="resultPanel-title">Спецификация</div>
                    </header>
                    <div className="resultPanel-content-specification">
                        <CodeContainer language="json">{specificationContent}</CodeContainer>
                        <div className="resultPanel-content-buttons">
                            <button onClick={copyToClipBoard} className="resultPanel-content-copy">Скопировать</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultPanel;
