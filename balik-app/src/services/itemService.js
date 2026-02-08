import { supabase } from '../utils/supabaseClient'

export const itemService = {
    /**
     * Report a lost or found item
     */
    async reportItem(itemData) {
        // Remove .select() to avoid RLS check on SELECT
        const { data, error } = await supabase
            .from('items')
            .insert([itemData])

        if (error) throw error
        // Return a mock object since we can't select the inserted row
        return { id: crypto.randomUUID(), ...itemData }
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
     * Search items with filters
     */
    async searchItems({ query, category, type = 'found', embedding = null }) {
        // If we have an embedding, use vector search (smart matching)
        if (embedding) {
            console.log('Using NLP Smart Matching...');
            const { data, error } = await supabase.rpc('match_items', {
                query_embedding: embedding,
                match_threshold: 0.1, // Lower threshold to ensure results
                match_count: 20,
                item_type: type
            });

            if (error) throw error;

            // Filter by category client-side or add to RPC if needed
            // For now, client-side filter is fine for small result sets
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
     * NLP Smart Matching
     * This uses the multi-factor weighted scoring defined in the SQL schema
     * @param {number[]} embedding - The vector embedding of the query description
     * @param {string} itemType - The type of the item being matched (lost/found)
     * @param {object} factors - Optional factors: category, color, location, date
     */
    async getSmartMatches(embedding, itemType, threshold = 0.6, count = 5, factors = {}) {
        const { data, error } = await supabase.rpc('match_items', {
            query_embedding: embedding,
            match_threshold: threshold,
            match_count: count,
            item_type: itemType,
            // Multi-factor parameters
            query_category: factors.category || null,
            query_color: factors.color || null,
            query_location: factors.location || null,
            query_date: factors.date || null
        })

        if (error) throw error
        return data
    },

    /**
     * Get user stats for dashboard
     */
    async getUserStats(userId) {
        const { data, error } = await supabase
            .from('items')
            .select('type, status')
            .eq('user_id', userId)

        if (error) throw error

        return {
            total: data.length,
            lost: data.filter(i => i.type === 'lost').length,
            found: data.filter(i => i.type === 'found').length,
            resolved: data.filter(i => i.status === 'resolved').length
        }
    }
}
