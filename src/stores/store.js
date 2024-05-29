import { create } from 'zustand';

export const useBlocks = create(set => ({
    blocks: [],
    loading: false,
    error: null,

    addBlock: (id, type, incomers, outcomers, data) => set(state => {
        const newblock = {
            selfId: id,
            type: type,
            incomeConnections: incomers,
            outcomeConnections: outcomers,
            data: data,
        };

        return { blocks: [...state.blocks, newblock] };
    }),
    deleteBlock: (id) => set(state => ({
        blocks: state.blocks.filter(block => block.selfId !== id)
    })),
    updateBlock: (id, newData) => set((state) => {
        const updatedBlocks = state.blocks.map((block) => {
            if (block.selfId === id) {
                return { ...block, data: newData };
            }
            return block;
        });

        return { blocks: updatedBlocks };
    }),


    updateBlockIncomers: (id, newIncomerId) => set((state) => {
        const updatedBlocks = state.blocks.map((block) => {
            if (block.selfId === id) {
                const updatedIncomeConnections = [...block.incomeConnections];
                if (!updatedIncomeConnections.includes(newIncomerId)) {
                    updatedIncomeConnections.push(newIncomerId);
                }
                return { ...block, incomeConnections: updatedIncomeConnections };
            }
            return block;
        });

        return { blocks: updatedBlocks };
    }),


    deleteBlockIncomer: (id, incomerToRemoveId) => set((state) => {
        const updatedBlocks = state.blocks.map((block) => {
            if (block.selfId === id) {
                const updatedIncomeConnections = block.incomeConnections.filter((incomerId) => incomerId !== incomerToRemoveId);
                return { ...block, incomeConnections: updatedIncomeConnections };
            }
            return block;
        });

        return { blocks: updatedBlocks };
    }),


    updateBlockOutcomers: (id, newOutcomerId) => set((state) => {
        const updatedBlocks = state.blocks.map((block) => {
            if (block.selfId === id) {
                const updatedOutcomeConnections = [...block.outcomeConnections];
                if (!updatedOutcomeConnections.includes(newOutcomerId)) {
                    updatedOutcomeConnections.push(newOutcomerId);
                }
                return { ...block, outcomeConnections: updatedOutcomeConnections };
            }
            return block;
        });

        return { blocks: updatedBlocks };
    }),



    deleteBlockOutcomer: (id, outcomerToRemoveId) => set((state) => {
        const updatedBlocks = state.blocks.map((block) => {
            if (block.selfId === id) {
                const updatedOutcomeConnections = block.outcomeConnections.filter((outcomerId) => outcomerId !== outcomerToRemoveId);
                return { ...block, outcomeConnections: updatedOutcomeConnections };
            }
            return block;
        });

        return { blocks: updatedBlocks };
    }),

    checkIfBlockExists: (attribute, value) => set(state => {
        return state.blocks.some(block => block[attribute] === value);
    }),    
}));

export const useParameterBlocksData = create(set => ({
    blocks: [],
    loading: false,
    error: null,
    add: (id, type, label, data) => set(state => {
        const newblock = {
            selfId: id,
            type: type,
            label: label,
            data: data,
        };

        return { blocks: [...state.blocks, newblock] };
    }),
    update: (id, newData) => set((state) => {
        const updatedBlocks = state.blocks.map((block) => {
            if (block.selfId === id) {
                return { ...block, data: newData };
            }
            return block;
        });

        return { blocks: updatedBlocks };
    }),
    updateLabel: (id, newLabel) => set(state => {
        const updatedBlocks = state.blocks.map(block => {
            if (block.selfId === id) {
                return { ...block, label: newLabel };
            }
            return block;
        });

        return { blocks: updatedBlocks };
    }),
}));

export const useDataTypes = create(set => ({
    types: [],
    loading: false,
    error: null,
    loadTypes: async () => {
        set({ loading: true, error: null });

        try {
            const response = await fetch(`http://localhost:${process.env.SERVER_PORT}/database/data_types`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            set({ types: data, loading: false });
        } catch (error) {
            console.error('Error fetching data:', error);
            set({ error: error.message, loading: false });
        }
    },
    getTypes: () => set(state => {
        return { types: state.types };
    }),
}));
