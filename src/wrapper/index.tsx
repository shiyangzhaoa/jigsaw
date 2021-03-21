import React, { useContext } from 'react';
import clsx from 'clsx';

import Dots from '../dots';

import { Row, Column, Coordinate } from '../common/type';
import { number2px, windowToWrapper } from '../utils';
import ctx from '../common/context';
import { WrapperProps } from './wrapper.types';
import { dotsList } from './constant';
import { getReverseBy, resolveMouseEffect } from './utils';

import './wrapper.scss';

const prefix = 'jigsaw-wrapper';

const Wrapper = ({ id, children }: React.PropsWithChildren<WrapperProps>) => {
    const { store, setStore } = useContext(ctx);
    const { schema } = store;
    const { config, manifest } = schema[id];
    const { name } = manifest;

    const isSelected = id && store.activityId === id;
    const { width, height, x = 0, y = 0, canDrag } = config;

    const handleDotsMouseDown = (
        event: React.MouseEvent<HTMLDivElement>,
        row: Row,
        col: Column,
    ) => {
        event.preventDefault();
        event.stopPropagation();

        const t1 = windowToWrapper(document.body, event.clientX, event.clientY);
        const [m, n] = getReverseBy(config, row, col);

        const handleMove = (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();

            const t2 = windowToWrapper(document.body, event.clientX, event.clientY);
            const distance = {
                x: t2.x - t1.x,
                y: t2.y - t1.y,
            };

            let realLoc: Coordinate;

            if (row === 'center') {
                realLoc = {
                    x: m.x,
                    y: m.y + distance.y,
                };
            } else if (col === 'center') {
                realLoc = {
                    x: m.x + distance.x,
                    y: m.y,
                };
            } else {
                realLoc = {
                    x: m.x + distance.x,
                    y: m.y + distance.y,
                };
            }

            const [x, y, width, height] = resolveMouseEffect(n, realLoc);

            setStore({
                ...store,
                schema: {
                    ...schema,
                    [id]: {
                        ...schema[id],
                        config: {
                            ...schema[id].config,
                            x,
                            y,
                            width,
                            height,
                        },
                    },
                },
            });
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleWidgetClick = () => {
        setStore({
            ...store,
            activityId: id,
        });
    };

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        event.target.style.cursor = 'move';
        requestAnimationFrame(() => {
            event.dataTransfer.effectAllowed = 'copyMove';
            const ele = event.target as HTMLDivElement;
            ele.remove();
            document.body.appendChild(ele);
        });

        return true;
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const ele = event.target as HTMLDivElement;
        console.log('ele', ele);

        return true;
    };

    const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
        (event.target as any).style.display = 'block';

        return true;
    };

    if (name === 'App') {
        return <>{children}</>;
    }

    if (name === 'Floor') {
        return (
            <div
                style={{
                    height: number2px(height),
                }}
                className={`${prefix}__floor`}
                id={`E${id}`}
                onDragOver={handleDragOver}
            >
                <div
                    className={clsx(`${prefix}__control`, {
                        [`${prefix}__floor--selected`]: isSelected,
                    })}
                    onClick={handleWidgetClick}
                >
                    {isSelected && (
                        <Dots
                            row="center"
                            column="bottom"
                            onMouseDown={(evt) => handleDotsMouseDown(evt, 'center', 'bottom')}
                        />
                    )}
                </div>
                <div
                    style={{
                        height: number2px(height),
                    }}
                    className={`${prefix}__block`}
                >
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                width: number2px(width),
                height: number2px(height),
                left: number2px(x),
                top: number2px(y),
            }}
            className={prefix}
            id={`E${id}`}
            draggable={canDrag && isSelected}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div
                className={clsx(`${prefix}__control`, { [`${prefix}--selected`]: isSelected })}
                onMouseDown={handleWidgetClick}
            >
                {isSelected &&
                    dotsList.map(([row, col], index) => (
                        <Dots
                            key={index}
                            row={row}
                            column={col}
                            onMouseDown={(evt) => handleDotsMouseDown(evt, row, col)}
                        />
                    ))}
            </div>
            {children}
        </div>
    );
};

export default Wrapper;
