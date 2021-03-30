import React, { useContext, useEffect, useRef } from 'react';
import clsx from 'clsx';

import Dots from '../dots';

import { Row, Column, Position, ContainerStore } from '../common/type';
import { number2px, windowToWrapper, getWrapperIdBy } from '../utils';
import ctx from '../common/context';
import { WrapperProps } from './wrapper.types';
import { dotsList, prefix } from './constant';
import { getReverseBy, resolveMouseEffect, getValidByRange } from './utils';
import { replaceBy } from '../utils/schema';

const WidgetWrapper = ({ id, children }: React.PropsWithChildren<WrapperProps>) => {
    const { store, setStore } = useContext(ctx);
    const widgetRef = useRef<HTMLDivElement>(null);
    const storeRef = useRef<ContainerStore>(null);
    const { schema } = store;
    const { config } = schema[id];

    const isSelected = id && store.activityId === id;
    const { width, height, x = 0, y = 0, canDrag } = config;

    useEffect(() => {
        storeRef.current = store;
    }, [store]);

    const handleDotsMouseDown = (e: React.MouseEvent<HTMLDivElement>, row: Row, col: Column) => {
        e.preventDefault();
        e.stopPropagation();

        const t1 = windowToWrapper(document.body, e.clientX, e.clientY);
        const [m, n] = getReverseBy(config, row, col);

        const handleMove = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

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

    const handleWidgetClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();

        const target = e.target as HTMLDivElement;
        const rect = target.getBoundingClientRect();
        const deltaX = e.clientX - rect.x;
        const deltaY = e.clientY - rect.y;

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

        const handleWidgetMove = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const location = {
                x: e.clientX - deltaX,
                y: e.clientY - deltaY,
            };
            const ele = document.querySelector(`#E${id}`) as HTMLDivElement;
            Object.assign(ele.style, {
                left: location.x + 'px',
                top: location.y + 'px',
            });
        };

        const handleWidgetUp = (e: MouseEvent) => {
            const widgetEle = widgetRef.current;
            widgetEle.classList.remove(`${prefix}--fixed`);
            const { schema, dragInfo } = storeRef.current;
            const { dragId, activeId } = dragInfo;
            let realSchema = schema;

            if (wrapperId !== activeId) {
                realSchema = replaceBy(schema, dragId, activeId);
            }
            const wrapEle = document.querySelector(`#E${activeId}`);
            const { x, y, width, height } = wrapEle.getBoundingClientRect();
            if (!wrapEle) {
                return;
            }
            const realLocation = {
                x: getValidByRange(
                    e.clientX - deltaX - x,
                    -config.width / 2,
                    width - (config.width as number) / 2,
                ),
                y: getValidByRange(
                    e.clientY - deltaY - y,
                    -config.height / 2,
                    height - config.height / 2,
                ),
            };
            setStore({
                ...storeRef.current,
                dragInfo: {},
                schema: {
                    ...realSchema,
                    [id]: {
                        ...realSchema[id],
                        config: {
                            ...realSchema[id].config,
                            x: realLocation.x,
                            y: realLocation.y,
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
                onMouseDown={canDrag ? handleWidgetClick : null}
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
