SELECT id, room_cd, user_id, entry_dt, exit_dt, note
 FROM room_access_mng
 WHERE room_cd LIKE '%' || $1 || '%'
 ORDER BY id DESC