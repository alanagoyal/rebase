ALTER TABLE members
ADD COLUMN group_id bigint REFERENCES member_groups(id);