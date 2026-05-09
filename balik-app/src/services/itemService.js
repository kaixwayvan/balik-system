import { supabase } from '../utils/supabaseClient'

export const itemService = {
    /**
     * Report a lost or found item
     */
    async reportItem(itemData) {
        const { data, error } = await supabase
            .from('items')
            .insert([itemData])
            .select()

        if (error) throw error
        return data[0]
    },

    /**
     * Upload an item image to Supabase Storage
     */
    async uploadItemImage(file) {
        if (!file) return null

        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('item-images')
            .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
            .from('item-images')
            .getPublicUrl(filePath)

        return publicUrl
    },

    /**
     * Fetch recent items (for the home page/recently found)
     */
    async getRecentItems(type = 'found', limit = 4) {
        const { data, error } = await supabase
            .from('items')
            .select('*')
            .eq('type', type)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) throw error
        return data
    },

    /**
     * Search items with filters (Support NLP Smart Matching)
     */
    async searchItems({ query, category, type = 'found', embedding = null }) {
        // If we have an embedding, use vector search (smart matching)
        if (embedding) {
            console.log('NLPService: Performing Smart Match search...');
            const { data, error } = await supabase.rpc('match_items', {
                query_embedding: embedding,
                match_threshold: 0.1, // Adjust based on precision needs
                match_count: 20,
                item_type: type
            });

            if (error) throw error;

            // Filter by category if specified
            if (category && category !== 'All Items') {
                return data.filter(item => item.category === category);
            }
            return data;
        }

        // Fallback to standard text search
        let supabaseQuery = supabase
            .from('items')
            .select('*')
            .eq('type', type)

        if (category && category !== 'All Items') {
            supabaseQuery = supabaseQuery.eq('category', category)
        }

        if (query) {
            supabaseQuery = supabaseQuery.ilike('title', `%${query}%`)
        }

        const { data, error } = await supabaseQuery.order('created_at', { ascending: false })

        if (error) throw error
        return data
    },

    /**
     * Get Match Details (for Admin review)
     */
    async getMatchDetails(matchId) {
        const { data, error } = await supabase
            .from('ai_matches')
            .select(`
                *,
                lost_item:lost_item_id(*),
                found_item:found_item_id(*)
            `)
            .eq('id', matchId)
            .single();

        if (error) throw error;
        return data;
    }
}
