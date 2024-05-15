"use server";

import { Client } from "dwolla-v2";

// Dwolla API クライアントを初期化するための関数
const getEnvironment = (): "production" | "sandbox" => {
    // 環境変数からDwollaの環境設定を取得する
    const environment = process.env.DWOLLA_ENV as string;
  
    // 環境設定に応じて適切な環境を返す
    switch (environment) {
      case "sandbox":
        return "sandbox";
      case "production":
        return "production";
      default:
        // 環境設定が不正な場合はエラーを投げる
        throw new Error(
          "Dwolla environment should either be set to `sandbox` or `production`"
        );
    }
};
  

// Dwolla API クライアントを初期化する
const dwollaClient = new Client({
    environment: getEnvironment(), // 環境設定
    key: process.env.DWOLLA_KEY as string, // APIキー
    secret: process.env.DWOLLA_SECRET as string, // APIシークレット
});
  

// 新しい資金源を作成する関数
export const createFundingSource = async (
    options: CreateFundingSourceOptions
) => {
    try {
      // Dwolla API にリクエストを送信し、資金源を作成する
      return await dwollaClient
        .post(`customers/${options.customerId}/funding-sources`, {
          name: options.fundingSourceName, // 資金源名
          plaidToken: options.plaidToken, // Plaidトークン
        })
        .then((res) => res.headers.get("location")); // 作成された資金源のURLを取得
    } catch (err) {
      // エラーが発生した場合はエラーメッセージを出力する
      console.error("Creating a Funding Source Failed: ", err);
    }
};
  

// オンデマンド認証を作成する関数
export const createOnDemandAuthorization = async () => {
    try {
      // Dwolla API にリクエストを送信し、オンデマンド認証を作成する
      const onDemandAuthorization = await dwollaClient.post(
        "on-demand-authorizations"
      );
  
      // 認証リンクを取得する
      const authLink = onDemandAuthorization.body._links;
      return authLink;
    } catch (err) {
      // エラーが発生した場合はエラーメッセージを出力する
      console.error("Creating an On Demand Authorization Failed: ", err);
    }
};
  

// 新しいDwolla顧客を作成する関数
export const createDwollaCustomer = async (
    newCustomer: NewDwollaCustomerParams
) => {
    try {
      // Dwolla API にリクエストを送信し、顧客を作成する
      return await dwollaClient
        .post("customers", newCustomer) // 新しい顧客情報
        .then((res) => res.headers.get("location")); // 作成された顧客のURLを取得
    } catch (err) {
      // エラーが発生した場合はエラーメッセージを出力する
      console.error("Creating a Dwolla Customer Failed: ", err);
    }
};
  

// 送金を実行する関数
export const createTransfer = async ({
    sourceFundingSourceUrl, // 送金元の資金源URL
    destinationFundingSourceUrl, // 送金先の資金源URL
    amount, // 送金額
}: TransferParams) => {
    try {
      // リクエストボディを作成する
      const requestBody = {
        _links: {
          source: {
            href: sourceFundingSourceUrl, // 送金元の資金源URL
          },
          destination: {
            href: destinationFundingSourceUrl, // 送金先の資金源URL
          },
        },
        amount: {
          currency: "USD", // 通貨
          value: amount, // 送金額
        },
      };
  
    // Dwolla API にリクエストを送信し、送金を実行する
    return await dwollaClient
        .post("transfers", requestBody)
        .then((res) => res.headers.get("location")); // 送金結果のURLを取得
    } catch (err) {
      // エラーが発生した場合はエラーメッセージを出力する
      console.error("Transfer fund failed: ", err);
    }
};
  
  // 新しい資金源を追加する関数
export const addFundingSource = async ({
    dwollaCustomerId, // Dwolla顧客ID
    processorToken, // プロセッサトークン
    bankName, // 銀行名
}: AddFundingSourceParams) => {
    try {
      // Dwolla認証リンクを作成する
      const dwollaAuthLinks = await createOnDemandAuthorization();
  
      // 資金源オプションを作成する
      const fundingSourceOptions = {
        customerId: dwollaCustomerId, // Dwolla顧客ID
        fundingSourceName: bankName, // 銀行名
        plaidToken: processorToken, // プロセッサトークン
        _links: dwollaAuthLinks, // Dwolla認証リンク
      };
  
      // 資金源を作成する
      return await createFundingSource(fundingSourceOptions);
    } catch (err) {
      // エラーが発生した場合はエラーメッセージを出力する
      console.error("Transfer fund failed: ", err);
    }
};