-- Create a function to execute dynamic SQL
create or replace function execute_sql(sql text)
returns void as $$
begin
  execute sql;
end;
$$ language plpgsql security definer;
