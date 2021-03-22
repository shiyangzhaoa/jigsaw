import { Schema, SchemeMap, ContainerStore, Manifest } from '../common/type';
import { DirectionEnum } from '../common/constant';
import floorManifest from '../floor/manifest';
import { uuid, minYby, lastBy, createCpnSchema } from '.';

export const clone = (schema: Schema) => ({ ...schema, id: uuid() });

export const cloneDeepBy = (schema: SchemeMap, id: string): [SchemeMap, string] => {
    function cloneDeep(schema: SchemeMap, id: string): Schema[] {
        const target = schema[id];
        const newSchema = clone(target);

        if (target.childrenId?.length === 0) {
            return [newSchema];
        }

        const childrenList = target.childrenId.map((id) => cloneDeep(schema, id));
        childrenList.forEach((item) => {
            item[0].parent = newSchema.id;
        });
        newSchema.childrenId = childrenList.map((item) => item[0].id);

        return [newSchema, ...[].concat(...childrenList)];
    }

    const result = {};
    const schemaList = cloneDeep(schema, id);
    const rootId = schemaList[0].id;
    const l = schemaList.length;
    for (let i = 0; i < l; i++) {
        const t = schemaList[i];
        result[t.id] = t;
    }

    return [{ ...schema, ...result }, rootId];
};

// TODO: 实现有问题
export const deleteBy = (schema: SchemeMap, id: string): SchemeMap => {
    const parent = schema[schema[id].parent];
    const brother = parent?.childrenId;
    const cloneSchema = { ...schema };

    (function deepDelete(id: string) {
        const cur = cloneSchema[id];

        if (cur.childrenId.length !== 0) {
            cur.childrenId.forEach((id) => {
                deepDelete(id);
            });
        } else {
            delete cloneSchema[id];
        }
    })(id);

    return {
        ...cloneSchema,
        [parent.id]: {
            ...parent,
            childrenId: brother?.filter((chId) => chId === id),
        },
    };
};

export const addBy = (schema: SchemeMap, id: string, payload: Schema): SchemeMap => {
    if (!schema) {
        return {
            [payload.id]: {
                ...payload,
            },
        };
    }

    let container = schema[id] || schema['App'];

    while (!container.config.canAddAsChild) {
        container = schema[container.parent];
    }
    const childrenList = container.childrenId.map((id) => schema[id]);
    const minY = minYby(childrenList);

    const newSchema = {
        ...payload,
        parent: container.id,
        config: {
            ...payload.config,
            x: 0,
            y: minY,
        },
    };

    const containerConfig = container.config;

    const realHeight =
        containerConfig.height > minY + payload.config.height
            ? containerConfig.height
            : minY + payload.config.height;
    return {
        ...schema,
        [newSchema.id]: newSchema,
        [container.id]: {
            ...container,
            childrenId: [...container.childrenId, payload.id],
            config: {
                ...containerConfig,
                height: realHeight,
            },
        },
    };
};

// TODO: 实现有问题
export const replaceBy = (schema: SchemeMap, from: string, to: string): SchemeMap => {
    const parent = schema[schema[from].parent];
    const brother = parent?.childrenId;
    const cloneSchema = { ...schema };

    const realSchema = addBy(schema, to, cloneSchema[from]);

    delete realSchema[from];

    return {
        ...realSchema,
        [parent.id]: {
            ...parent,
            childrenId: brother?.filter((chId) => chId === from),
        },
    };
};

export const initBy = (store: ContainerStore, manifests: Manifest[]) => {
    const schemaList = manifests.map((manifest) => createCpnSchema(store, manifest));

    const { schema } = store;

    const result = schemaList.reduce((acc, cur) => {
        return addBy(acc, cur.id, cur);
    }, schema);

    return [result, lastBy(schemaList).id] as const;
};

export const findFloorBy = (schema: SchemeMap, id: string) => {
    let floor = schema[id];

    while (floor.manifest.name !== 'Floor') {
        floor = schema[floor.parent];
    }

    if (!floor) {
        throw new Error(`can't find floor`);
    }

    return floor;
};

export const addFloorBy = (store: ContainerStore, direction: 'TOP' | 'BOTTOM'): ContainerStore => {
    const { schema, activityId } = store;

    const newFloor = createCpnSchema(store, floorManifest);
    const floor = findFloorBy(schema, activityId);
    const container = schema[floor.parent];
    newFloor.parent = container.id;

    const floorIds = [...container.childrenId];
    const curIndex = floorIds.indexOf(floor.id);

    if (direction === DirectionEnum.TOP) {
        floorIds.splice(curIndex, 0, newFloor.id);
    } else {
        floorIds.splice(curIndex + 1, 0, newFloor.id);
    }

    return {
        ...store,
        activityId: newFloor.id,
        schema: {
            ...schema,
            [container.id]: {
                ...container,
                childrenId: floorIds,
            },
            [newFloor.id]: newFloor,
        },
    };
};
