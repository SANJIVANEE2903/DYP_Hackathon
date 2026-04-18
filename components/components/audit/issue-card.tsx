import { AuditIssue } from '@/types';

interface IssueCardProps {
  issue: AuditIssue;
}

export function IssueCard({ issue }: IssueCardProps) {
  const severityConfig = {
    critical: { icon: '🔴', color: 'text-[#ef4444]' },
    warning: { icon: '🟡', color: 'text-[#f59e0b]' },
    info: { icon: '🟢', color: 'text-[#10b981]' },
  };

  const config = severityConfig[issue.severity];

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-lg p-4 flex items-start gap-4">
      <div className={`text-lg flex-shrink-0 ${config.color}`}>
        {config.icon}
      </div>
      <div className="flex-1">
        <p className="font-medium text-sm text-[#0a0a0a]">{issue.title}</p>
        <p className="text-xs text-[#6b7280] mt-1">{issue.description}</p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        {issue.fixable ? (
          <button className="px-3 py-1.5 text-xs font-medium text-white bg-[#0070f3] hover:bg-[#0060df] rounded-lg transition-colors">
            Fix now
          </button>
        ) : (
          <button className="px-3 py-1.5 text-xs font-medium text-[#0070f3] hover:bg-[#f0f9ff] rounded-lg transition-colors">
            Learn more
          </button>
        )}
      </div>
    </div>
  );
}
