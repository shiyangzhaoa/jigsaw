import React, { useState, useEffect, createElement } from 'react';
import Wrapper from '.';
import Widget from '../widget';
import { initBy, addFloorBy } from '../utils/schema';
import { ContainerStore, Schema } from '../common/type';
import Context, { defaultContext } from '../common/context';
import componentMap from '../components';

const Container = () => {
    const [store, setStore] = useState<ContainerStore>(defaultContext.store);
    useEffect(() => {
        const manifestList = ['Floor'].map((name) => componentMap[name].manifest);
        const [newSchema, lastId] = initBy(store, manifestList);

        setStore({
            ...store,
            activityId: lastId,
            schema: newSchema,
        });
    }, []);

    const value = {
        store,
        setStore,
    };

    const handleFloorAdd = () => {
        const newStore = addFloorBy(store, 'BOTTOM');

        setStore(newStore);
    };

    const renderWrapper = (scheme: Schema) => {
        const { childrenId, id, config, manifest, props } = scheme;
        const component = componentMap[manifest.name];

        const getChildren = () => (
            <>
                {childrenId.length !== 0
                    ? childrenId.map((id) => renderWrapper(store.schema[id]))
                    : null}
            </>
        );

        return (
            <Wrapper key={id} id={id} config={config}>
                {createElement(component.view, props, getChildren())}
            </Wrapper>
        );
    };

    return (
        <div>
            <Context.Provider value={value}>
                <div onClick={handleFloorAdd}>添加楼层</div>
                <Widget manifest={{ name: 'Button', version: '0.0.1' }}>
                    <div>Button</div>
                </Widget>
                <div style={{ marginLeft: 100, position: 'relative', width: 375 }}>
                    {renderWrapper(store.schema.App)}
                </div>
            </Context.Provider>
        </div>
    );
};

export default {
    title: 'Wrapper',
};

export const WithContainer = () => <Container />;
