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

export type Config<T = any> = Record<string, any> & Partial<BaseConfig> & { props?: T };

export interface DragInfo {
    dragId: string;
    hoverId: string;
    activeId: string;
    deltaX: number;
    deltaY: number;
}

export interface Schema {
    id: string;
    props: Record<string, any>;
    parent?: string;
    children: string[];
    config: Config;
    manifest: Manifest;
}

export type SchemaMap = Record<string, Schema>;

export interface ContainerStore {
    activityId?: string;
    configs: Record<string, any>[];
    schema: SchemaMap;
    dragInfo: Partial<DragInfo>;
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

export interface Action<T, M> {
    type: T;
    payload: M;
}
