# GeoDuel :earth_americas:

### Este é o projeto de um jogo multiplayer online acessado pela WEB baseado em turnos em que 2 jogadores podem se desafiar em um duelo.
- Cada jogador escolhe um número predeterminado de localizações no mapa do mundo (Google Maps API).
- Após as localizações serem escolhidas, cada jogador vai poder ter uma visão do Google Street View de cada localização que o jogador adversário escolheu.
- O jogador então terá que tentar adivinhar a localização de cada visão do Google Street View que o adversário escolheu e marcar sua escolha no mapa.
- Após os 2 jogadores fazerem todas as suas escolhas, é calculada a distância do ponto do mapa que o jogador escolheu até a localização real.
- O jogador que tiver na soma final a menor distância vence.

### Para a criação do projeto são utilizados:
- Linguagem de programação: Javascript (Typescript).
- Framework WEB: React.
- Banco de Dados: Google Cloud Firestore.
- Comunicação no Backend: Google Cloud Functions.
- Visualização do mapa e das localizações: Google Maps e Google Street View APIs.

### Desafios e Soluções
Para o funcionamento do jogo, os mapas (tanto o mapa do mundo quanto o street view) serão exibidos através da Google Maps API e o usuário poderá selecionar as localizações clicando no mapa, esta localização será enviada para o banco de dados da Google Cloud Firestore através de uma chamada em uma função da Google Cloud Functions, permitindo que ambos os jogadores atualizem e acessem os dados do jogo em questão (Nesse caso, a Google Cloud funciona como um backend as a service).


- Obs: A aplicação não está pronta, mas [aqui](/firestore-assets/database.ts) estão exemplos de comandos de CRUD da futura aplicação.