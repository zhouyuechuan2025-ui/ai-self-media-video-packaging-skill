export const presenterSafeZones = {
  center: {startPercent: 35, endPercent: 65},
  left: {startPercent: 6, endPercent: 32},
  right: {startPercent: 68, endPercent: 94},
  subtitleBottomPercent: 18,
};

export const placementStyle = (placement: 'left' | 'right' | 'center' | 'full') => ({
  flexDirection: 'row',
  justifyContent: placement === 'right' ? 'flex-end' : placement === 'full' ? 'stretch' : 'flex-start',
  alignItems: placement === 'full' ? 'stretch' : 'center',
  paddingLeft: placement === 'right' ? '68%' : placement === 'full' ? 0 : '6%',
  paddingRight: placement === 'left' ? '68%' : placement === 'full' ? 0 : '6%',
  paddingTop: placement === 'full' ? 0 : '7%',
  paddingBottom: placement === 'full' ? 0 : `${presenterSafeZones.subtitleBottomPercent}%`,
  gap: 24,
} as const);
