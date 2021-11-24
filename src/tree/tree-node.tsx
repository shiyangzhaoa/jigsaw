import React, { useRef, useState } from 'react';
import clsx from 'clsx';

import { prefix } from './constant';
import { TreeNodeProps } from './tree.types';

import StatusIcon from '../../assets/icons/switch-open.svg';
import Widget from '../../assets/icons/tree-widget.svg';

const TreeNode = ({
    schema,
    activityId,
    dropPosition,
    offsetLeft,
    dragOverNode,
    onExpand,
    onClick,
    onNodeDragStart,
    onNodeDragEnter,
    onNodeDragOver,
    onNodeDragEnd,
    onNodeDrop,
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
        onNodeDragEnd(e, node, nodeRef.current);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        onNodeDragOver(e, node, nodeRef.current);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        setDragNodeHighlight(false);
        onNodeDrop(e, node, nodeRef.current);
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

    const renderIndicator = () => {
        const style: React.CSSProperties = {};

        const showIndicator = !disabled && dragOverNode?.id === id;

        if (!showIndicator) return null;

        switch (dropPosition) {
            case -1:
                style.top = 0;
                style.left = offsetLeft * 25;
                break;
            case 1:
                style.bottom = 0;
                style.left = offsetLeft * 25;
                break;
            case 0:
                style.bottom = 0;
                style.left = offsetLeft * 25;
                break;
        }

        return <div className={`${prefix}-indicator`} style={style}></div>;
    };

    return (
        <div
            className={`${prefix}-treenode`}
            onDragEnter={handleDragEnter}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
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
                <span className={`${prefix}-name`}>{config.name}</span>
                {renderIndicator()}
            </span>
        </div>
    );
};

export default TreeNode;
