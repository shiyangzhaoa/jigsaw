module.exports = (componentName) => ({
    content: `import React from 'react';

import { ${componentName}Props } from './${componentName}.types';

import './${componentName}.scss';

const ${componentName} = ({ foo }: ${componentName}Props) => (
    <div data-testid="${componentName}" className="foo-bar">
        {foo}
    </div>
);

export default ${componentName};

`,
    extension: `.tsx`,
});
