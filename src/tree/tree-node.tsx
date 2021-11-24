import React, { useRef, useState } from 'react';
import clsx from 'clsx';

import { prefix } from './constant';
import { TreeNodeProps } from './tree.types';

import StatusIcon from '../../assets/icons/switch-open.svg';
import Widget from '../../assets/icons/tree-widget.svg';

const TreeNode = ({
    schema,
    activityId,
    onExpand,
    onClick,
    onNodeDragStart,
    onNodeDragEnter,
    onNodeDragOver,
    ...node
}: TreeNodeProps) => {
    const [dragNodeHighlight, setDragNodeHighlight] = useState(false);
    const nodeRef = useRef<HTMLDivElement>(null);
    const { id, depth, isStart, isEnd, expanded, isLeaf } = node;
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

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        setDragNodeHighlight(true);

        onNodeDragStart(e, node, nodeRef.current);
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();

        onNodeDragEnter(e, node, nodeRef.current);
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        setDragNodeHighlight(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        onNodeDragOver(e, node, nodeRef.current);
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
                <span className={clsx(`${prefix}-switcher`, `${prefix}-switcher-noop`)}>
                    <Widget />
                </span>
            );
        }

        return (
            <span className={`${prefix}-switcher`} onClick={handleExpand}>
                <StatusIcon
                    className={expanded ? `${prefix}-switcher-open` : `${prefix}-switcher-close`}
                />
            </span>
        );
    };

    return (
        <div
            className={`${prefix}-treenode`}
            onDragEnter={handleDragEnter}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
        >
            <span aria-hidden="true" className={`${prefix}-indent`}>
                {list}
            </span>
            {renderSwitcher()}
            <span
                className={clsx(`${prefix}-wrapper`, {
                    [`${prefix}-wrapper--selected`]: id === activityId || dragNodeHighlight,
                })}
                ref={nodeRef}
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
