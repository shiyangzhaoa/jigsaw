import { Schema, SchemaMap, ContainerStore, Manifest } from '../common/type';
import { DirectionEnum } from '../common/constant';
import floorManifest from '../floor/manifest';
import { uuid, minYby, lastBy, createCpnSchema } from '.';

export const clone = (schema: Schema) => ({ ...schema, id: uuid() });

export const getRootChildren = (schema: SchemaMap) => {
    return schema['App'].children;
};

export const cloneDeepBy = (schema: SchemaMap, id: string): [SchemaMap, string] => {
    function cloneDeep(schema: SchemaMap, id: string): Schema[] {
        const target = schema[id];
        const newSchema = clone(target);

        if (target.children?.length === 0) {
            return [newSchema];
        }

        const childrenList = target.children.map((id) => cloneDeep(schema, id));
        childrenList.forEach((item) => {
            item[0].parent = newSchema.id;
        });
        newSchema.children = childrenList.map((item) => item[0].id);

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

export const deleteBy = (schema: SchemaMap, id: string): SchemaMap => {
    const parent = schema[schema[id].parent];
    const brother = parent?.children;
    const cloneSchema = { ...schema };

    (function deepDelete(id: string) {
        const cur = cloneSchema[id];

        if (cur.children.length !== 0) {
            cur.children.forEach((id) => {
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
            children: brother?.filter((chId) => chId !== id),
        },
    };
};

export const addBy = (schema: SchemaMap, id: string, payload: Schema): SchemaMap => {
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
    const childrenList = container.children.map((id) => schema[id]);
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
            children: [...container.children, payload.id],
            config: {
                ...containerConfig,
                height: realHeight,
            },
        },
    };
};

export const replaceBy = (schema: SchemaMap, from: string, to: string): SchemaMap => {
    const parent = schema[schema[from].parent];
    const children = parent?.children;
    const cloneSchema = { ...schema };

    const payload = { ...cloneSchema[from] };
    delete cloneSchema[from];
    const realSchema = addBy(schema, to, payload);

    return {
        ...realSchema,
        [parent.id]: {
            ...parent,
            children: children?.filter((chId) => chId !== from),
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

export const findFloorBy = (schema: SchemaMap, id: string) => {
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

    const floorIds = [...container.children];
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
                children: floorIds,
            },
            [newFloor.id]: newFloor,
        },
    };
};

export const findLastActivityId = (schema: SchemaMap, payload: Schema) => {
    const children = schema[payload.parent].children;

    if (children.length <= 1) {
        return payload.parent;
    }

    const index = children.indexOf(payload.id);

    if (index === -1) {
        return payload.parent;
    }

    if (index === 0) {
        return children[index + 1];
    }

    return children[index - 1];
};
