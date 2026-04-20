import ActionIcons from "./ActionIcons";
import {
  getConfidenceStyle,
  getStatusStyle,
} from "./helper/matchUtils";

export default function AIMatchRow({ match, onAction }) {
  return (
    <tr className="border-t border-gray-300 hover:bg-gray-50 align-middle">
      {/* LOST */}
      <td className="px-6 py-5">
        <p className="font-semibold">{match.lost}</p>
        <p className="text-xs text-gray-500">{match.lostEmail}</p>
        <p className="text-xs text-gray-400">
          Lost: {match.lostDate}
        </p>
      </td>

      {/* FOUND */}
      <td className="px-6 py-5">
        <p className="font-semibold">{match.found}</p>
        <p className="text-xs text-gray-500">{match.foundEmail}</p>
        <p className="text-xs text-gray-400">
          Found: {match.foundDate}
        </p>
      </td>

      {/* CONFIDENCE */}
      <td className="px-6 py-5">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getConfidenceStyle(
            match.confidence
          )}`}
        >
          {match.confidence}%
        </span>
      </td>

      {/* STATUS */}
      <td className="px-6 py-5">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
            match.status
          )}`}
        >
          {match.status}
        </span>
      </td>

      {/* ACTIONS */}
      <td className="px-6 py-5">
        <ActionIcons
          status={match.status}
          match={match}
          onAction={onAction}
        />
      </td>
    </tr>
  );
}