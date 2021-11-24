import React from 'react';
import { render } from '@testing-library/react';

import Widget from '.';
import { WidgetProps } from './widget.types';

describe('Test Component', () => {
    let props: WidgetProps;

    beforeEach(() => {
        props = {
            manifest: {
                name: 'Floor',
                version: '1.0.0',
            },
        };
    });

    const renderComponent = () => render(<Widget {...props} />);

    it('should render foo text correctly', () => {
        const { getByTestId } = renderComponent();

        const component = getByTestId('widget');

        expect(component).toHaveTextContent('harvey was here');
    });
});
