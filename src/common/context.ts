import React from 'react';

import { ContainerContext, DragInfo } from './type';
import componentMap from '../components';
import App from '../components/App';

const { config, manifest } = App;

const configs = Object.entries(componentMap).map(([_, { config }]) => config);

export const defaultContext = {
    store: {
        configs,
        activityId: 'App',
        schema: {
            App: {
                id: 'App',
                props: {},
                childrenId: [],
                config,
                manifest,
            },
        },
        dragInfo: {} as DragInfo,
    },
};

const ctx = React.createContext<ContainerContext>(defaultContext);

export default ctx;
