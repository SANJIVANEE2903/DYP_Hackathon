import { Stack } from '@/types';

interface StackBadgeProps {
  stack: Stack;
}

const stackColors: Record<Stack, { bg: string; text: string }> = {
  'Node.js': { bg: 'bg-[#dbeafe]', text: 'text-[#0070f3]' },
  'Python': { bg: 'bg-[#fef3c7]', text: 'text-[#b45309]' },
  'Go': { bg: 'bg-[#d1fae5]', text: 'text-[#059669]' },
  'Java': { bg: 'bg-[#fce7f3]', text: 'text-[#be185d]' },
  'React Native': { bg: 'bg-[#dbeafe]', text: 'text-[#0070f3]' },
  'Rust': { bg: 'bg-[#fed7aa]', text: 'text-[#92400e]' },
};

export function StackBadge({ stack }: StackBadgeProps) {
  const colors = stackColors[stack];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
      {stack}
    </span>
  );
}
