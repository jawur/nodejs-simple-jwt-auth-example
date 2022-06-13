module.exports.schema = `
    CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
        \`email\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
        \`password\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
        \`token\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`users_email_unique\` (\`email\`)
    ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`
