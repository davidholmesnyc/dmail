select 
strftime('%m/%d/%Y',(select `date` from emails where `to` = '{{to}}' order by `date` ASC limit 1 ))as start_date,
strftime('%m/%d/%Y',(select `date` from emails where `to` = '{{to}}' order by `date` DESC limit 1 ))as end_date
