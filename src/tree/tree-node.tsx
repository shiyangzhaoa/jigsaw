import React, { useState } from 'react';
import clsx from 'clsx';

import { prefix } from './constant';
import { TreeNodeProps } from './tree.types';

import closeIcon from '../../assets/icons/switch-close.svg';
import openIcon from '../../assets/icons/switch-open.svg';
import widget from '../../assets/icons/tree-widget.svg';

const TreeNode = ({ activityId, onExpand, onClick, ...item }: TreeNodeProps) => {
    const [dragNodeHighlight, setDragNodeHighlight] = useState(false);
    const { id, depth, isStart, isEnd, schema, expanded, isLeaf } = item;
    const list: React.ReactElement[] = [];
    const { config } = schema;
    const baseClassName = `${prefix}-indent-unit`;

    const disabled = id === 'App';

    const handleExpand = () => {
        onExpand(id);
    };

    const handleNodeClick = () => {
        onClick(id);
    };

    const handleDragStart = () => {
        setDragNodeHighlight(true);
    };

    const handleDragEnter = () => {
        // TODO: todo
    };

    const handleDragEnd = () => {
        setDragNodeHighlight(false);
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
        <div
            className={`${prefix}-treenode`}
            onDragEnter={disabled ? undefined : handleDragEnter}
            onDragEnd={disabled ? undefined : handleDragEnd}
        >
            <span aria-hidden="true" className={`${prefix}-indent`}>
                {list}
            </span>
            {renderSwitcher()}
            <span
                className={clsx(`${prefix}-wrapper`, {
                    [`${prefix}-wrapper--selected`]: id === activityId || dragNodeHighlight,
                })}
                onClick={handleNodeClick}
                onDragStart={disabled ? undefined : handleDragStart}
                draggable={!disabled}
            >
                {config.name}
            </span>
        </div>
    );
};

export default TreeNode;
