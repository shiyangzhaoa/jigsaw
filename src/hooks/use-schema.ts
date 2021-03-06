import { useContext } from 'react';

import {
    addBy,
    initBy,
    deleteBy,
    replaceBy,
    cloneDeepBy,
    getRootChildren,
    findLastActivityId,
} from '../utils/schema';
import { Schema, Manifest } from '../common/type';
import ctx from '../common/context';

type ActionType = 'INIT' | 'ADD' | 'DELETE' | 'REPLACE' | 'CLONE' | 'UPDATE';

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
    UPDATE = 'UPDATE',
}

const isScheme = (val: Schema | Replace | Manifest[]): val is Schema =>
    (val as Schema).config !== undefined;
const isReplace = (val: Schema | Replace | Manifest[]): val is Replace => !!(val as Replace).from;
const isManifest = (val: Schema | Replace | Manifest[]): val is Manifest[] =>
    !!(val as Manifest[]).length;

const useSchema = () => {
    const { store, setStore } = useContext(ctx);
    const { activityId, schema } = store;

    function dispatch(type: 'ADD' | 'DELETE' | 'CLONE' | 'UPDATE', payload: Schema);
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
            const lastActivityId = findLastActivityId(schema, payload);
            const newSchema = deleteBy(schema, id);

            const rootChildren = getRootChildren(newSchema);
            if (rootChildren.length === 0) return;

            setStore({
                ...store,
                activityId: lastActivityId,
                schema: newSchema,
            });

            return;
        }

        if (type === ActionEnum.UPDATE && isScheme(payload)) {
            const { id } = payload;
            const newSchema = {
                ...schema,
                [id]: payload,
            };

            setStore({
                ...store,
                activityId: payload.id,
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

            const newSchema = replaceBy(schema, from, to);

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

    return [store, dispatch, setStore] as const;
};

export default useSchema;
