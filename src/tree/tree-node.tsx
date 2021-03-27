import React from 'react';
import clsx from 'clsx';

import closeIcon from '../../assets/icons/switch-close.svg';
import openIcon from '../../assets/icons/switch-close.svg';
import { prefix } from './constant';
import { TreeNodeProps } from './tree.types';

const TreeNode = ({ id, depth, isStart, isEnd, schema, expanded }: TreeNodeProps) => {
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
        <div className={`${prefix}-treenode`}>
            <span aria-hidden="true" className={`${prefix}-indent`}>
                {list}
            </span>
            <img className={`${prefix}-switcher`} src={expanded ? openIcon : closeIcon} alt="" />
            <span className={`${prefix}-wrapper`}>{config.name}</span>
        </div>
    );
};

export default TreeNode;
