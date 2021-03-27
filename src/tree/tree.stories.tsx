import React, { useState, useEffect } from 'react';

import Widget from '../widget';
import Tree from '.';
import { ContainerStore } from '../common/type';
import Context, { defaultContext } from '../common/context';

const manifest = {
    name: 'test',
    cname: '测试',
    version: '0.0.1',
    icon: '',
    preview: '',
};

const TreeCpn = () => {
    const [store, setStore] = useState<ContainerStore>(defaultContext.store);
    useEffect(() => {
        const config = {
            name: 'test',
            width: 100,
            height: 100,
        };

        setStore({
            ...store,
            configs: [...store.configs, config],
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const value = {
        store,
        setStore,
    };

    return (
        <div>
            <Context.Provider value={value}>
                <Widget manifest={manifest}>
                    <div>添加</div>
                </Widget>
                <Tree />
            </Context.Provider>
        </div>
    );
};

export default {
    title: 'Tree',
};

export const TreeDemo = () => <TreeCpn />;
