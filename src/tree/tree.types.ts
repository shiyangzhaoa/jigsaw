import { Schema } from '../common/type';

export interface TreeNode {
    id: string;
    key?: string;
    depth: number;
    expanded?: boolean;
    parent?: TreeNode;
    isStart: boolean;
    isEnd: boolean;
}

export interface FlattenNode {
    id: string;
    key?: string;
    depth: number;
    expanded?: boolean;
    parent?: FlattenNode;
    isStart?: boolean[];
    isEnd?: boolean[];
}

export type TreeData = TreeNode[];

export interface TreeProps {
    id?: string;
}

export type TreeNodeProps = TreeNode & { schema: Schema };
