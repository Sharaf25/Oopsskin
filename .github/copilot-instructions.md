# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Next.js web application built with React, TypeScript, and Tailwind CSS.

## Technology Stack
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: npm

## Development Guidelines
- Use TypeScript for all new files
- Follow Next.js App Router conventions (app directory structure)
- Use React Server Components by default unless client-side interactivity is needed
- Add 'use client' directive only when necessary (e.g., for hooks, event handlers)
- Utilize Tailwind CSS for styling
- Follow ESLint rules configured in the project
- Use the `@/` import alias for cleaner imports

## File Organization
- Place components in the `src/app` directory following the App Router structure
- Use route groups for logical organization
- Keep shared components and utilities organized
- Use TypeScript interfaces and types for props and data structures
