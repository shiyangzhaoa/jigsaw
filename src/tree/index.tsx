import React from 'react';

import { TreeProps } from './tree.types';

import './tree.scss';

const Tree = ({ foo }: TreeProps) => (
    <div data-testid="tree" className="foo-bar">
        {foo}
    </div>
);

export default Tree;
