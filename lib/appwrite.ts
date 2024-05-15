"use server";

import { Client, Account, Databases, Users } from "node-appwrite";
import { cookies } from "next/headers";

// セッションクライアントを作成する関数
export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  // クッキーからAppwriteセッションを取得
  const session = cookies().get("appwrite-session");

  if (!session || !session.value) {
    throw new Error("No session");
  }

  // クライアントにセッションを設定
  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

// 管理者クライアントを作成する関数
export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.APPWRITE_SECRET!);

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client); // データベースへのアクセスを提供
    },
    get user() {
      return new Users(client); // ユーザー管理機能へのアクセスを提供
    }
  };
}
