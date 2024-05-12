/**
 * Должен был содержать все блоки и связи, 
 * но не используется в данной версии.
 * 
 * 
 * 
 */


import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import produce from 'immer';
import { connect } from 'react-redux';

// Структура данных для хранения блоков и связей
const useBlockManager = create((set) => ({
    blocks: {}, // Словарь для хранения информации о блоках
    connections: {}, // Массив для хранения соединений между блоками

    // Методы менеджера блоков

    /**
     * Создание нового блока.
     *
     * @param {string} type - Тип блока.
     * @param {Object} parameters - Параметры блока.
     * @return {Object} Обновлённое состояние.
     */
    createBlock: (id, type, parameters) => {
        // Создайте новый блок со следующим доступным идентификатором блока.
        // Новый блок имеет указанный тип и параметры.
        // Массивы ввода и выводы инициализируются, чтобы быть пустыми.
        // const newBlockId = id;
        set((state) => {
            // const newBlockId = uuidv4().replaceAll("-", "");
            
            const newBlock = {
                id: id,             // Идентификатор нового блока.
                type,               // Тип нового блока.
                parameters,         // Параметры нового блока.
                inputNodes: [],     // Входные узлы нового блока.
                outputNodes: [],    // Выходные узлы нового блока.
            };

            return {
                blocks: { ...state.blocks, [id]: newBlock },
            };
        });
        set((state) => {
            return {
                connections: { ...state.connections, [id]: {
                    "incoming": [],
                    "outcoming": []
                } },
            };
        });
    },


    // Удаление блока по идентификатору
    deleteBlock: (blockId) => {
        set((state) => {
            const updatedBlocks = { ...state.blocks };
            delete updatedBlocks[blockId];
            return { blocks: updatedBlocks };
        });
        set((state) => {
            const updatedConnections = { ...state.connections };
            delete updatedConnections[blockId];
            return { connections: updatedConnections };
        });
    },

    // Добавление соединения между блоками
    connectBlocks: (blockId, connectionType, connectingBlockId) => {
        set(produce((state) => {
            // Проверяем, существует ли блок с заданным blockId
            if (!state.connections[blockId]) {
                state.connections[blockId] = { [connectionType]: [connectingBlockId] };
            } else {
                // Проверяем, существует ли связь данного типа у блока
                if (!state.connections[blockId][connectionType]) {
                    state.connections[blockId][connectionType] = [connectingBlockId];
                } else {
                    // Добавляем связь
                    state.connections[blockId][connectionType].push(connectingBlockId);
                }
            }
        }));
    },


    // Удаление соединения между блоками
    disconnectBlocks: (inputBlockId, outputBlockId) => {
        set(produce((state) => {
            if (state.connections[outputBlockId] && state.connections[outputBlockId].incoming) {
                state.connections[outputBlockId].incoming = state.connections[outputBlockId].incoming.filter(
                    (outConn) => outConn !== inputBlockId
                );
            }
            if (state.connections[inputBlockId] && state.connections[inputBlockId].outcoming) {
                state.connections[inputBlockId].outcoming = state.connections[inputBlockId].outcoming.filter(
                    (inConn) => inConn !== outputBlockId
                );
            }
        }));
    },
    
    

    // Изменение параметров блока по идентификатору
    updateBlockParameters: (blockId, newParameters) => {
        set((state) => ({
            blocks: {
                ...state.blocks,
                [blockId]: {
                    ...state.blocks[blockId],
                    parameters: newParameters,
                },
            },
        }));
    },

    updateParameterBlockData: (blockId, newParameters) => {
        set((state) => ({
            blocks: {
                ...state.blocks,
                [blockId]: {
                    ...state.blocks[blockId],
                    parameters: {
                        ...state.blocks[blockId].parameters,
                        parameters: newParameters
                    },
                },
            },
        }));
    },

    // updateBlockConnectedData: (blockId, connectedData) => {
    //     set((state) => ({
    //         blocks: {
    //             ...state.blocks,
    //             [blockId]: {
    //                 ...state.blocks[blockId],
    //                 parameters: {
    //                     ...state.blocks[blockId].parameters,
    //                     data: {
    //                         ...state.blocks[blockId].parameters.data,
    //                         connectedData
    //                     }
    //                 }
    //             },
    //         },
    //     }));
    // }
    setBlockConnectedData: (blockId, connectedData) => {
        set((state) => ({
            blocks: {
                ...state.blocks,
                [blockId]: {
                    ...state.blocks[blockId],
                    parameters: {
                        ...state.blocks[blockId].parameters,
                        data: {
                            ...state.blocks[blockId].parameters.data,
                            connectedData: connectedData
                        }
                    }
                },
            },
        }));
    }

}));

export default useBlockManager;