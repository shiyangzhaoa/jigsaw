// Generated with script/create-component.js
import React from 'react';
import { render } from '@testing-library/react';

import Container from '.';
import { containerProps } from './container.types';

describe('Test Component', () => {
    let props: containerProps;

    beforeEach(() => {
        props = {
            foo: 'bar',
        };
    });

    const renderComponent = () => render(<Container {...props} />);

    it('should render foo text correctly', () => {
        props.foo = 'harvey was here';
        const { getByTestId } = renderComponent();

        const component = getByTestId('container');

        expect(component).toHaveTextContent('harvey was here');
    });
});
