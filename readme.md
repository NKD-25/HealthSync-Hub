**AI Trading Assistant for Day and Swing Traders – Analyze Market Trends, Predict Movements, and Make Smarter Investment Decisions**


*This project is designed for day and swing traders. Our AI agent leverages powerful tools like market prediction, trend analysis, and news sentiment evaluation to help you make informed investment decisions and know when to enter or exit the market.*


🚀 Getting Started
1️⃣ Clone the repo
```bash
git clone https://github.com/Open-Source-Chandigarh/tradeGPT.git
cd tradeGPT
```


1️⃣ You will need an ai (either you can run locally on docker or use openai_api_key)

How to install locally on docker 

I am using gemma-3
run these cmd's in your terminal
```bash
docker model pull ai/gemma3
```

```bash
docker model pull ai/embeddinggemma
```


2️⃣ go to books/code

copy .env.example to .env
populate qdrant api keys and url from qdrant cloud
```bash
npm i
node generateEmbeddings
```


3️⃣ go to /pythonModel
```bash
uvicorn api:app --reload
```

4️⃣ go to tradefront
copy .env.example to .env
and populate all .env fields
if you are using local model then leave openai_api_key empty

run 
```bash
npm i
```

then
```bash
npm run dev
```


Go to 👉 http://localhost:3000




You can start editing by modifying app/page.tsx.

The page auto-updates when you save changes.

✨ Features

⚡ Built with Next.js 15

🎨 Uses next/font with Geist font family

🔥 Hot Reloading

☁️ Easy deploy on Vercel

📦 Open for Hacktoberfest contributions

🤝 Contributing (Hacktoberfest Guidelines)

We welcome all contributions! 🎉

Fork the repo 🍴

Create your feature branch:
```bash

git checkout -b feature/your-feature
```


Commit your changes:

```bash

git commit -m "Added: your feature"
```


Push to the branch:
```bash
git push origin feature/your-feature
```


Open a Pull Request 🚀

📌 Make sure your PR is meaningful (bug fixes, features, docs improvements).
Spam PRs will be rejected ❌.

📚 Learn More

Next.js Documentation

Learn Next.js – Interactive Tutorial

Hacktoberfest Official Site

☁️ Deployment

The easiest way to deploy is with Vercel
 (creators of Next.js).
Just connect your GitHub repo and deploy in one click!

🧑‍💻 Contributors

Thanks to all contributors who make this project better ❤️