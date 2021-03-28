import React from 'react';
import clsx from 'clsx';

import closeIcon from '../../assets/icons/switch-close.svg';
import openIcon from '../../assets/icons/switch-open.svg';
import widget from '../../assets/icons/tree-widget.svg';
import { prefix } from './constant';
import { TreeNodeProps } from './tree.types';

const TreeNode = ({ activityId, onExpand, onClick, ...item }: TreeNodeProps) => {
    const { id, depth, isStart, isEnd, schema, expanded, isLeaf } = item;
    const list: React.ReactElement[] = [];
    const { config } = schema;
    const baseClassName = `${prefix}-indent-unit`;

    const handleExpand = () => {
        onExpand({ expanded, id });
    };

    const handleNodeClick = () => {
        onClick(id);
    };

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

    const renderSwitcher = () => {
        if (isLeaf) {
            return (
                <img
                    className={clsx(`${prefix}-switcher`, `${prefix}-switcher-noop`)}
                    src={widget}
                    alt=""
                />
            );
        }

        return (
            <img
                className={`${prefix}-switcher`}
                src={expanded ? openIcon : closeIcon}
                alt=""
                onClick={handleExpand}
            />
        );
    };

    return (
        <div className={`${prefix}-treenode`}>
            <span aria-hidden="true" className={`${prefix}-indent`}>
                {list}
            </span>
            {renderSwitcher()}
            <span
                className={clsx(`${prefix}-wrapper`, {
                    [`${prefix}-wrapper--selected`]: id === activityId,
                })}
                onClick={handleNodeClick}
                draggable
            >
                {config.name}
            </span>
        </div>
    );
};

export default TreeNode;
