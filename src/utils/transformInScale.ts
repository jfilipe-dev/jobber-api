export default function transformInScale(scale: string) {
  const [min, max] = scale.split('-').map(Number);

  return {
    min,
    max
  }
}