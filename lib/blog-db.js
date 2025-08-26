import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

// ========== POSTS ==========

// Récupérer tous les articles publiés avec pagination
export async function getPublishedPosts(page = 1, perPage = 10) {
  const offset = (page - 1) * perPage
  
  const posts = await sql`
    SELECT 
      p.*,
      COALESCE(
        json_agg(
          json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) 
          ORDER BY c.name
        ) FILTER (WHERE c.id IS NOT NULL), 
        '[]'
      ) as categories,
      COUNT(DISTINCT pv.id) as views_count
    FROM posts p
    LEFT JOIN posts_categories pc ON p.id = pc.post_id
    LEFT JOIN categories c ON pc.category_id = c.id
    LEFT JOIN posts_views pv ON p.id = pv.post_id
    WHERE p.status = 'published' AND p.published_at <= NOW()
    GROUP BY p.id
    ORDER BY p.published_at DESC
    LIMIT ${perPage} OFFSET ${offset}
  `
  
  const totalCount = await sql`
    SELECT COUNT(*) as count 
    FROM posts 
    WHERE status = 'published' AND published_at <= NOW()
  `
  
  return {
    posts,
    totalPages: Math.ceil(totalCount[0].count / perPage),
    currentPage: page
  }
}

// Récupérer un article par son slug
export async function getPostBySlug(slug) {
  const result = await sql`
    SELECT 
      p.*,
      COALESCE(
        json_agg(
          json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) 
          ORDER BY c.name
        ) FILTER (WHERE c.id IS NOT NULL), 
        '[]'
      ) as categories,
      COUNT(DISTINCT pv.id) as views_count
    FROM posts p
    LEFT JOIN posts_categories pc ON p.id = pc.post_id
    LEFT JOIN categories c ON pc.category_id = c.id
    LEFT JOIN posts_views pv ON p.id = pv.post_id
    WHERE p.slug = ${slug} AND p.status = 'published' AND p.published_at <= NOW()
    GROUP BY p.id
  `
  
  return result[0] || null
}

// Récupérer les articles d'une catégorie
export async function getPostsByCategory(categorySlug, page = 1, perPage = 10) {
  const offset = (page - 1) * perPage
  
  const posts = await sql`
    SELECT 
      p.*,
      COALESCE(
        json_agg(
          json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) 
          ORDER BY c.name
        ) FILTER (WHERE c.id IS NOT NULL), 
        '[]'
      ) as categories,
      COUNT(DISTINCT pv.id) as views_count
    FROM posts p
    LEFT JOIN posts_categories pc ON p.id = pc.post_id
    LEFT JOIN categories c ON pc.category_id = c.id
    LEFT JOIN posts_views pv ON p.id = pv.post_id
    WHERE 
      p.status = 'published' 
      AND p.published_at <= NOW()
      AND EXISTS (
        SELECT 1 FROM posts_categories pc2 
        JOIN categories c2 ON pc2.category_id = c2.id 
        WHERE pc2.post_id = p.id AND c2.slug = ${categorySlug}
      )
    GROUP BY p.id
    ORDER BY p.published_at DESC
    LIMIT ${perPage} OFFSET ${offset}
  `
  
  const totalCount = await sql`
    SELECT COUNT(DISTINCT p.id) as count 
    FROM posts p
    JOIN posts_categories pc ON p.id = pc.post_id
    JOIN categories c ON pc.category_id = c.id
    WHERE p.status = 'published' AND p.published_at <= NOW() AND c.slug = ${categorySlug}
  `
  
  return {
    posts,
    totalPages: Math.ceil(totalCount[0].count / perPage),
    currentPage: page
  }
}

