import { Star, Medal } from "lucide-react";
import { TbStars } from "react-icons/tb";

export default function BadgeList({ badges }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="font-bold text-lg mb-4">Most Earned Badges</h2>

      <div className="space-y-4">
        {badges.map((badge, index) => (
          <div
            key={index}
            className="flex justify-between items-center border border-gray-300 shadow-sm rounded-lg p-4"
          >
            <div className="flex items-center gap-3">
              <Medal size={26} className="text-yellow-500" />
              <div>
                <p className="font-medium">{badge.title}</p>
                <p className="text-sm text-gray-500">
                  {badge.description}
                </p>
              </div>
            </div>

            <p className="text-base font-bold text-gray-600">
              {badge.users} users
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}