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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        const { children, id, manifest, props } = scheme;
        const component = componentMap[manifest.name];

        const getChildren =
            children.length !== 0 ? children.map((id) => renderWrapper(store.schema[id])) : null;

        return (
            <Wrapper key={id} id={id}>
                {createElement(component.view, props, getChildren)}
            </Wrapper>
        );
    };

    return (
        <div>
            <Context.Provider value={value}>
                <div onClick={handleFloorAdd}>添加楼层</div>
                <Widget manifest={{ name: 'Button', version: '1.0.0' }}>
                    <div>Button</div>
                </Widget>
                <Widget manifest={{ name: 'Card', version: '1.0.0' }}>
                    <div>Card</div>
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
