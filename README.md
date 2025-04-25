# 🎞️ CapClip

CapClip é uma aplicação web desenvolvida com o objetivo de facilitar o **compartilhamento de momentos de jogos** entre amigos no Discord, contornando as limitações de tamanho de mídia impostas por contas padrão.

---

## 🌐 Deploy

A aplicação está hospedada na plataforma **Render** e pode ser acessada pelo link:

🔗 [capclip.onrender.com](https://capclip.onrender.com)

**Obs:** Note que, como o deploy foi feito com um plano gratuito, a página pode demorar um pouco pra carregar.

---

## 🚀 Visão Geral

CapClip permite que **usuários do Discord enviem seus melhores clipes de jogos** para um servidor pré-configurado, mesmo que **não possuam uma conta com Discord Nitro**. O diferencial da plataforma é permitir que **múltiplos usuários se beneficiem de um único Nitro**, utilizando um self bot para o envio de vídeos com qualidade superior.

A aplicação foi desenvolvida com **Express** e **Handlebars**, e conta com um self bot construído usando a biblioteca `discord.js-selfbot-v13`, que permite automatizar ações em uma conta comum do Discord como se fosse um bot, aproveitando recursos como o envio de arquivos maiores (até 50MB ou 500MB com Nitro), autenticando usuários e publicando clipes automaticamente em canais específicos do servidor.

---

## 🤖 Self Bot e Envio de Clipes

O self bot é responsável por realizar login no Discord, acessar o servidor e canal configurado, autenticar usuários via código e enviar os vídeos cortados ou completos. Ao acessar a aplicação, o usuário pode selecionar e editar seu vídeo (corte de trechos), que será então processado e enviado para o canal designado no Discord.

> ✅ O envio respeita os limites de upload de acordo com o nível Nitro do self bot.

---

## 🔐 Autenticação de Usuário

A autenticação é feita por meio de **códigos únicos atribuídos** a cada usuário, e configurados manualmente por um administrador autorizado.

### Como funciona:

1. O administrador envia uma mensagem privada ao self bot com o seguinte comando:

```
adduser <Id do usuário> <Código atribuído>
```


2. Ao utilizar a aplicação, o usuário informa seu código.

3. O self bot verifica a associação do código com o ID do usuário, garantindo a autoria do clipe enviado.

---

## 🛡️ Sobre o Nome: CAP (Combat Advanced Partners)

"CAP" é a sigla de um clã fundado por mim e meus amigos no Discord. Nosso servidor é um espaço onde jogamos juntos, compartilhamos clipes e conquistas, e mantemos viva a memória dos melhores momentos in-game. A criação do CapClip nasceu da frustração com o limite de 10MB para envio de vídeos em contas gratuitas. A solução foi construir essa ferramenta para que **os momentos importantes não se percam**, e todos possam compartilhá-los sem barreiras.

---
