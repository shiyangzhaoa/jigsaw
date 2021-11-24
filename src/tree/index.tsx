import React, { useState, useEffect, useRef } from 'react';

import useSchema from '../hooks/use-schema';
import { Position } from '../common/type';
import { isDefine } from '../utils';
import { traverseDataNodes, addKey, delKey, getDropPosition } from './utils';
import { TreeData, TreeNode as TreeNodeProp } from './tree.types';
import TreeNode from './tree-node';

import './tree.scss';

const Tree = () => {
    const [store, , setStore] = useSchema();
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [treeData, setTreeData] = useState([]);
    const [dragOverNode, setDragOverNode] = useState<TreeNodeProp>(null);
    const [dropPosition, setDropPosition] = useState(null);
    const [offsetLeft, setOffsetLeft] = useState(0);
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

    const onWinNodeDragEnd = () => {
        setDragOverNode(null);
        cleanDragState();
    };

    const onWindowDragEnd = () => {
        onWinNodeDragEnd();
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
        setExpandedKeys(addKey(expandedKeys, id));

        window.addEventListener('dragend', onWindowDragEnd);
    };

    const onNodeDragEnter = (
        e: React.DragEvent<HTMLDivElement>,
        node: TreeNodeProp,
        ele: HTMLDivElement,
    ) => {
        if (timeRef.current) {
            clearTimeout(timeRef.current);
        }

        if (!dragNode.current) return;

        const { position, offsetLeft } = getDropPosition(
            e,
            e.target as HTMLDivElement,
            ele,
            dragStartPosition.current,
            node,
        );

        if (node.id === dragNode.current.id && position !== -1) {
            setDragOverNode(null);
            setDropPosition(null);

            return;
        }

        setOffsetLeft(offsetLeft);
        setDragOverNode(node);
        if (isDefine(node.expanded) && !node.expanded) {
            timeRef.current = setTimeout(() => {
                setExpandedKeys(delKey(expandedKeys, node.id));
            }, 400);
        }
    };

    const onNodeDragOver = (
        e: React.DragEvent<HTMLDivElement>,
        node: TreeNodeProp,
        ele: HTMLDivElement,
    ) => {
        if (node.id === dragNode.current.id) {
            setDragOverNode(null);
            setDropPosition(null);

            return;
        }

        if (dragNode.current) {
            const { position, offsetLeft: offset } = getDropPosition(
                e,
                e.target as HTMLDivElement,
                ele,
                dragStartPosition.current,
                node,
            );
            if (position === dropPosition && offset === offsetLeft) return;

            setDropPosition(position);
            setOffsetLeft(offset);
            setDragOverNode(node);
            console.log(node, position, offset);
        }
    };

    const onNodeDragEnd = () => {
        setDragOverNode(null);
        cleanDragState();
        dragNode.current = null;
    };

    const onNodeDrop = (e: React.DragEvent<HTMLDivElement>, node: TreeNodeProp) => {
        setDragOverNode(null);
        cleanDragState();
        // const { id } = node;

        // console.log('id', id, dragNode.current, dragOverNode);

        dragNode.current = null;
    };

    // console.log('dragOverNode', dragOverNode);

    return (
        <div data-testid="tree" className="jigsaw-tree">
            {treeData.map((data) => (
                <TreeNode
                    schema={schema[data.id]}
                    {...data}
                    key={data.id}
                    offsetLeft={offsetLeft}
                    dropPosition={dropPosition}
                    activityId={activityId}
                    dragOverNode={dragOverNode}
                    onExpand={onExpand}
                    onClick={onClick}
                    onNodeDragStart={onNodeDragStart}
                    onNodeDragEnter={onNodeDragEnter}
                    onNodeDragOver={onNodeDragOver}
                    onNodeDragEnd={onNodeDragEnd}
                    onNodeDrop={onNodeDrop}
                />
            ))}
        </div>
    );
};

export default Tree;
