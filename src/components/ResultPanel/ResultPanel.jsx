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



    const fillServiceSample = ({ id, serviceID, entry_pointID }) => ({
        ...(id && { id }),
        ...(serviceID && { serviceID }),
        ...(entry_pointID && { entry_pointID }),
    });

    const fillBlock = ({ id, type, specification, inputs, outputs, transition, code }) => ({
        ...(id && { id }),
        ...(type && { type_of_block: type }),
        ...(specification && Object.keys(specification).length && { specification }),
        ...(inputs && inputs.length && { inputs }),
        ...(outputs && outputs.length && { outputs }),
        ...(transition && Object.keys(transition).length && { transition }),
        ...(code && Object.keys(code).length && { code }),
    });

    const makeSpecification = (queue) => {
        const parameterBlock = getSingleParameterBlock();

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
                    inputs: block.incomeConnections
                });
                specification_json.blocks.push(blockSpec);
            } else if (block.type === 'codeBlock') {
                const blockSpec = fillBlock({
                    id: block.selfId,
                    type: block.type,
                    inputs: block.incomeConnections,
                    outputs: block.outcomeConnections,
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
                    inputs: block.incomeConnections,
                    outputs: block.outcomeConnections,
                    transition,
                });
                specification_json.blocks.push(blockSpec);
            }
        });

        specification_json.blocks.push(
            fillBlock({
                id: Math.max(...queue.map(Number)) + 1,
                type: 'parameters_block',
                outputs: parameterBlock,
            })
        );

        setSpecificationContent(JSON.stringify(specification_json, null, 2));
    };

    useEffect(() => {
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
                    <hr />
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
