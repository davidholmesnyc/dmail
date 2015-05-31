select Count(*) as count, `date`  as date,
strftime('%M',`date`) as month,
strftime('%Y',`date`) as year,
strftime('%h%p',`date`) as hour,
strftime('%D',`date`) as day
from emails 
where `to` = '{{to}}'
{{#if email}}
and `from` = '{{email}}'
{{/if}}

{{#if startDate}}
and `date` between '{{startDate}}' and '{{endDate}}'
{{/if}}
{{#if hour}}
GROUP BY strftime('%H',`date`)
order by strftime('%H',`date`) ASC 
{{/if}}
{{#if min}}
GROUP BY MINUTE(`date`)
order by MINUTE(`date`) ASC  
{{/if}}
{{#if month}}
GROUP BY strftime('%M',`date`)
order by strftime('%M',`date`) ASC  
{{/if}}
{{#if year}}
GROUP BY strftime('%Y',`date`)
order by strftime('%Y',`date`) ASC 
{{/if}}
{{#if day}}
GROUP BY strftime('%D',`date`)
order by strftime('%D',`date`) ASC 
{{/if}}


