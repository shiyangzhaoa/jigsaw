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
    const { width, height, x = 0, y = 0 } = config;

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>, row: Row, col: Column) => {
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

    const handleClick = () => {
        setStore({
            ...store,
            activityId: id,
        });
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
            >
                <div
                    className={clsx(`${prefix}__control`, {
                        [`${prefix}__floor--selected`]: isSelected,
                    })}
                    onClick={handleClick}
                >
                    {isSelected && (
                        <Dots
                            row="center"
                            column="bottom"
                            onMouseDown={(evt) => handleMouseDown(evt, 'center', 'bottom')}
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
        >
            <div
                className={clsx(`${prefix}__control`, { [`${prefix}--selected`]: isSelected })}
                onClick={handleClick}
            >
                {isSelected &&
                    dotsList.map(([row, col], index) => (
                        <Dots
                            key={index}
                            row={row}
                            column={col}
                            onMouseDown={(evt) => handleMouseDown(evt, row, col)}
                        />
                    ))}
            </div>
            {children}
        </div>
    );
};

export default Wrapper;
