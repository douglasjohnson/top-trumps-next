import { act, render, screen } from '@testing-library/react';
import EditCardDialog from './EditCardDialog';
import Card from '../types/Card';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { BatchItem, useItemFinishListener } from '@rpldy/uploady';

const mockedUseItemFinishListener = jest.mocked(useItemFinishListener);

jest.mock('@rpldy/uploady', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@rpldy/uploady'),
    useItemFinishListener: jest.fn(),
  };
});

const input = (name: string) => screen.getByRole('textbox', { name });
const nameInput = () => input('Name');
const descriptionInput = () => input('Description');
const imageInput = () => input('Image');

describe('Edit Card Dialog', () => {
  let user: UserEvent;
  let onConfirm: () => void;
  let onClose: () => void;
  let card: Card;
  beforeEach(() => {
    user = userEvent.setup();
    onConfirm = jest.fn();
    onClose = jest.fn();
    card = {
      name: 'Card Name',
      description: 'Card description',
      imageUrl: 'http://imageurl',
      attributes: [
        { type: 'Att1', value: 1 },
        { type: 'Att2', value: 2 },
      ],
    };
  });
  afterEach(() => {
    mockedUseItemFinishListener.mockClear();
  });
  it('should be displayed when card is defined', () => {
    render(<EditCardDialog card={card} onConfirm={onConfirm} onClose={onClose} attributes={[]} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
  it('should not be displayed when card is undefined', () => {
    render(<EditCardDialog card={undefined} onConfirm={onConfirm} onClose={onClose} attributes={[]} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  it('should be displayed when card is updated to be defined', () => {
    const { rerender } = render(<EditCardDialog card={undefined} onConfirm={onConfirm} onClose={onClose} attributes={[]} />);

    rerender(<EditCardDialog card={card} onConfirm={onConfirm} onClose={onClose} attributes={[]} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
  it('should have input for name', () => {
    render(<EditCardDialog card={card} onConfirm={onConfirm} onClose={onClose} attributes={[]} />);

    expect(nameInput()).toHaveValue('Card Name');
  });
  it('should have input for description', () => {
    render(<EditCardDialog card={card} onConfirm={onConfirm} onClose={onClose} attributes={[]} />);

    expect(descriptionInput()).toHaveValue('Card description');
  });
  it('should have input for image url', () => {
    render(<EditCardDialog card={card} onConfirm={onConfirm} onClose={onClose} attributes={[]} />);

    expect(imageInput()).toHaveValue('http://imageurl');
  });
  it('should have button for image upload', () => {
    render(<EditCardDialog card={card} onConfirm={onConfirm} onClose={onClose} attributes={[]} />);

    expect(screen.getByRole('button', { name: 'Upload' })).toBeInTheDocument();
  });
  it('should update image on image upload', () => {
    render(<EditCardDialog card={card} onConfirm={onConfirm} onClose={onClose} attributes={[]} />);

    act(() =>
      mockedUseItemFinishListener.mock.calls[0][0](
        {
          uploadResponse: { data: { url: 'http://uploadedimageurl' } },
        } as BatchItem,
        {},
      ),
    );

    expect(imageInput()).toHaveValue('http://uploadedimageurl');
  });
  it('should have input for each attribute', () => {
    render(
      <EditCardDialog
        card={card}
        onConfirm={onConfirm}
        onClose={onClose}
        attributes={[
          { name: 'Att1', units: 'a' },
          { name: 'Att2', units: 'b' },
        ]}
      />,
    );

    expect(screen.getByRole('textbox', { name: 'Att1' })).toHaveValue('1');
    expect(screen.getByRole('textbox', { name: 'Att2' })).toHaveValue('2');
  });
  it('should call onClose when cancel button is clicked', async () => {
    render(<EditCardDialog card={card} onConfirm={onConfirm} onClose={onClose} attributes={[]} />);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onClose).toHaveBeenCalled();
  });
  it('should call onConfirm when confirm button is clicked', async () => {
    render(
      <EditCardDialog
        card={card}
        onConfirm={onConfirm}
        onClose={onClose}
        attributes={[
          { name: 'Att1', units: 'a' },
          { name: 'Att2', units: 'b' },
        ]}
      />,
    );

    await user.type(nameInput(), ' edited');
    await user.type(descriptionInput(), ' edited');
    await user.type(imageInput(), '2');
    await user.type(input('Att1'), '1');
    await user.type(input('Att2'), '2');
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(onConfirm).toHaveBeenCalledWith({
      name: 'Card Name edited',
      description: 'Card description edited',
      imageUrl: 'http://imageurl2',
      attributes: [
        { type: 'Att1', value: 11 },
        { type: 'Att2', value: 22 },
      ],
    });
  });
});
