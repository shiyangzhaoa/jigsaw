export type Row = 'left' | 'center' | 'right';
export type Column = 'top' | 'center' | 'bottom';

export interface BaseConfig {
    width: number | string;
    height: number;
    x: number;
    y: number;
    canDrag: boolean;
    canAddAsChild: boolean;
}

export type Config = Record<string, any> & Partial<BaseConfig>;

export interface Schema {
    id: string;
    props: Record<string, any>;
    parent?: string;
    childrenId: string[];
    config: Config;
    manifest: Manifest;
}

export interface ContainerStore {
    activityId?: string;
    configs: Record<string, any>[];
    schema: Record<string, Schema>;
}

export interface ContainerContext {
    store: ContainerStore;
    setStore?: (val: ContainerStore) => void;
}

export interface Manifest {
    name: string;
    version: string;
    icon?: string;
    preview?: string;
}

export interface Coordinate {
    x: number;
    y: number;
}
