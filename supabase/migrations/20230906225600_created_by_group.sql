ALTER TABLE member_groups
ADD COLUMN created_by uuid REFERENCES members(id);