import React from 'react';
import { storiesOf } from '@storybook/react';
import { GROUPS } from '../../.storybook/hierarchySeparators';
import { SelectUIKit } from './Select';

storiesOf(`${GROUPS.FORMS}|Select`, module).add('simple select', () => (
  <SelectUIKit
    options={[
      {
        value: 1,
        label: "2132",
      },
    ]}
  />
));
