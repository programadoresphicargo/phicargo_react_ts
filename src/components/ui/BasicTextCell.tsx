interface Props {
  value: string | number | undefined | null;
  className?: string;
  fallback?: string;
}

export const BasicTextCell = ({ value, className, fallback }: Props) => {
  const styles = value
    ? className ?? 'font-bold uppercase'
    : 'font-bold uppercase text-gray-400';

  return (
    <span className={styles}>
      {value ? value : fallback ? fallback : 'Sin dato'}
    </span>
  );
};

