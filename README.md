<!-- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). -->

# Graph Networks using Vis Network in Next.js

This repository is about a graph network using [Vis Network](https://visjs.github.io/vis-network/docs/network/) implemented in [Next.js](https://nextjs.org/) with typescript.

Kindly visit the deployed site on vercel: [Graph Networks](https://next-graph-network.vercel.app/graph)

## Getting Started

First, initial install and run the development server:

To Install : 
```bash
npm install
# or
npm i
```
To Run :
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## About the Nooks and Crannies

I have been researching for library that works out for graph network and the best one i found is using [Vis Network Library](https://visjs.github.io/vis-network/docs/network/). It has a broad features to tweak, modify and customize to fulfill our need (In this case network graph).

For generating data initially, i use [mockapi.io](https://mockapi.io/) for the nodes & edges, and move those datas to [supabase](https://supabase.com/)

Also i choose [daisyUI](https://daisyui.com/) as the component library that build up on top of [Tailwind CSS](https://tailwindcss.com/) so we don't need extra steps to add component or styling.

About the graph, Vis Network offers a great features that i implement in this repo such as:

- Cluster & Declustering
- Grouping
- Styling Node & Edges
- Zooming In & Out
- Accessibility (Utilize Keyboard navigation)


