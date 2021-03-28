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

// export const flattenTreeData = (treeData: TreeData): FlattenNode[] => {
//     const flattenList: FlattenNode[] = [];

//     function dig(list: TreeData, parent: FlattenNode = null) {
//         let last = null;
//         list.forEach((treeNode) => {
//             const flattenNode: FlattenNode = {
//                 ...treeNode,
//                 parent,
//                 isStart: [...(last ? last.isStart : []), treeNode.parent.isStart || true],
//                 isEnd: [...(last ? last.isEnd : []), treeNode.parent.isEnd || false],
//             };

//             flattenList.push(flattenNode);
//             last = flattenNode;

//             return flattenList;
//         });
//     }

//     dig(treeData);

//     return flattenList;
// };

export const onNodeExpand = (keys: string[], treeNode: TreeNode) => {
    const { expanded, id } = treeNode;
    const targetExpanded = !expanded;

    return targetExpanded ? arrDel(keys, id) : arrDel(keys, id);
};
