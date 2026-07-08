Painel Adapt TV - versão com Admin + Cloudflare

Arquivos principais:
- index.html: painel da TV. Agora lê os dados de https://adapt-tv-api.joaoadaptmkt.workers.dev/data
- admin.html: painel para atualizar os dados, sem Google Sheets.
- sprites/: personagens da corrida.
- worker-cloudflare.js: código opcional do Worker, caso precise substituir o código na Cloudflare.

Depois de subir no GitHub:
TV:
https://joaoadapt.github.io/Painel_TV_Adapt/

Admin:
https://joaoadapt.github.io/Painel_TV_Adapt/admin.html

Para salvar no admin:
1. Verifique se o Worker tem o binding ADAPT_TV_DATA.
2. Verifique se o Worker tem o secret ADMIN_TOKEN.
3. Abra admin.html.
4. Digite o token/senha admin.
5. Clique em Salvar senha.
6. Edite os dados.
7. Clique em Salvar tudo na TV.

Se der erro 401 no admin:
- Falta criar o secret ADMIN_TOKEN no Worker, ou a senha digitada no admin está diferente.

Se a TV carregar mas mostrar dados zerados:
- Abra o admin, preencha ou importe dados e clique em Salvar tudo na TV.
