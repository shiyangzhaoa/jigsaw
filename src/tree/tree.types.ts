import { Schema } from '../common/type';

export interface TreeNode {
    id: string;
    validKey?: string[];
    depth: number;
    expanded?: boolean;
    parent?: TreeNode;
    isLeaf?: boolean;
    isStart: boolean[];
    isEnd: boolean[];
}

// export interface FlattenNode {
//     id: string;
//     key?: string;
//     depth: number;
//     expanded?: boolean;
//     parent?: FlattenNode;
//     isStart?: boolean[];
//     isEnd?: boolean[];
// }

export type TreeData = TreeNode[];

export interface TreeProps {
    id?: string;
}

export type TreeNodeProps = TreeNode & {
    schema: Schema;
    activityId: string;
    onExpand: (id: string) => void;
    onClick: (id: string) => void;
};
