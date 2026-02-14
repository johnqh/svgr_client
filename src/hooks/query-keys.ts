export const svgrKeys = {
  all: ['svgr'] as const,
  convert: () => [...svgrKeys.all, 'convert'] as const,
};
