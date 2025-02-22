import ImageUploadButton from './ImageUploadButton';
import { act, render, screen } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { BatchItem, useItemFinalizeListener, useItemFinishListener, useItemStartListener } from '@rpldy/uploady';

const mockedUseItemStartListener = jest.mocked(useItemStartListener);
const mockedUseItemFinishListener = jest.mocked(useItemFinishListener);
const mockedUseItemFinalizeListener = jest.mocked(useItemFinalizeListener);

jest.mock('@rpldy/uploady', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@rpldy/uploady'),
    useItemStartListener: jest.fn(),
    useItemFinishListener: jest.fn(),
    useItemFinalizeListener: jest.fn(),
  };
});

const input = () => document.querySelector('input') as HTMLInputElement;

describe('Image Upload button', () => {
  let user: UserEvent;
  let onItemFinish: (url: string) => void;
  beforeEach(() => {
    user = userEvent.setup();
    onItemFinish = jest.fn();
    render(<ImageUploadButton onItemFinish={onItemFinish} />);
  });
  afterEach(() => {
    mockedUseItemStartListener.mockClear();
    mockedUseItemFinishListener.mockClear();
    mockedUseItemFinalizeListener.mockClear();
  });
  it('should show button', () => {
    expect(screen.getByRole('button', { name: 'Upload' })).toBeInTheDocument();
  });
  it('should have hidden file input', () => {
    const inputElement = input();
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'file');
  });
  it('should accept image files', async () => {
    const file = new File(['image'], 'image.png', { type: 'image/png' });
    const inputElement = input();

    await user.upload(inputElement, file);

    const uploadedFile = inputElement.files ? inputElement.files[0] : null;
    expect(uploadedFile).toBe(file);
  });
  it('should not accept non image files', async () => {
    const file = new File(['text'], 'text.html', { type: 'text/html' });
    const inputElement = input();

    await user.upload(inputElement, file);

    expect(inputElement.files).toHaveLength(0);
  });
  it('should call onItemFinish callback', async () => {
    mockedUseItemFinishListener.mock.calls[0][0](
      {
        uploadResponse: { data: { url: 'http://imageurl' } },
      } as BatchItem,
      {},
    );

    expect(onItemFinish).toHaveBeenCalledWith('http://imageurl');
  });
  it('should enable button by default', async () => {
    expect(screen.getByRole('button', { name: 'Upload' })).toBeEnabled();
  });
  it('should disable button when upload starts', async () => {
    await act(() => mockedUseItemStartListener.mock.calls[0][0]({} as BatchItem, {}));

    expect(screen.getByRole('button', { name: 'Upload' })).toBeDisabled();
  });
  it('should enable button when upload is finalized', async () => {
    mockedUseItemFinalizeListener.mock.calls[0][0]({} as BatchItem, {});

    expect(screen.getByRole('button', { name: 'Upload' })).toBeEnabled();
  });
});
