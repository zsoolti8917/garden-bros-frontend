# Garden Bros Website Frontend

This repository contains the frontend code for the Garden Bros website, a multilingual platform for a gardening company to promote their services and showcase their work.

## Live Website

Visit the live website at: [https://www.gardenbros.sk](https://www.gardenbros.sk)

## Features

- Responsive main page with dynamic components
- Fully-featured contact page
- FAQ page
- Blog with author-written posts
- Multilingual support (Slovak, Hungarian, English)
- Dynamic page generation
- Customizable content managed through Strapi CMS

## Technology Stack

- Next.js
- [Add any other relevant frontend libraries/frameworks]

## Setup and Installation

1. Clone the repository:
``` cmd
git clone https://github.com/your-username/garden-bros-frontend.git
cd garden-bros-frontend
```

2. Install dependencies:
``` cmd
npm install
```

3. Create a `.env` file in the root directory with the following content:
``` cmd
NEXT_PUBLIC_STRAPI_API_TOKEN=your_strapi_api_token
NEXT_PUBLIC_PAGE_LIMIT=6
NEXT_PUBLIC_STRAPI_FORM_SUBMISSION_TOKEN=your_form_submission_token
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
```
Replace `your_strapi_api_token` and `your_form_submission_token` with your actual Strapi tokens.

4. Run the development server:
``` cmd
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Multilingual Support

The website supports content in Slovak, Hungarian, and English. Language can be changed by the user, and content for each language is manageable in the Strapi backend.

## Content Management

Content is managed through Strapi CMS, allowing for:
- Changing content on all pages
- Creating new pages
- Writing and managing blog posts
- Adding new author categories
- Managing content in different languages
- Customizing the order and visibility of dynamic content

## Deployment

The frontend of this project is deployed on Vercel.

To deploy your own instance:

1. Fork this repository to your GitHub account.
2. Sign up for a Vercel account if you haven't already: [https://vercel.com/signup](https://vercel.com/signup)
3. In your Vercel dashboard, click "New Project" and select your forked repository.
4. Configure your project settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build` (default)
   - Output Directory: `out` (if you've configured Next.js for static export)
5. Add your environment variables in the Vercel project settings.
6. Click "Deploy" and Vercel will build and deploy your project.

Vercel will automatically redeploy your project whenever you push changes to your connected GitHub repository.

For more detailed instructions, refer to the [Vercel Documentation](https://vercel.com/docs).

## Author

This project was developed by Zsolt Varjú.

- GitHub: [@zsoolti8917](https://github.com/zsoolti8917)
- LinkedIn: [Zsolt Varjú](https://www.linkedin.com/in/zsoltvarju/)
- Website: [Portfolio](https://www.zsoltvarju.com)

For any inquiries or support, please contact: zsolt.varju.rl@gmail.com
