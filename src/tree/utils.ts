import { SchemaMap } from '../common/type';
import { rootId } from '../common/constant';
import { arrDel } from '../utils';
import { TreeData, TreeNode } from './tree.types';

export const traverseDataNodes = (schema: SchemaMap) => {
    const result: TreeData = [];
    const rootItem = {
        id: rootId,
        depth: 0,
        expanded: true,
        isEnd: [true],
        isStart: [true],
        validKey: [],
    };

    function processor(item: TreeNode = rootItem) {
        const cur = schema[item.id];
        const expandable = cur.children.length !== 0;
        const realItem = { ...item, expanded: expandable ? true : undefined, isLeaf: !expandable };
        result.push(realItem);

        if (cur.children.length !== 0) {
            const parent = realItem;
            cur.children.forEach((child, index, arr) => {
                processor({
                    id: child,
                    validKey: [...parent.validKey, item.id],
                    depth: item.depth + 1,
                    parent: realItem,
                    isStart: [...(parent ? parent.isStart : []), index === 0],
                    isEnd: [...(parent ? parent.isEnd : []), index === arr.length - 1],
                });
            });
        }
    }

    processor();

    return result;
};

export const onNodeExpand = (keys: string[], treeNode: TreeNode) => {
    const { expanded, id } = treeNode;
    const targetExpanded = !expanded;

    return targetExpanded ? arrDel(keys, id) : arrDel(keys, id);
};

export const addKey = (arr: string[], key) => {
    if (arr.includes(key)) {
        return arr;
    }

    return [...arr, key];
};

export const delKey = (arr: string[], key) => {
    const newArr = [...arr];
    const index = newArr.indexOf(key);
    if (!!~index) {
        newArr.splice(index, 1);
    }

    return newArr;
};

export const getDropPosition = (
    e: React.DragEvent<HTMLDivElement>,
    dragNode: TreeNode,
    targetNode: TreeNode,
) => {
    // const target = e.target as HTMLDivElement;
    // const targetRect = target.getBoundingClientRect();
    // const dragNodeRect = dragNodeEle.current.getBoundingClientRect();
    // const dragMoveLeft = dragNodeRect.left + (e.clientX - dragStartPosition.current.x);

    // if (dragMoveLeft - targetRect.left > 25 && node.id !== dragNode.current.id) {
    //     // console.log(node, dragNode.current);
    //     console.log('chi');
    // }
};
