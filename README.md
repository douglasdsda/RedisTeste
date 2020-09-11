# 📕 Indice

- [Apresentação](#-apresentação)
- [Sobre](#-sobre)
- [Tecnologias utilizadas](#-tecnologias-utilizadas)
- [Como Baixar o projeto](#-como-baixar-o-projeto)
- [Docker](#-configurar-docker)

# 🚀 Apresentação

<div style="display: flex; flex-direction: 'row';">
  

</div>

 

## 🧰 Sobre

Projeto **Teste Redis** foi criado para demostrar um crud usando redis

---

## 📚 Tecnologias utilizadas

O projeto foi desenvolvido as seguintes tecnologias

- [Axios](https://github.com/axios/axios)
- [Styled Components](https://styled-components.com)


---

## 💻 Como Baixar o projeto

```bash

* React js

# Clone do projeto react:
$ git clone https://github.com/douglasdsda/RedisTeste

# ir para pasta
$ cd RedisTeste/web

# instalar as dependencias
$ yarn install

# iniciar react native em uma aba
$ yarn start


```
* Node js

```bash
# Clone do projeto react:
$ git clone https://github.com/douglasdsda/RedisTeste

# ir para pasta
$ cd RedisTeste/back

# instalar as dependencias
$ yarn install

# iniciar react native em uma aba
$ yarn dev:server


```

---

# ⚡ Configurar Docker

```bash
# baixar docker redis

$ docker run --name redis -p 6379:6379 -d -t redis:alpine 

# criar postgres esta na pasta docker-compose-postgres

$ apos redis e postgres instalados tem que criar database chamado, teste_redis

```

---