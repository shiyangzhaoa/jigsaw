import React from 'react';

import useSchema from '../hooks/use-schema';
import { getRoot } from '../utils/schema';

import './tree.scss';

const Tree = () => {
    const [store] = useSchema();
    const { schema } = store;
    const rootId = getRoot(schema);

    return (
        <div data-testid="tree" className="jigsaw-tree">
            {rootId}
        </div>
    );
};

export default Tree;
