-- Gossip schema. Reconstructed from the queries in db/*.js.
-- Idempotent: safe to run on every startup (see db/migrate.js).

CREATE TABLE IF NOT EXISTS users (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    username            VARCHAR(50)  NOT NULL UNIQUE,
    name                VARCHAR(100) NOT NULL,
    gmail               VARCHAR(255) NOT NULL UNIQUE,      -- the account email
    password            VARCHAR(255) NOT NULL,             -- bcrypt hash
    status              VARCHAR(280) NULL,                 -- profile bio
    location            VARCHAR(100) NULL,
    website             VARCHAR(255) NULL,
    avatarPath          VARCHAR(255) NOT NULL DEFAULT 'defaultAvatar.png',
    bannerPath          VARCHAR(255) NOT NULL DEFAULT 'defaultBanner.jpg',
    reset_token         VARCHAR(255) NULL,                 -- bcrypt hash of the emailed reset code
    reset_token_expires DATETIME     NULL,
    created             TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    creator_user_id  INT       NOT NULL,
    body             TEXT      NOT NULL,
    original_post_id INT       NULL,                       -- set for comments and reposts
    isComment        BOOLEAN   NOT NULL DEFAULT FALSE,
    isRetweet        BOOLEAN   NOT NULL DEFAULT FALSE,
    created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_posts_creator  FOREIGN KEY (creator_user_id)  REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_posts_original FOREIGN KEY (original_post_id) REFERENCES posts (id) ON DELETE CASCADE,
    INDEX idx_posts_creator (creator_user_id),
    INDEX idx_posts_original (original_post_id)
);

CREATE TABLE IF NOT EXISTS posts_images (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    post_id    INT          NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    CONSTRAINT fk_posts_images_post FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
    INDEX idx_posts_images_post (post_id)
);

CREATE TABLE IF NOT EXISTS post_likes (
    liked_post_id INT       NOT NULL,
    liker_user_id INT       NOT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (liked_post_id, liker_user_id),
    CONSTRAINT fk_post_likes_post FOREIGN KEY (liked_post_id) REFERENCES posts (id) ON DELETE CASCADE,
    CONSTRAINT fk_post_likes_user FOREIGN KEY (liker_user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS friendships (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user1_id   INT       NOT NULL,
    user2_id   INT       NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_friendships_user1 FOREIGN KEY (user1_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_friendships_user2 FOREIGN KEY (user2_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_friendships_user1 (user1_id),
    INDEX idx_friendships_user2 (user2_id)
);

CREATE TABLE IF NOT EXISTS friend_requests (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    sender_user_id    INT       NOT NULL,
    recipient_user_id INT       NOT NULL,
    created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_friend_requests_sender    FOREIGN KEY (sender_user_id)    REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_friend_requests_recipient FOREIGN KEY (recipient_user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_friend_requests_recipient (recipient_user_id)
);

CREATE TABLE IF NOT EXISTS conversations (
    conversation_id   INT AUTO_INCREMENT PRIMARY KEY,
    conversation_name VARCHAR(255) NULL,
    isGroupChat       BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversation_members (
    conversation_id INT NOT NULL,
    user_id         INT NOT NULL,
    PRIMARY KEY (conversation_id, user_id),
    CONSTRAINT fk_conversation_members_conv FOREIGN KEY (conversation_id) REFERENCES conversations (conversation_id) ON DELETE CASCADE,
    CONSTRAINT fk_conversation_members_user FOREIGN KEY (user_id)         REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_conversation_members_user (user_id)
);

CREATE TABLE IF NOT EXISTS conversations_messages (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT       NOT NULL,
    sender_id       INT       NOT NULL,
    message_value   TEXT      NOT NULL,                    -- text, or a stored file name when isFile = 1
    isFile          BOOLEAN   NOT NULL DEFAULT FALSE,
    createdAt       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_messages_conv   FOREIGN KEY (conversation_id) REFERENCES conversations (conversation_id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id)       REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_messages_conv_time (conversation_id, createdAt)
);

-- Monthly S3 request counters (only used when images are stored in S3).
CREATE TABLE IF NOT EXISTS s3statistics (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    bucket_name  VARCHAR(255) NOT NULL UNIQUE,
    get_count    INT          NOT NULL DEFAULT 0,
    put_count    INT          NOT NULL DEFAULT 0,
    delete_count INT          NOT NULL DEFAULT 0,
    head_count   INT          NOT NULL DEFAULT 0,
    last_updated TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