// Rechercher des articles
export async function searchPosts(query, page = 1, perPage = 10) {
  const offset = (page - 1) * perPage
  const searchTerm = `%${query}%`
  
  const posts = await sql`
    SELECT 
      p.*,
      COALESCE(
        json_agg(
          json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) 
          ORDER BY c.name
        ) FILTER (WHERE c.id IS NOT NULL), 
        '[]'
      ) as categories,
      COUNT(DISTINCT pv.id) as views_count
    FROM posts p
    LEFT JOIN posts_categories pc ON p.id = pc.post_id
    LEFT JOIN categories c ON pc.category_id = c.id
    LEFT JOIN posts_views pv ON p.id = pv.post_id
    WHERE 
      p.status = 'published' 
      AND p.published_at <= NOW()
      AND (
        p.title ILIKE ${searchTerm} 
        OR p.content ILIKE ${searchTerm} 
        OR p.excerpt ILIKE ${searchTerm}
      )
    GROUP BY p.id
    ORDER BY p.published_at DESC
    LIMIT ${perPage} OFFSET ${offset}
  `
  
  const totalCount = await sql`
    SELECT COUNT(*) as count 
    FROM posts 
    WHERE 
      status = 'published' 
      AND published_at <= NOW()
      AND (
        title ILIKE ${searchTerm} 
        OR content ILIKE ${searchTerm} 
        OR excerpt ILIKE ${searchTerm}
      )
  `
  
  return {
    posts,
    totalPages: Math.ceil(totalCount[0].count / perPage),
    currentPage: page
  }
}

// Récupérer les articles récents pour le sidebar
export async function getRecentPosts(limit = 5) {
  return await sql`
    SELECT id, title, slug, published_at, featured_image
    FROM posts
    WHERE status = 'published' AND published_at <= NOW()
    ORDER BY published_at DESC
    LIMIT ${limit}
  `
}

// Récupérer les articles populaires (plus vus)
export async function getPopularPosts(limit = 5) {
  return await sql`
    SELECT 
      p.id, 
      p.title, 
      p.slug, 
      p.published_at, 
      p.featured_image,
      COUNT(pv.id) as views_count
    FROM posts p
    LEFT JOIN posts_views pv ON p.id = pv.post_id
    WHERE p.status = 'published' AND p.published_at <= NOW()
    GROUP BY p.id
    ORDER BY views_count DESC, p.published_at DESC
    LIMIT ${limit}
  `
}

// Enregistrer une vue d'article
export async function recordPostView(postId, ipAddress = null, userAgent = null) {
  return await sql`
    INSERT INTO posts_views (post_id, ip_address, user_agent)
    VALUES (${postId}, ${ipAddress}, ${userAgent})
  `
}

// ========== CATEGORIES ==========

// Récupérer toutes les catégories
export async function getAllCategories() {
  return await sql`
    SELECT 
      c.*,
      COUNT(DISTINCT p.id) as post_count
    FROM categories c
    LEFT JOIN posts_categories pc ON c.id = pc.category_id
    LEFT JOIN posts p ON pc.post_id = p.id AND p.status = 'published' AND p.published_at <= NOW()
    GROUP BY c.id
    ORDER BY c.name
  `
}

// Récupérer une catégorie par son slug
export async function getCategoryBySlug(slug) {
  const result = await sql`
    SELECT 
      c.*,
      COUNT(DISTINCT p.id) as post_count
    FROM categories c
    LEFT JOIN posts_categories pc ON c.id = pc.category_id
    LEFT JOIN posts p ON pc.post_id = p.id AND p.status = 'published' AND p.published_at <= NOW()
    WHERE c.slug = ${slug}
    GROUP BY c.id
  `
  
  return result[0] || null
}

// ========== ADMIN FUNCTIONS ==========

// Récupérer tous les articles (admin)
export async function getAllPosts() {
  return await sql`
    SELECT 
      p.*,
      COALESCE(
        json_agg(
          json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) 
          ORDER BY c.name
        ) FILTER (WHERE c.id IS NOT NULL), 
        '[]'
      ) as categories,
      COUNT(DISTINCT pv.id) as views_count
    FROM posts p
    LEFT JOIN posts_categories pc ON p.id = pc.post_id
    LEFT JOIN categories c ON pc.category_id = c.id
    LEFT JOIN posts_views pv ON p.id = pv.post_id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `
}

