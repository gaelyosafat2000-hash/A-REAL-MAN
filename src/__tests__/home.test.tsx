import { render, screen } from '@testing-library/react-native';

import Index from '../app/index';

it('renderiza la pantalla inicial', async () => {
  await render(<Index />);
  expect(screen.getByText(/Life RPG/)).toBeTruthy();
});
