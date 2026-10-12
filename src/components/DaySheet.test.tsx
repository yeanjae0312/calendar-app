import { fireEvent, render, screen } from '@testing-library/react-native';
import type { CalEvent } from '../lib/events';
import { ThemeProvider } from '../theme/ThemeProvider';
import { DaySheet } from './DaySheet';

test('그날에 걸친 여러 날 일정을 몇째 날인지와 함께 보여 준다', async () => {
  const trip: CalEvent = { id: 't', title: '제주 여행', date: '2026-10-16', endDate: '2026-10-19', time: null, icon: 'plane', repeat: 'none' };
  await render(
    <ThemeProvider>
      <DaySheet day="2026-10-18" events={[trip]} onClose={() => {}} onAdd={() => {}} onEdit={() => {}} />
    </ThemeProvider>,
  );
  expect(screen.getByText('제주 여행')).toBeTruthy();
  expect(screen.getByText('3일째')).toBeTruthy();
  expect(screen.getByText('10월 16일 ~ 10월 19일 · 하루 종일')).toBeTruthy();
});

test('스티커를 누르면 알려 주고, 붙은 스티커는 선택 표시, 저장된 메모를 보여 준다', async () => {
  const onToggleSticker = jest.fn();
  const onMemo = jest.fn();
  await render(
    <ThemeProvider>
      <DaySheet
        day="2026-10-09" events={[]} onClose={() => {}} onAdd={() => {}} onEdit={() => {}}
        deco={{ sticker: '☀️', memo: '낮잠' }} onToggleSticker={onToggleSticker} onMemo={onMemo}
      />
    </ThemeProvider>,
  );
  expect(screen.getByLabelText('스티커 ☀️')).toBeSelected();
  expect(screen.getByLabelText('스티커 🥰')).not.toBeSelected();
  await fireEvent.press(screen.getByLabelText('스티커 🥰'));
  expect(onToggleSticker).toHaveBeenCalledWith('🥰');
  expect(screen.getByDisplayValue('낮잠')).toBeTruthy();
});

test('메모는 입력할 때마다가 아니라 입력을 마치거나 창이 닫힐 때 저장한다', async () => {
  const onMemo = jest.fn();
  const view = await render(
    <ThemeProvider>
      <DaySheet day="2026-10-09" events={[]} onClose={() => {}} onAdd={() => {}} onEdit={() => {}} deco={{ memo: '낮잠' }} onMemo={onMemo} />
    </ThemeProvider>,
  );
  await fireEvent.changeText(screen.getByPlaceholderText('한 줄 메모'), '한강');
  await fireEvent.changeText(screen.getByPlaceholderText('한 줄 메모'), '한강 낮잠');
  expect(onMemo).not.toHaveBeenCalled();
  await fireEvent(screen.getByPlaceholderText('한 줄 메모'), 'blur');
  expect(onMemo).toHaveBeenLastCalledWith('한강 낮잠');
  await fireEvent.changeText(screen.getByPlaceholderText('한 줄 메모'), '한강 낮잠 꿀잠');
  await view.unmount();
  expect(onMemo).toHaveBeenLastCalledWith('한강 낮잠 꿀잠');
});

test('스티커는 처음에 두 줄(20개)만 보이고 더 보기로 펼치며, 고른 스티커가 뒤쪽이면 펼친 채로 연다', async () => {
  const sheet = (sticker?: string) => (
    <ThemeProvider>
      <DaySheet day="2026-10-09" events={[]} onClose={() => {}} onAdd={() => {}} onEdit={() => {}} deco={sticker ? { sticker } : undefined} />
    </ThemeProvider>
  );
  const view = await render(sheet());
  expect(screen.getAllByLabelText(/^스티커 /)).toHaveLength(20);
  await fireEvent.press(screen.getByText('스티커 더 보기'));
  expect(screen.getAllByLabelText(/^스티커 /)).toHaveLength(40);
  await fireEvent.press(screen.getByText('접기'));
  expect(screen.getAllByLabelText(/^스티커 /)).toHaveLength(20);
  await view.unmount();
  await render(sheet('🐶'));
  expect(screen.getAllByLabelText(/^스티커 /)).toHaveLength(40);
  expect(screen.getByLabelText('스티커 🐶')).toBeSelected();
});
