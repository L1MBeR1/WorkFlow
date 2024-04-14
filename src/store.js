import {create} from 'zustand';

export const useBlocks = create(set => ({
    blocks: [],
    loading: false,
    error: null,
    addBlock: (id, incomers, outcomers, data) => set(state => {
        const newblock = {
            selfId: id,
            incomeConnections: incomers,
            outcomeConnections: outcomers,
            data: data,
        };

        return {blocks: [...state.blocks, newblock]};
    }),
    updateBlock: (id, newData) => set((state) => {
        const updatedBlocks = state.blocks.map((block) => {
            if (block.selfId === id) {
                return { ...block, data: newData };
            }
            return block;
        });

        return { blocks: updatedBlocks };
    }),
}))
