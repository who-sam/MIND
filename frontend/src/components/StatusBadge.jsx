import { statusMap } from '../data/notesData';

function StatusBadge({ status }) {
  const data = statusMap[status];
  return (
    <span className={`status-badge absolute right-3 bottom-3 flex items-center space-x-2 px-3 py-1.5 rounded-lg ${data.bg} ${data.color} text-xs font-semibold shadow-sm`}>
      <span><i className={data.iconClass} /></span>
      <span>{data.text}</span>
    </span>
  );
}

export default StatusBadge;
