import { useContext } from 'react';

import ctx from '../common/context';
import { addFloorBy } from '../utils/schema';

type ActionType = 'ADD';

interface Direction {
    direction: 'TOP' | 'BOTTOM';
}

export enum ActionEnum {
    ADD = 'ADD',
}

const useFloor = () => {
    const { store, setStore } = useContext(ctx);

    function dispatch(type: ActionType, payload: Direction) {
        const newStore = addFloorBy(store, payload.direction);

        setStore(newStore);
    }

    return [store, dispatch];
};

export default useFloor;
