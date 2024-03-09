CREATE TABLE S3Statistics (
                              id INT AUTO_INCREMENT,
                              bucket_name VARCHAR(255),
                              get_count INT,
                              put_count INT,
                              delete_count INT,
                              head_count INT,
                              last_updated TIMESTAMP,
                              PRIMARY KEY (id)
);
INSERT INTO S3Statistics (bucket_name, get_count, put_count, delete_count, head_count, last_updated)
VALUES ('gossip-file-server', 0, 0, 0, 0, NOW());