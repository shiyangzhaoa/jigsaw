import React from 'react';
import { render } from '@testing-library/react';

import Tree from '.';
import { TreeProps } from './tree.types';

describe('Test Component', () => {
    let props: TreeProps;

    beforeEach(() => {
        props = {
            foo: 'bar',
        };
    });

    const renderComponent = () => render(<Tree {...props} />);

    it('should render foo text correctly', () => {
        props.foo = 'harvey was here';
        const { getByTestId } = renderComponent();

        const component = getByTestId('tree');

        expect(component).toHaveTextContent('harvey was here');
    });
});
