import { useContext } from 'react';

import { cloneDeepBy, deleteBy, addBy, initBy } from '../utils/schema';
import { Schema, Manifest } from '../common/type';
import ctx from '../common/context';

type ActionType = 'INIT' | 'ADD' | 'DELETE' | 'REPLACE' | 'CLONE';

interface Replace {
    from: string;
    to: string;
    data: Schema;
}

export enum ActionEnum {
    INIT = 'INIT',
    ADD = 'ADD',
    DELETE = 'DELETE',
    REPLACE = 'REPLACE',
    CLONE = 'CLONE',
}

const isScheme = (val: Schema | Replace | Manifest[]): val is Schema =>
    (val as Schema).config !== undefined;
const isReplace = (val: Schema | Replace | Manifest[]): val is Replace => !!(val as Replace).from;
const isManifest = (val: Schema | Replace | Manifest[]): val is Manifest[] =>
    !!(val as Manifest[]).length;

const useSchema = () => {
    const { store, setStore } = useContext(ctx);
    const { activityId, schema } = store;

    function dispatch(type: 'ADD' | 'DELETE' | 'CLONE', payload: Schema);
    function dispatch(type: 'REPLACE', payload: Replace);
    function dispatch(type: 'INIT', payload: Manifest[]);
    function dispatch(type: ActionType, payload: Schema | Replace | Manifest[]) {
        if (type === ActionEnum.ADD && isScheme(payload)) {
            const newSchema = addBy(schema, activityId, payload);

            setStore({
                ...store,
                activityId: payload.id,
                schema: newSchema,
            });

            return;
        }

        if (type === ActionEnum.DELETE && isScheme(payload)) {
            const { id } = payload;
            const newSchema = deleteBy(schema, id);

            setStore({
                ...store,
                activityId: payload.parent,
                schema: newSchema,
            });

            return;
        }

        if (type === ActionEnum.CLONE && isScheme(payload)) {
            const [newSchema, rootId] = cloneDeepBy(schema, activityId);

            if (!schema[activityId].parent) {
                throw new Error(`can't clone`);
            }

            setStore({
                ...store,
                activityId: rootId,
                schema: newSchema,
            });

            return;
        }

        if (type === ActionEnum.REPLACE && isReplace(payload)) {
            const { from, to, data } = payload;

            const newSchema = addBy(deleteBy(schema, from), to, data);

            setStore({
                ...store,
                activityId: data.id,
                schema: newSchema,
            });

            return;
        }

        if (type === ActionEnum.INIT && isManifest(payload)) {
            const [newSchema, lastId] = initBy(store, payload);

            setStore({
                ...store,
                activityId: lastId,
                schema: newSchema,
            });

            return;
        }
    }

    return [store, dispatch] as const;
};

export default useSchema;
