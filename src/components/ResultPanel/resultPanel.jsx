import React, { useState, useEffect, useMemo } from 'react';
import '../../css/resultPanel.css';
import { useBlocks, useParameterBlocksData } from '../../stores/store';
import ResultPanelStatus from '../../stores/storeResult';
import { ReactComponent as Close } from '../../images/ResultPanel/close.svg';
import CodeContainer from '../AdditionalComponents/codeContainer';

const ResultPanel = () => {
    const blocks = useBlocks(state => state.blocks);
    const parameterBlocks = useParameterBlocksData(state => state.blocks);
    const { isOpen, setIsOpen } = ResultPanelStatus();
    const [specificationContent, setSpecificationContent] = useState('');

    const copyToClipBoard = () => {
        navigator.clipboard.writeText(specificationContent);
    };

    const getConnectedParameterBlocks = () => {
        const connectedParameterBlocks = blocks.flatMap(element =>
            parameterBlocks.filter(block => element.incomeConnections.includes(block.selfId))
        );

        return [...new Set(connectedParameterBlocks)].map(block => block.data || []);
    };

    const getConnectedResultBlocks = () => {
        const resultBlocks = blocks
            .filter(block => block.type === 'resultBlock')
            .map(block => block.data.output_parameters);

        return resultBlocks.length > 0 ? Object.values(resultBlocks[0]) : [];
    };

    const fillService = ({ id, serviceID, entry_pointID }) => ({
        ...(id && { id }),
        ...(serviceID && { serviceID }),
        ...(entry_pointID && { entry_pointID }),
    });

    const fillBlock = blockData => {
        const {
            id, type, specification, inputs, outputs,
            transition, code, outputIfTrue, outputIfFalse, condition
        } = blockData;

        return {
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
        };
    };

    const makeSpecification = queue => {

        const specificationJson = {
            service_data: [],
            blocks: [],
            result: []
        };

        if (!queue.length || queue.length === 0) {
            console.log('Empty specification');
            setSpecificationContent(JSON.stringify(specificationJson, null, 2));
            return;
        };

        const singleParameterBlock = getConnectedParameterBlocks();
        const singleResultBlock = getConnectedResultBlocks();

        queue.forEach(blockId => {
            const block = blocks.find(block => block.selfId === blockId);
            if (!block) return;

            const { type, data, outcomeConnections, selfId } = block;
            const commonFields = { id: selfId, type };

            if (type === 'functionBlock' && data?.parameters) {
                specificationJson.service_data.push(fillService({
                    id: data.function_id,
                    serviceID: data.parameters.service_id,
                    entry_pointID: data.parameters.uri_id,
                }));
            }

            const transition = type === 'conditionBlock' ?
                { type: 'condition', blockID_if_true: data.true, blockID_if_false: data.false } :
                { type: 'jump', blockID: outcomeConnections };

            let blockSpec;
            if (type === 'endBlock') {
                blockSpec = fillBlock({ ...commonFields });
            } else if (type === 'codeBlock') {
                blockSpec = fillBlock({
                    ...commonFields,
                    inputs: data.input_parameters ? Object.values(data.input_parameters) : [],
                    outputs: Object.values(data.output_parameters),
                    code: data.code,
                });
            } else if (type === 'conditionBlock') {
                blockSpec = fillBlock({
                    ...commonFields,
                    inputs: Object.values(data.parameters?.inputs || {}),
                    condition: [
                        { parameterA: data.parameters?.inputs?.parameterA || {} },
                        { parameterB: data.parameters?.inputs?.parameterB || {} },
                        { operator: data.parameters?.condition?.condition || '' }
                    ],
                    outputs: [
                        { condition: true, blockID: data.parameters?.outputIfTrue || '' },
                        { condition: false, blockID: data.parameters?.outputIfFalse || '' }
                    ],
                    code: data.code,
                });
            } else {
                blockSpec = fillBlock({
                    ...commonFields,
                    specification: {
                        componentID: data.component_id,
                        functionID: data.function_id,
                    },
                    inputs: Object.entries(data.parameters?.inputs || {}),
                    outputs: data.output_parameters || [],
                    transition,
                });
            }
            specificationJson.blocks.push(blockSpec);
        });

        specificationJson.blocks.push(
            fillBlock({
                id: Math.max(...queue.map(Number)) + 1,
                type: 'parameters_block',
                outputs: singleParameterBlock,
            })
        );

        if (singleResultBlock) {
            specificationJson.result.push(...singleResultBlock);
        }

        setSpecificationContent(JSON.stringify(specificationJson, null, 2));
    };

    useEffect(() => {
        if (blocks.length === 0) return;

        const endBlock = blocks.find(block => block.type === 'endBlock');
        if (!endBlock || endBlock.incomeConnections.length === 0) {
            makeSpecification([]);
            return;
        };

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
    }, [isOpen]);

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
                            <div onClick={copyToClipBoard} className="resultPanel-content-copy">Скопировать</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultPanel;
