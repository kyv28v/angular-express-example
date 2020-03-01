UPDATE room_access_mng
 SET room_cd = $1, user_id = $2, entry_dt = $3, exit_dt = $4, note = $5
 WHERE id = $6