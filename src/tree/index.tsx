import React from 'react';

import useSchema from '../hooks/use-schema';
import { traverseDataNodes, onNodeExpand } from './utils';
import TreeNode from './tree-node';

import { treeDataDemo } from './demo';

import './tree.scss';

const Tree = () => {
    const [store] = useSchema();
    const { schema } = store;
    const treeData = traverseDataNodes(treeDataDemo);
    console.log('treeData', treeData);

    return (
        <div data-testid="tree" className="jigsaw-tree">
            {treeData.map((data) => (
                <TreeNode schema={treeDataDemo[data.id]} {...data} key={data.id} />
            ))}
        </div>
    );
};

export default Tree;
