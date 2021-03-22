import React, { useContext, useEffect, useRef } from 'react';
import clsx from 'clsx';

import Dots from '../dots';

import { Row, Column, Coordinate, ContainerStore } from '../common/type';
import { number2px, windowToWrapper, getWrapperIdBy } from '../utils';
import ctx from '../common/context';
import { WrapperProps } from './wrapper.types';
import { dotsList, prefix } from './constant';
import { getReverseBy, resolveMouseEffect } from './utils';
import { replaceBy } from '../utils/schema';

const WidgetWrapper = ({ id, children }: React.PropsWithChildren<WrapperProps>) => {
    const { store, setStore } = useContext(ctx);
    const widgetRef = useRef<HTMLDivElement>(null);
    const storeRef = useRef<ContainerStore>(null);
    const locationRef = useRef<Coordinate>(null);
    const { schema } = store;
    const { config } = schema[id];

    const isSelected = id && store.activityId === id;
    const { width, height, x = 0, y = 0, canDrag } = config;

    useEffect(() => {
        storeRef.current = store;
    }, [store]);

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

    const handleWidgetClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();

        const target = event.target as HTMLDivElement;
        const rect = target.getBoundingClientRect();
        const deltaX = event.clientX - rect.x;
        const deltaY = event.clientY - rect.y;
        locationRef.current = {
            x: schema[id].config.x,
            y: schema[id].config.y,
        };

        const widgetEle = widgetRef.current;
        widgetEle.classList.add(`${prefix}--fixed`);
        const wrapperId = getWrapperIdBy(schema, schema[id]);

        setStore({
            ...store,
            activityId: id,
            dragInfo: {
                dragId: id,
                activeId: wrapperId,
                deltaX,
                deltaY,
            },
            schema: {
                ...schema,
                [id]: {
                    ...schema[id],
                    config: {
                        ...schema[id].config,
                        x: rect.x,
                        y: rect.y,
                    },
                },
            },
        });

        const handleWidgetMove = (event: MouseEvent) => {
            event.preventDefault();
            const wrapperId = getWrapperIdBy(storeRef.current.schema, schema[id]);

            const wrapEle = document.querySelector(`#E${wrapperId}`);
            if (!wrapEle) {
                return;
            }
            const { x, y } = wrapEle.getBoundingClientRect();
            const location = {
                x: event.clientX - deltaX,
                y: event.clientY - deltaY,
            };
            locationRef.current = {
                x: event.clientX - deltaX - x,
                y: event.clientY - deltaY - y,
            };
            console.log('locationRef', wrapEle, event.clientX - deltaX, event.clientY - deltaY);
            const ele = document.querySelector(`#E${id}`) as HTMLDivElement;
            Object.assign(ele.style, {
                left: location.x + 'px',
                top: location.y + 'px',
            });
        };

        const handleWidgetUp = () => {
            const location = locationRef.current;
            const widgetEle = widgetRef.current;
            widgetEle.classList.remove(`${prefix}--fixed`);
            const { schema, dragInfo } = storeRef.current;
            const { dragId, activeId } = dragInfo;
            let realSchema = schema;
            console.log(wrapperId, activeId);
            if (wrapperId !== activeId) {
                realSchema = replaceBy(schema, dragId, activeId);
            }
            setStore({
                ...storeRef.current,
                dragInfo: {},
                schema: {
                    ...realSchema,
                    [id]: {
                        ...realSchema[id],
                        config: {
                            ...realSchema[id].config,
                            x: location.x,
                            y: location.y,
                        },
                    },
                },
            });

            document.removeEventListener('mousemove', handleWidgetMove);
            document.removeEventListener('mouseup', handleWidgetUp);
        };
        document.addEventListener('mousemove', handleWidgetMove);
        document.addEventListener('mouseup', handleWidgetUp);
    };

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
            ref={widgetRef}
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

export default WidgetWrapper;
