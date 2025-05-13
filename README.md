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

A autenticação foi projetada para ser simples e segura, garantindo que apenas usuários autorizados possam enviar clipes por meio do self bot.

### Como funciona:

1. **Clique em “Cadastrar-se”** na página inicial.
2. **Crie um nome de usuário e uma senha**, e clique em **“CADASTRAR”**.
3. Um **código exclusivo será gerado** para você.
4. **Copie esse código**.
5. **Envie o código em uma mensagem privada** para o bot chamado **CAP Clipador**, presente no servidor do Discord.
6. Após isso, volte à aplicação e clique em **“Confirmar”** para finalizar a autenticação.

> ✅ Essa verificação garante que somente usuários previamente autenticados possam utilizar o envio de clipes via o bot.

---

## 🛡️ Sobre o Nome: CAP (Combat Advanced Partners)

"CAP" é a sigla de um clã fundado por mim e meus amigos no Discord. Nosso servidor é um espaço onde jogamos juntos, compartilhamos clipes e conquistas, e mantemos viva a memória dos melhores momentos in-game. A criação do CapClip nasceu da frustração com o limite de 10MB para envio de vídeos em contas gratuitas. A solução foi construir essa ferramenta para que **os momentos importantes não se percam**, e todos possam compartilhá-los sem barreiras.

---
