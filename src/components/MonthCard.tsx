import Constants from 'expo-constants';
import type { Ref } from 'react';
import { View } from 'react-native';
import type { Days } from '../lib/days';
import { decoratedCount, monthCells } from '../lib/monthCard';
import { useHolidays } from '../store/Holidays';
import { paletteFor } from '../theme/colors';
import { useTheme } from '../theme/ThemeProvider';
import { Emoji } from './Emoji';
import { Txt } from './ui';

const WEEK = ['일', '월', '화', '수', '목', '금', '토'];

type Props = { y: number; m: number; days: Days; width: number; ref?: Ref<View> };

// 한 달 동안 붙인 스티커를 달력 모양으로 모은 세로(9:16) 카드. 공유 이미지로 쓰여서
// 다크 모드와 상관없이 고른 색 테마의 밝은 색으로 그린다.
export function MonthCard({ y, m, days, width, ref }: Props) {
  const { colorTheme } = useTheme();
  const p = paletteFor(colorTheme, 'light');
  const cells = monthCells(y, m, days, useHolidays());
  const cell = `${100 / 7}%` as const;
  const toneColor = { red: p.sun, blue: p.sat, normal: p.dim };

  return (
    <View
      ref={ref}
      testID="month-card"
      collapsable={false}
      style={{
        width, height: (width * 16) / 9, backgroundColor: p.accentSoft, borderRadius: 26,
        paddingHorizontal: 18, justifyContent: 'center', gap: 16,
      }}
    >
      <View style={{ alignItems: 'center' }}>
        <Txt display style={{ fontSize: 34, color: p.accentInk }}>{`${m}월`}</Txt>
        <Txt style={{ fontSize: 13, color: p.muted }}>{String(y)}</Txt>
      </View>
      <View style={{ backgroundColor: p.surface, borderRadius: 18, paddingVertical: 8, paddingHorizontal: 6, flexDirection: 'row', flexWrap: 'wrap' }}>
        {WEEK.map((w) => (
          <Txt key={w} style={{ width: cell, textAlign: 'center', fontSize: 10, color: p.muted, paddingBottom: 2 }}>{w}</Txt>
        ))}
        {cells.map((c, i) => (
          <View key={c?.key ?? `empty-${i}`} style={{ width: cell, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' }}>
            {c?.sticker ? (
              <Emoji size={Math.round(width / 15)}>{c.sticker}</Emoji>
            ) : c ? (
              <Txt style={{ fontSize: 11, color: toneColor[c.tone] }}>{String(c.day)}</Txt>
            ) : null}
          </View>
        ))}
      </View>
      <View style={{ alignItems: 'center', gap: 4 }}>
        <Txt display style={{ fontSize: 14, color: p.accentInk }}>{`꾸민 날 ${decoratedCount(y, m, days)}일`}</Txt>
        <Txt style={{ fontSize: 12, color: p.muted }}>{Constants.expoConfig?.name ?? ''}</Txt>
      </View>
    </View>
  );
}
