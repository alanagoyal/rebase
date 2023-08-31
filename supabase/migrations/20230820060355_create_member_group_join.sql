CREATE TABLE member_group_joins (
    id serial PRIMARY KEY,
    member_id uuid REFERENCES members(id),
    group_id bigint REFERENCES member_groups(id)
);