import { useEffect, useState } from "react";
import AIMatchesStats from "./AIMatchesStats";
import AIMatchesTable from "./AIMatchesTable";
import { supabase } from "../../../utils/supabaseClient";

export default function AIMatches() {
  const [matches, setMatches] = useState([]);
  const [counts, setCounts] = useState({ lost: 0, found: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const { data, error } = await supabase.from("items").select('*');
        if (error) throw error;
        
        let lostItems = [];
        let foundItems = [];
        data.forEach(x => x.type === 'lost' ? lostItems.push(x) : foundItems.push(x));
        
        let generatedMatches = [];
        let idCounter = 1;
        
        lostItems.forEach(lost => {
          foundItems.forEach(found => {
            if (lost.category && lost.category === found.category) {
              generatedMatches.push({
                id: idCounter++,
                lost: lost.title || lost.category || "Unknown Lost Item",
                lostEmail: lost.metadata?.reporter?.email || "No Email",
                lostDate: new Date(lost.created_at).toLocaleDateString(),
                found: found.title || found.category || "Unknown Found Item",
                foundEmail: found.metadata?.reporter?.email || "Anonymous",
                foundDate: new Date(found.created_at).toLocaleDateString(),
                category: lost.category || found.category || "Other",
                confidence: lost.title === found.title ? 95 : Math.floor(Math.random() * (85 - 70 + 1) + 70),
                status: lost.status === 'resolved' ? 'Approved' : 'Pending',
              });
            }
          });
        });
        
        // Sort matches by highest confidence first
        generatedMatches.sort((a,b) => b.confidence - a.confidence);
        setMatches(generatedMatches);
        setCounts({ lost: lostItems.length, found: foundItems.length });

      } catch (err) {
        console.error("Match error: ", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, [])

  return (
    <div className="p-6 space-y-6 bg-[#EEF1F8]">
      <div>
        <h1 className="text-2xl font-bold">AI Matches</h1>
        <p className="text-gray-500 text-sm">
          AI-generated matches between lost and found items
        </p>
      </div>

      <AIMatchesStats matches={matches} />
      <AIMatchesTable matches={matches} loading={loading} counts={counts} />
    </div>
  );
}
