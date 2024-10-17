# Test technique backend - BH Technologies

### CLI

`docker compose up --build`

Tous les services sont fonctionnels, sauf ceux que je n'ai pas eu le temps de faire :

- `ingestion_service`
- `env_data_consolidator`
- `api`

Ayant manqué de temps, je propose dans la partie suivante, toutes les améliorations que j'aurais apportées au projet si j'avais eu plus de temps à y consacrer.

### Pistes d'amélioration

[Diagramme de flux](architecture-diagram.png)
Ce diagramme représente l'architecture que j'envisage pour répondre à ce besoin et pourra servir de support de discussion lors de notre entretien.

#### TODO

- `rabbitmq`

  - Implémenter une couche d'authentification et adapter chaque microservice.
  - Implémenter pour chaque queue, une queue de `retry` (voire une queue `failure`) en utilisant les dead-letter exchanges de RabbitMQ

- `api`

  - Terminer le block d'authentification de l'API utilisant des tokens JWT et le module AuthGuard de Nestjs
  - Coder les trois routes demandées
  - Écrire une documentation d'API avec SwaggerUI

- `raw_data_processor`

  - Pour les trois services : gérer les pertes de 5%. Deux idées :

    - Si on connait ou si on peut estimer le nombre de points/sec attendus, on peut alors imaginer un monitoring du taux de réception des données, et produire un indicateur de complétude (et de donc de fiabilité) que l'on peut enregistrer dans notre donnée traitée. Cet indicateur est une valeur ajoutée, utile pour le client, le fabricant, etc...
      On peut également produire une alarme avec notification, dans le cas ou un seuil de complétude n'est pas atteint.
    - Si on constate un trop grand "trou" de données entre deux timestamps, on peut calculer une moyenne pondérée en fonction des timestamps, ce qui revient à construire une courbe d'interpolation qui colle au mieux aux données reçues. Ainsi, les calculs de moyenne seront au plus proche de la réalité.

  - `ep2.service` : gérer le bug de l'énergie décroissante. Ces messages peuvent fausser le calcul de moyenne lors de l'étape de consolidation et doivent être ignorés, voire corrigés via l'interpolation ci-dessus.

- Pour tous les microservices NestJS, factoriser les logiques redondantes dans les dossier backend/config et backend/libs, comme les connexions/authentifications à RabbitMQ, redis, MySQL.
- Implémenter un système de logs.
- Développer des tests unitaires pour chaque service.
- Utiliser des variables d'environnement pour toutes les données critiques ou environnement-dépendantes et préparer une version "production" de la stack.
- Remplacer MySQL par InfluxDB...
- Prometheus + Grafana / stack ELK
