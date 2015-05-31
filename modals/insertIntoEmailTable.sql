INSERT INTO `emails` (`id`, `to`, `from`, `subject`, `uid`, `date`, `seen`, `mailbox`) 
VALUES 
{{#each .}}
(NULL, '{{to}}', '{{from}}','{{subject}}', '{{uid}}','{{date}}', '{{seen}}','{{mailbox}}'),
{{#if @last}}
(NULL, '{{to}}', '{{from}}','{{subject}}', '{{uid}}','{{date}}', '{{seen}}','{{mailbox}}');
{{/if}}
{{/each}}

