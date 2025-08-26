-- Suppression des tables existantes si elles existent (dans l'ordre inverse des dépendances)
DROP TABLE IF EXISTS posts_views CASCADE;
DROP TABLE IF EXISTS posts_categories CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Table des catégories
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des articles
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image VARCHAR(500),
    author VARCHAR(100) DEFAULT 'Web Online Concept',
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table de relation many-to-many entre posts et categories
CREATE TABLE posts_categories (
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, category_id)
);

-- Table pour compter les vues
CREATE TABLE posts_views (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_posts_views_post_id ON posts_views(post_id);
CREATE INDEX idx_posts_views_viewed_at ON posts_views(viewed_at);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertion de données d'exemple
INSERT INTO categories (name, slug, description) VALUES
    ('Actualités', 'actualites', 'Les dernières nouvelles de Web Online Concept'),
    ('Tutoriels', 'tutoriels', 'Guides et tutoriels pour créer et gérer votre site web'),
    ('SEO & Marketing', 'seo-marketing', 'Conseils pour améliorer votre référencement et votre visibilité'),
    ('Design Web', 'design-web', 'Tendances et conseils en design web'),
    ('Technologies', 'technologies', 'Les dernières technologies web et leur utilisation');

-- Article d'exemple
INSERT INTO posts (
    title,
    slug,
    excerpt,
    content,
    featured_image,
    status,
    meta_title,
    meta_description,
    meta_keywords,
    published_at
) VALUES (
    'Bienvenue sur notre blog !',
    'bienvenue-sur-notre-blog',
    'Découvrez notre nouveau blog où nous partagerons nos conseils et actualités sur la création de sites web.',
    '# Bienvenue sur notre blog !

Nous sommes ravis de lancer notre blog où nous partagerons régulièrement des conseils, des tutoriels et des actualités sur la création de sites web.

## Ce que vous trouverez ici

- **Tutoriels pratiques** : Des guides étape par étape pour créer et gérer votre site web
- **Conseils SEO** : Comment améliorer votre référencement naturel
- **Tendances du web** : Les dernières nouveautés en design et technologies web
- **Études de cas** : Des exemples concrets de projets réussis

## Pourquoi ce blog ?

Notre objectif est de vous accompagner dans votre présence en ligne en partageant notre expertise. Que vous soyez débutant ou expérimenté, vous trouverez ici des ressources utiles pour développer votre activité sur le web.

N''hésitez pas à nous contacter si vous avez des questions ou des sujets que vous aimeriez voir traités !

À bientôt pour de nouveaux articles.',
    '/images/blog/bienvenue-blog.jpg',
    'published',
    'Bienvenue sur notre blog - Web Online Concept',
    'Découvrez notre nouveau blog dédié à la création de sites web, au SEO et aux dernières tendances du digital.',
    'blog, création site web, seo, webdesign, tutoriels',
    CURRENT_TIMESTAMP
);

-- Associer l'article d'exemple à une catégorie
INSERT INTO posts_categories (post_id, category_id) VALUES 
    (1, 1); -- Associer à "Actualités"