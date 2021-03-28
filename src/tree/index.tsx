import React, { useState, useEffect, useRef } from 'react';

import useSchema from '../hooks/use-schema';
import { traverseDataNodes } from './utils';
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
        dataRef.current = data.map((item) => ({
            ...item,
            expanded: !expandedKeys.includes(item.id),
        }));

        setTreeData(
            dataRef.current.filter(
                (item) => !expandedKeys.some((key) => item.validKey.includes(key)),
            ),
        );
    }, [schema, expandedKeys]);

    const onExpand = ({ id }) => {
        if (expandedKeys.includes(id)) {
            const realKeys = expandedKeys.filter((item) => item !== id);
            setExpandedKeys(realKeys);
        } else {
            const realKeys = [...expandedKeys, id];
            setExpandedKeys(realKeys);
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
