import React, { useState } from 'react';

import { ContainerStore } from '../common/type';
import Context from '../common/context';
import { containerProps } from './container.types';

import './container.scss';

const container: React.FC<containerProps> = ({ foo }) => {
    const [store, setStore] = useState<ContainerStore>(null);
    const value = {
        store,
        setStore,
    };

    return (
        <Context.Provider value={value}>
            <div data-testid="container" className="foo-bar">
                {foo}
            </div>
        </Context.Provider>
    );
};

export default container;
