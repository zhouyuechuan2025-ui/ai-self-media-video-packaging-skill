export const safeArea = {
  horizontal: 84,
  top: 70,
  bottom: 150,
};

export const placementStyle = (placement: 'left' | 'right' | 'center' | 'full') => ({
  flexDirection: 'row',
  justifyContent: placement === 'left' ? 'flex-start' : placement === 'right' ? 'flex-end' : 'center',
  alignItems: placement === 'full' ? 'stretch' : 'center',
  paddingLeft: safeArea.horizontal,
  paddingRight: safeArea.horizontal,
  paddingTop: safeArea.top,
  paddingBottom: safeArea.bottom,
} as const);
