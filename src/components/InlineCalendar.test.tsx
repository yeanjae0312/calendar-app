import { fireEvent, render, screen } from '@testing-library/react-native';
import { ThemeProvider } from '../theme/ThemeProvider';
import { InlineCalendar } from './InlineCalendar';

test('선택한 날짜의 달이 보이고, 날짜를 누르면 그 날짜를 알려 준다', async () => {
  const onChange = jest.fn();
  await render(
    <ThemeProvider>
      <InlineCalendar value="2026-10-17" today="2026-09-30" onChange={onChange} />
    </ThemeProvider>,
  );
  expect(screen.getByText('2026년 10월')).toBeTruthy();
  await fireEvent.press(screen.getByLabelText('10월 20일'));
  expect(onChange).toHaveBeenCalledWith('2026-10-20');
});

test('화살표로 다음 달과 이전 달로 넘어간다', async () => {
  await render(
    <ThemeProvider>
      <InlineCalendar value="2026-12-17" today="2026-09-30" onChange={() => {}} />
    </ThemeProvider>,
  );
  await fireEvent.press(screen.getByLabelText('다음 달'));
  expect(screen.getByText('2027년 1월')).toBeTruthy();
  await fireEvent.press(screen.getByLabelText('이전 달'));
  await fireEvent.press(screen.getByLabelText('이전 달'));
  expect(screen.getByText('2026년 11월')).toBeTruthy();
});

test('minDate보다 이른 날짜는 누를 수 없다', async () => {
  const onChange = jest.fn();
  await render(
    <ThemeProvider>
      <InlineCalendar value="2026-10-19" today="2026-09-30" minDate="2026-10-16" rangeFrom="2026-10-16" onChange={onChange} />
    </ThemeProvider>,
  );
  await fireEvent.press(screen.getByLabelText('10월 15일'));
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.getByLabelText('10월 15일').props.accessibilityState).toMatchObject({ disabled: true });
  await fireEvent.press(screen.getByLabelText('10월 20일'));
  expect(onChange).toHaveBeenCalledWith('2026-10-20');
});
