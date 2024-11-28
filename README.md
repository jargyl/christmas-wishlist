# Family Christmas Wishlist

Welcome to the **Family Christmas Wishlist** project! This guide will help you set up and run the project locally. Follow the steps below to get started.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Setting Up Supabase](#setting-up-supabase)
  - [1. Create a Supabase Project](#1-create-a-supabase-project)
  - [2. Configure Environment Variables](#2-configure-environment-variables)
  - [3. Initialize the Database](#3-initialize-the-database)
  - [4. Configure Authentication](#4-configure-authentication)
- [Running the Project](#running-the-project)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (v16 or later): [Download Node.js](https://nodejs.org/)
- **Git**: [Download Git](https://git-scm.com/downloads)

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/family-christmas-wishlist.git
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd family-christmas-wishlist
   ```

3. **Install Dependencies**

   ```bash
   npm install
   ```

## Setting Up Supabase

This project uses [Supabase](https://supabase.com/) as its backend service. Follow the steps below to set up Supabase.

### 1. Create a Supabase Project

1. **Sign Up or Log In**

   Visit [Supabase](https://supabase.com/) and sign up for a free account or log in if you already have one.

2. **Create a New Project**

   - Click on the **"New Project"** button.
   - Enter a **Project Name**.
   - Choose a **Password** for the database (ensure it's secure).
   - Select an appropriate **Region**.
   - Click **"Create new project"**.

3. **Wait for Initialization**

   Supabase will take a few minutes to set up your project. Once done, you'll be redirected to the project dashboard.

### 2. Configure Environment Variables

1. **Create a `.env` File**

   In the root directory of the project, create a `.env` file by copying the provided example:

   ```bash
   cp .env.example .env
   ```

2. **Fill in Supabase Credentials**

   Open the `.env` file and replace the placeholders with your Supabase project credentials:

   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_LANG=en
   ```

   - **VITE_SUPABASE_URL**: Found in the Supabase project settings under **"API"**.
   - **VITE_SUPABASE_ANON_KEY**: Also located in the Supabase project settings under **"API"**.
   - **VITE_LANG**: Set your preferred default language (`en` for English or `nl` for Dutch).

### 3. Initialize the Database

1. **Access the SQL Editor**

   In your Supabase project dashboard, navigate to the **"Database"** section and click on **"SQL Editor"**.

2. **Run the Provided SQL Script**

   Paste the following SQL script into the editor and execute it. This script sets up the necessary tables, extensions, and policies.

   ```sql
   SET statement_timeout = 0;
   SET lock_timeout = 0;
   SET idle_in_transaction_session_timeout = 0;
   SET client_encoding = 'UTF8';
   SET standard_conforming_strings = on;
   SET check_function_bodies = false;
   SET xmloption = content;
   SET client_min_messages = warning;
   SET row_security = off;

   CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";
   CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
   CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
   CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
   CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";
   CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

   SET default_tablespace = '';
   SET default_table_access_method = "heap";

   CREATE TABLE IF NOT EXISTS "public"."profiles" (
       "id" "uuid" NOT NULL,
       "avatar_url" "text",
       "username" "text"
   );
   ALTER TABLE "public"."profiles" OWNER TO "postgres";

   CREATE TABLE IF NOT EXISTS "public"."wishlist_items" (
       "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
       "user_id" "uuid",
       "title" "text" NOT NULL,
       "description" "text",
       "price" numeric(10,2),
       "link" "text",
       "priority" "text",
       "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
       "is_priority" boolean,
       CONSTRAINT "wishlist_items_priority_check" CHECK (("priority" = ANY (ARRAY['low'::"text", 'medium'::"text", 'high'::"text"])))
   );
   ALTER TABLE "public"."wishlist_items" OWNER TO "postgres";

   ALTER TABLE ONLY "public"."profiles"
       ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id"),
       ADD CONSTRAINT "profiles_username_key" UNIQUE ("username"),
       ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

   ALTER TABLE ONLY "public"."wishlist_items"
       ADD CONSTRAINT "wishlist_items_pkey" PRIMARY KEY ("id"),
       ADD CONSTRAINT "wishlist_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;

   -- Policies
   CREATE POLICY "Anyone can view wishlist items" ON "public"."wishlist_items" FOR SELECT USING (true);
   CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles" FOR SELECT USING (true);
   CREATE POLICY "Users can create their own wishlist items" ON "public"."wishlist_items" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));
   CREATE POLICY "Users can delete their own wishlist items" ON "public"."wishlist_items" FOR DELETE USING (("auth"."uid"() = "user_id"));
   CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));
   CREATE POLICY "Users can update own profile." ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));
   CREATE POLICY "Users can update their own wishlist items" ON "public"."wishlist_items" FOR UPDATE USING (("auth"."uid"() = "user_id"));

   -- Enable Row Level Security
   ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;
   ALTER TABLE "public"."wishlist_items" ENABLE ROW LEVEL SECURITY;

   -- Granting Permissions
   GRANT USAGE ON SCHEMA "public" TO "postgres", "anon", "authenticated", "service_role";
   GRANT ALL ON TABLE "public"."profiles" TO "anon", "authenticated", "service_role";
   GRANT ALL ON TABLE "public"."wishlist_items" TO "anon", "authenticated", "service_role";

   -- Default Privileges for Sequences and Functions
   ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres", "anon", "authenticated", "service_role";
   ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres", "anon", "authenticated", "service_role";
   ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres", "anon", "authenticated", "service_role";

   RESET ALL;
   ```

3. **Execute the Script**

   - Click on the **"Run"** button to execute the script.
   - Wait for the confirmation that the script ran successfully.

### 4. Configure Authentication

1. **Navigate to Authentication Settings**

   In the Supabase dashboard, go to the **"Authentication"** section.

2. **Set Up Email Provider**

   - Click on **"Providers"**.
   - Select **"Email"**.

3. **Disable Email Confirmations**

   - **Disable** the **"Enable email confirmations"** option.
   - **Disable** the **"Enable secure email changes"** option.

4. **Save Changes**

   Make sure to save your settings.

## Running the Project

With everything set up, you can now run the project locally.

1. **Start the Development Server**

   ```bash
   npm run dev
   ```

2. **Access the Application**

   Open your browser and navigate to `http://localhost:5173` (or the URL provided in the terminal).

## Troubleshooting

- **Environment Variables Not Loading**

  Ensure that the `.env` file is correctly named and placed in the root directory. Restart the development server after making changes to the `.env` file.

- **Database Connection Issues**

  Verify that the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your `.env` file are correct. Check your Supabase dashboard to confirm.

## License

This project is licensed under the [MIT License](LICENSE).
