SELECT id, name, age, sex, birthday, note
 FROM users
 WHERE name LIKE '%' || $1 || '%'
 ORDER BY id