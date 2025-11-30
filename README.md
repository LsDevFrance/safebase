# SafeBase

## Introduction

Dans le monde de l'entreprise, la gestion des bases de données et la sécurisation des données sont des enjeux cruciaux. Les données sont souvent l'un des actifs les plus précieux pour une organisation et leur perte peut engendrer des conséquences désastreuses. Pour cette raison, il est essentiel de mettre en place des systèmes permettant de garantir la sauvegarde régulière des données et d'assurer leur restauration en cas de besoin.

## Objectif du Projet

Le projet vise à développer une solution complète de gestion de la sauvegarde et de la restauration de bases de données sous forme d'une API REST. Cette solution devra répondre aux besoins suivants :

- **Ajout de base de données** : Ajouter une connexion à une base de données.
- **Automatisation des sauvegardes régulières** : Planifier et effectuer des sauvegardes périodiques des bases de données, en utilisant le standard cron et les utilitaires système de MySQL et PostgreSQL.
- **Gestion des versions** : Conserver l'historique des différentes versions sauvegardées, avec des options pour choisir quelle version restaurer.
- **Surveillance et alertes** : Générer des alertes en cas de problème lors des processus de sauvegarde ou de restauration.
- **Interface utilisateur** : Proposer une interface simple pour permettre aux utilisateurs de gérer facilement les processus de sauvegarde et de restauration.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
