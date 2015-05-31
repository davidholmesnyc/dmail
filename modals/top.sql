select `from` as email,count(*) as count
,( count(*) / Total *100 )  as percentage  
from emails,
(SELECT COUNT(*) AS total FROM emails) AS Total
where `to` = "{{to}}"
{{#if email}}
  and `from` = "{{email}}"
{{/if}}

{{#if startDate}}
  and `date` between '{{startDate}}' and '{{endDate}}'
{{/if}}

 group by `from`
 order by count DESC
 LIMIT 10