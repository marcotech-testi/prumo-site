# 00 — Decisões já tomadas (não reabrir)

Fontes: MVP de 6 meses, business plan, pesquisa de presença em IAs, Manual da Marca v2 e conversas do Marco (27/11/2026). Resumo do que importa para o site.

## Negócio
- **Prumo Paisagismo** é nome fantasia, sem CNPJ próprio no MVP (usa o CNPJ já existente do Marco). Operação 100% online: sem loja, sem atendimento presencial ao público, sem funcionários, sem aluguel.
- **Oferta do MVP: uma coisa só** — jardim vertical natural com irrigação automatizada e plano de manutenção, **orçado 100% online**: o cliente envia fotos ou vídeo da parede + medidas; devolvemos uma **faixa de investimento por m² em até um dia útil**; a **visita técnica** só é agendada para quem avança; o valor fechado vem depois da visita.
- **Fora do MVP:** paisagismo completo (só por demanda, caso a caso), jardim preservado/artificial, loja, atendimento presencial sem orçamento. O site pode mencionar paisagismo, mas sempre como "sob consulta, caso a caso", sem vender como produto.
- **Público:** proprietários de casas e apartamentos de alto padrão em Curitiba e região metropolitana; arquitetos e designers de interiores; depois, incorporadoras pelo canal do parceiro.
- **Execução** é do parceiro (equipe com várias obras entregues para construtoras e incorporadoras). As obras do portfólio são reais e feitas pelo parceiro; as fotos chegam depois.
- **Tráfego pago:** R$ 500 a 1.000/mês (Meta, Google, IAs). O site precisa **medir a origem de cada pedido** (UTMs, gclid, fbclid vão junto do orçamento).
- **Quem faz o quê:** Marco = toda a tecnologia. Esposa = comercial/administrativo (responde os orçamentos, WhatsApp). Parceiro = execução.

## Posicionamento e SEO (do business plan e dos testes com IAs)
- Termo principal: **jardim vertical**. Variantes dentro do texto (não em páginas duplicadas): parede verde, muro verde, jardim de parede.
- Nos testes, ChatGPT e Gemini nomearam empresas **a partir das páginas de serviço dos próprios sites**; o Claude, por busca, só achou portais. Portanto: **uma página completa por serviço**, resposta direta no início, FAQ com perguntas reais, e cidade citada naturalmente.
- Lacuna dos concorrentes que a Prumo ocupa: preço invisível, irrigação tratada como acessório, manutenção sem pacote, contrato fragmentado. O site explica o que move o preço (sem publicar número), trata irrigação como parte do projeto e a manutenção como plano.
- Concorrentes citados pelas IAs (não nomear no site): Casa das Plantas, Acer Haus, Baquet, Ciccarino.

## Decisões de conteúdo
- **Preço numérico: não publicar agora.** O ticket de R$ 1.800/m² do modelo está acima das faixas públicas e ainda precisa ser validado nos primeiros orçamentos. Existe um bloco condicional pronto (`siteConfig.priceRange`) para publicar depois sem mexer em layout.
- **Garantia, prazo, laudo de impermeabilização:** não prometer. O texto diz que prazo, garantia e reposição constam **por escrito na proposta**. (A garantia de 90 dias e o laudo estão só como hipótese a validar com o jurídico.)
- **Sem depoimentos, sem avaliações, sem números de obras, sem nomes de clientes, sem selos de fornecedores.**
- **Área de atuação:** "Curitiba e região metropolitana", com exemplos naturais no texto (São José dos Pinhais, Pinhais, Colombo, Araucária, Campo Largo).
- **Contato:** e-mail contato@prumopaisagismo.com.br; WhatsApp comercial **(41) 93618-6969**, ativo desde 27/11/2026 e atendido primeiro pela assistente de IA "Vera" (`docs/assistente-ia/`), que passa para a equipe (no site: variável `NEXT_PUBLIC_WHATSAPP=5541936186969`; o botão continua oculto se a variável estiver vazia; o exemplo antigo (41) 9 0000-0000 **nunca deve ser publicado**); Instagram/TikTok/YouTube `@prumopaisagismo` ainda não criados (links ocultos até `NEXT_PUBLIC_SOCIAL_LIVE=true`).
- **Assinatura da marca "Verde no prumo":** em validação, não usar.
- **Obras:** o site nasce com obras reais do parceiro. Sem obra autorizada, a seção some. O go-live exige ≥ 3 obras.

## Decisões técnicas
- Next.js + Tailwind v4 + Vercel; sem CMS, sem banco. Resend para e-mail, Vercel Blob para as fotos do orçamento (upload direto do navegador), Turnstile + honeypot + tempo mínimo como antispam. Webhook assinado (HMAC) como ponto de integração com o futuro sistema de orçamento e IA de atendimento do Marco (fora deste repositório).
- **Trabalhar em `C:\dev\prumo-site`**, fora do OneDrive (node_modules dentro do OneDrive trava). A pasta `...\Prumo\10-site` é a fonte das instruções e dos ativos; o script `preparar-repo.ps1` copia tudo para o clone.
- **Plano da Vercel:** o plano gratuito (Hobby) é para uso não comercial; confirmar com o Marco que a conta usada tem plano que permite uso comercial antes do go-live (ver `docs/08`).
- E-mail `contato@` **ainda não recebe mensagens** (MX nulo). O formulário envia para `QUOTE_TO_EMAIL`, configurável, e só depois aponta para `contato@`.

## Decisões de agentes e busca (27/11/2026)
- **O site nasce legível por agentes**: conteúdo como dado, Markdown por página, **WebMCP** (ferramentas no navegador) e **servidor MCP remoto somente leitura**. Agentes podem consultar serviços, perguntas frequentes, área de atendimento e "como pedir orçamento", e **preparar** um pedido; **nunca enviam**: fotos, consentimento LGPD e envio ficam com o humano.
- **O site nasce com SEO e Google Search completos**: Search Console (DNS), sitemap, metadados, JSON-LD, Core Web Vitals, IndexNow/Bing, Perfil da Empresa, `check:seo` no CI. Dados de contas ficam com o Marco (`docs/08`).
- WebMCP é experimental (W3C Community Group; teste de origem no Chrome 149+): ficar isolado, com detecção de recurso, e nunca quebrar o site.
