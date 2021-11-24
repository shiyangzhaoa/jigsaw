import React, { useContext } from 'react';
import clsx from 'clsx';

import Dots from '../dots';
import { Row, Column, Position } from '../common/type';
import { number2px, windowToWrapper } from '../utils';
import ctx from '../common/context';
import { WrapperProps } from './wrapper.types';
import { prefix } from './constant';
import { getReverseBy, resolveMouseEffect } from './utils';

const FloorWrapper = ({ id, children }: React.PropsWithChildren<WrapperProps>) => {
    const { store, setStore } = useContext(ctx);
    const { schema } = store;
    const { config } = schema[id];

    const isSelected = id && store.activityId === id;
    const { height } = config;

    // TODO: 和楼层的逻辑完全相同，后续抽成 hooks
    const handleDotsMouseDown = (e: React.MouseEvent<HTMLDivElement>, row: Row, col: Column) => {
        e.preventDefault();

        const t1 = windowToWrapper(document.body, e.clientX, e.clientY);
        const [m, n] = getReverseBy(config, row, col);

        const handleMove = (e: MouseEvent) => {
            const t2 = windowToWrapper(document.body, e.clientX, e.clientY);
            const distance = {
                x: t2.x - t1.x,
                y: t2.y - t1.y,
            };

            let realLoc: Position;

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

    const handleFloorClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        setStore({
            ...store,
            activityId: id,
        });
    };

    const handleMouseEnter = () => {
        const { dragId } = store.dragInfo;
        if (!dragId) return;

        console.log('dragId', id);

        setStore({
            ...store,
            dragInfo: {
                ...store.dragInfo,
                activeId: id,
            },
        });
    };

    return (
        <div
            style={{
                height: number2px(height),
            }}
            className={`${prefix}__floor`}
            onMouseEnter={handleMouseEnter}
            id={`E${id}`}
        >
            <div
                className={clsx(`${prefix}__control`, {
                    [`${prefix}__floor--selected`]: isSelected,
                })}
                onClick={handleFloorClick}
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
};

export default FloorWrapper;
