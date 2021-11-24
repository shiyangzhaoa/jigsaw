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

export type TreeData = TreeNode[];

export interface TreeProps {
    id?: string;
}

export type TreeNodeProps = TreeNode & {
    schema: Schema;
    activityId: string;
    onExpand: (id: string) => void;
    onClick: (id: string) => void;
    onNodeDragStart: (
        e: React.DragEvent<HTMLDivElement>,
        val: TreeNode,
        ref: HTMLDivElement,
    ) => void;
    onNodeDragEnter: (
        e: React.DragEvent<HTMLDivElement>,
        val: TreeNode,
        ref: HTMLDivElement,
    ) => void;
    onNodeDragOver: (
        e: React.DragEvent<HTMLDivElement>,
        val: TreeNode,
        ref: HTMLDivElement,
    ) => void;
};
