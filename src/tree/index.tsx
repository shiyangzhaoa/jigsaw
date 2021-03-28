import React, { useState, useEffect, useRef } from 'react';

import useSchema from '../hooks/use-schema';
import { traverseDataNodes, onNodeExpand } from './utils';
import { TreeData } from './tree.types';
import TreeNode from './tree-node';

import './tree.scss';

const Tree = () => {
    const [store, , setStore] = useSchema();
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [treeData, setTreeData] = useState([]);
    const dataRef = useRef<TreeData>([]);
    const { schema, activityId } = store;

    useEffect(() => {
        const data = traverseDataNodes(schema);
        dataRef.current = data;
        setTreeData(data);
    }, [schema]);

    const onExpand = ({ expanded, id }) => {
        if (expandedKeys.includes(id)) {
            const realKeys = expandedKeys.filter((item) => item !== id);
            setExpandedKeys(realKeys);
            dataRef.current = dataRef.current.map((item) =>
                item.id === id ? { ...item, expanded: !expanded } : item,
            );
            setTreeData(
                dataRef.current.filter(
                    (item) => !realKeys.some((key) => item.validKey.includes(key)),
                ),
            );
        } else {
            const realKeys = [...expandedKeys, id];
            setExpandedKeys(realKeys);
            dataRef.current = dataRef.current.map((item) =>
                item.id === id ? { ...item, expanded: !item.expanded } : item,
            );

            setTreeData(
                dataRef.current.filter(
                    (item) => !realKeys.some((key) => item.validKey.includes(key)),
                ),
            );
        }
    };

    const onClick = (id: string) => {
        setStore({ ...store, activityId: id });
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
                />
            ))}
        </div>
    );
};

export default Tree;
