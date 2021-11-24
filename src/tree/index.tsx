import React, { useState, useEffect, useRef } from 'react';

import useSchema from '../hooks/use-schema';
import { Position } from '../common/type';
import { isDefine } from '../utils';
import { traverseDataNodes, addKey, delKey } from './utils';
import { TreeData, TreeNode as TreeNodeProp } from './tree.types';
import TreeNode from './tree-node';

import './tree.scss';

const Tree = () => {
    const [store, , setStore] = useSchema();
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [treeData, setTreeData] = useState([]);
    const [draging, setDragging] = useState(false);
    const [dragOverNode, setDragOverNode] = useState<TreeData>(null);
    const dataRef = useRef<TreeData>([]);
    const dragStartPosition = useRef<Position>(null);
    const dragNode = useRef<TreeNodeProp>(null);
    const dragNodeEle = useRef<HTMLDivElement>(null);
    const timeRef = useRef(null);
    const { schema, activityId } = store;

    useEffect(() => {
        const data = traverseDataNodes(schema);
        dataRef.current = data.map((item) => ({
            ...item,
            expanded: isDefine(item.expanded) ? !expandedKeys.includes(item.id) : undefined,
        }));

        setTreeData(
            dataRef.current.filter(
                (item) => !expandedKeys.some((key) => item.validKey.includes(key)),
            ),
        );
    }, [schema, expandedKeys]);

    const cleanDragState = () => {
        //
    };

    const onExpand = (id) => {
        if (expandedKeys.includes(id)) {
            setExpandedKeys(delKey(expandedKeys, id));
        } else {
            setExpandedKeys(addKey(expandedKeys, id));
        }
    };

    const onClick = (id: string) => {
        setStore({ ...store, activityId: id });
    };

    const onNodeDragEnd = () => {
        setDragOverNode(null);
        cleanDragState();
    };

    const onWindowDragEnd = () => {
        onNodeDragEnd();
        window.removeEventListener('dragend', onWindowDragEnd);
    };

    const onNodeDragStart = (
        e: React.DragEvent<HTMLDivElement>,
        node: TreeNodeProp,
        ele: HTMLDivElement,
    ) => {
        const { id } = node;
        dragStartPosition.current = {
            x: e.clientX,
            y: e.clientY,
        };
        dragNode.current = node;
        dragNodeEle.current = ele;
        setDragging(true);
        setExpandedKeys(addKey(expandedKeys, id));

        window.addEventListener('dragend', onWindowDragEnd);
    };

    const onNodeDragEnter = (e: React.DragEvent<HTMLDivElement>, node: TreeNodeProp) => {
        if (timeRef.current) {
            clearTimeout(timeRef.current);
        }

        if (dragNode.current && node.id === dragNode.current.id) return;

        console.log(node);
        if (isDefine(node.expanded) && !node.expanded) {
            timeRef.current = setTimeout(() => {
                setExpandedKeys(delKey(expandedKeys, node.id));
            }, 400);
        }
    };

    const onNodeDragOver = (e: React.DragEvent<HTMLDivElement>, node: TreeNodeProp) => {
        if (dragNode.current && node.id === dragNode.current.id) return;
        console.log(123);
    };

    return (
        <div data-testid="tree" className="jigsaw-tree">
            {treeData.map((data) => (
                <TreeNode
                    schema={schema[data.id]}
                    {...data}
                    key={data.id}
                    activityId={activityId}
                    onExpand={onExpand}
                    onClick={onClick}
                    onNodeDragStart={onNodeDragStart}
                    onNodeDragEnter={onNodeDragEnter}
                    onNodeDragOver={onNodeDragOver}
                />
            ))}
        </div>
    );
};

export default Tree;
