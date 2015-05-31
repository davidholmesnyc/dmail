select Count(*) as count, `date`  as date,
DATE_FORMAT(`date`,'%M') as month,
DATE_FORMAT(`date`,'%Y') as year,
DATE_FORMAT(`date`,'%h%p') as hour,
DATE_FORMAT(`date`,'%D') as day
from emails 
where `to` = '{{to}}'
{{#if email}}
and `from` = '{{email}}'
{{/if}}

{{#if startDate}}
and `date` between '{{startDate}}' and '{{endDate}}'
{{/if}}
{{#if hour}}
GROUP BY HOUR(`date`)
order by HOUR(`date`) ASC 
{{/if}}
{{#if min}}
GROUP BY MINUTE(`date`)
order by MINUTE(`date`) ASC  
{{/if}}
{{#if month}}
GROUP BY MONTH(`date`)
order by MONTH(`date`) ASC  
{{/if}}
{{#if year}}
GROUP BY YEAR(`date`)
order by YEAR(`date`) ASC 
{{/if}}
{{#if day}}
GROUP BY DAY(`date`)
order by DAY(`date`) ASC 
{{/if}}