// Récupérer un article par son ID (admin)
export async function getPostById(id) {
  const result = await sql`
    SELECT 
      p.*,
      COALESCE(
        json_agg(
          json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) 
          ORDER BY c.name
        ) FILTER (WHERE c.id IS NOT NULL), 
        '[]'
      ) as categories
    FROM posts p
    LEFT JOIN posts_categories pc ON p.id = pc.post_id
    LEFT JOIN categories c ON pc.category_id = c.id
    WHERE p.id = ${id}
    GROUP BY p.id
  `
  
  return result[0] || null
}

// Créer un article
export async function createPost(postData) {
  const { 
    title, 
    slug, 
    excerpt, 
    content, 
    featured_image, 
    author,
    status, 
    meta_title, 
    meta_description,
    meta_keywords,
    published_at,
    category_ids = []
  } = postData
  
  // Insérer l'article
  const result = await sql`
    INSERT INTO posts (
      title, slug, excerpt, content, featured_image, author,
      status, meta_title, meta_description, meta_keywords, published_at
    ) VALUES (
      ${title}, ${slug}, ${excerpt}, ${content}, ${featured_image}, ${author},
      ${status}, ${meta_title}, ${meta_description}, ${meta_keywords}, ${published_at}
    )
    RETURNING id
  `
  
  const postId = result[0].id
  
  // Associer les catégories
  if (category_ids.length > 0) {
    const categoryValues = category_ids.map(catId => `(${postId}, ${catId})`).join(',')
    await sql.unsafe(`
      INSERT INTO posts_categories (post_id, category_id) 
      VALUES ${categoryValues}
    `)
  }
  
  return postId
}

// Mettre à jour un article
export async function updatePost(id, postData) {
  const { 
    title, 
    slug, 
    excerpt, 
    content, 
    featured_image, 
    author,
    status, 
    meta_title, 
    meta_description,
    meta_keywords,
    published_at,
    category_ids = []
  } = postData
  
  // Mettre à jour l'article
  await sql`
    UPDATE posts SET
      title = ${title},
      slug = ${slug},
      excerpt = ${excerpt},
      content = ${content},
      featured_image = ${featured_image},
      author = ${author},
      status = ${status},
      meta_title = ${meta_title},
      meta_description = ${meta_description},
      meta_keywords = ${meta_keywords},
      published_at = ${published_at}
    WHERE id = ${id}
  `
  
  // Supprimer les anciennes associations de catégories
  await sql`DELETE FROM posts_categories WHERE post_id = ${id}`
  
  // Ajouter les nouvelles associations
  if (category_ids.length > 0) {
    const categoryValues = category_ids.map(catId => `(${id}, ${catId})`).join(',')
    await sql.unsafe(`
      INSERT INTO posts_categories (post_id, category_id) 
      VALUES ${categoryValues}
    `)
  }
  
  return true
}

// Supprimer un article
export async function deletePost(id) {
  return await sql`DELETE FROM posts WHERE id = ${id}`
}

// Créer une catégorie
export async function createCategory(name, slug, description) {
  const result = await sql`
    INSERT INTO categories (name, slug, description)
    VALUES (${name}, ${slug}, ${description})
    RETURNING id
  `
  
  return result[0].id
}

// Mettre à jour une catégorie
export async function updateCategory(id, name, slug, description) {
  return await sql`
    UPDATE categories SET
      name = ${name},
      slug = ${slug},
      description = ${description}
    WHERE id = ${id}
  `
}

// Supprimer une catégorie
export async function deleteCategory(id) {
  return await sql`DELETE FROM categories WHERE id = ${id}`
}

// Générer un slug unique
export async function generateUniqueSlug(baseSlug, excludeId = null) {
  let slug = baseSlug
  let counter = 1
  
  while (true) {
    const existing = excludeId 
      ? await sql`SELECT id FROM posts WHERE slug = ${slug} AND id != ${excludeId}`
      : await sql`SELECT id FROM posts WHERE slug = ${slug}`
    
    if (existing.length === 0) break
    
    slug = `${baseSlug}-${counter}`
    counter++
  }
  
  return slug
}