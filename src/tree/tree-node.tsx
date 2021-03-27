import React from 'react';
import clsx from 'clsx';

import { prefix } from './constant';
import { TreeNodeProps } from './tree.types';

const TreeNode = ({ id, depth, isStart, isEnd, schema }: TreeNodeProps) => {
    const list: React.ReactElement[] = [];
    const { config } = schema;
    const baseClassName = `${prefix}-indent-unit`;

    for (let i = 0; i < depth; i++) {
        list.push(
            <span
                key={i}
                className={clsx(baseClassName, {
                    [`${baseClassName}-start`]: isStart[i],
                    [`${baseClassName}-end`]: isEnd[i],
                })}
            />,
        );
    }

    return (
        <div>
            <span aria-hidden="true" className={`${prefix}-indent`}>
                {list}
                <span>{config.name}</span>
            </span>
        </div>
    );
};

export default TreeNode;
