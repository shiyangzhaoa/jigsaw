import { Manifest, ContainerStore, Config, Schema, SchemeMap } from '../common/type';

export const isNumber = (val: any): val is number => typeof val === 'number';

export const isDefine = (val: any) => val !== undefined && val !== null;

export const lastBy = <T>(arr: T[]) => arr[arr.length - 1];

export const number2px = (val?: number | string): string | undefined => {
    if (!isDefine(val)) {
        return undefined;
    }

    return typeof val === 'number' ? `${val}px` : val;
};

let uuidOffset = 0;
export const uuid = (): string => {
    uuidOffset++;
    return (Date.now() + uuidOffset).toString(16).substr(3);
};

export const findConfigById = (store: ContainerStore, name: string) => {
    if (!store?.configs?.length) {
        throw new Error('please check config');
    }

    const config = store.configs.find((config) => config.name === name);

    if (!config) {
        throw new Error('please check widget');
    }

    return config;
};

export const createCpnSchema = (store: ContainerStore, manifest: Manifest): Schema => {
    const { name } = manifest;
    const config = findConfigById(store, name);

    return {
        manifest,
        config,
        props: config.props,
        id: uuid(),
        childrenId: [],
    };
};

export const updateSchemaBy = (schema: SchemeMap, id: string, info: Partial<Schema>) => {
    return {
        ...schema,
        [id]: {
            ...schema[id],
            ...info,
        },
    };
};

export const minYby = (configs: Config[]) => {
    let minY = 0;

    for (let i = 0; i < configs.length; i++) {
        const config = configs[i].config;

        if (minY < config.y + config.height) {
            minY = config.y + config.height;
        }
    }

    return minY;
};

export const windowToWrapper = (ele: HTMLElement, x: number, y: number) => {
    const box = ele.getBoundingClientRect();

    return {
        x: x - box.left,
        y: y - box.top,
    };
};

export const getWrapperIdBy = (schema: SchemeMap, item: Schema) => {
    let id = schema[item.id].parent;
    while (!schema[id].config.canAddAsChild) {
        id = schema[id].parent;
    }

    return id;
};
