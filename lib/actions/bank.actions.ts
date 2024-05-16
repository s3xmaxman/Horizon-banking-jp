"use server";

import {
  ACHClass,
  CountryCode,
  TransferAuthorizationCreateRequest,
  TransferCreateRequest,
  TransferNetwork,
  TransferType,
} from "plaid";

import { plaidClient } from "../plaid";
import { parseStringify } from "../utils";

import { getTransactionsByBankId } from "./transaction.actions";
import { getBanks, getBank } from "./user.actions";

// 複数の銀行口座を取得する
export const getAccounts = async ({ userId }: getAccountsProps) => {
  try {
    // データベースから銀行情報を取得する
    const banks = await getBanks({ userId });

    const accounts = await Promise.all(
      banks?.map(async (bank: Bank) => {
        // Plaidから各口座情報を取得する
        const accountsResponse = await plaidClient.accountsGet({
          access_token: bank.accessToken,
        });
        const accountData = accountsResponse.data.accounts[0];

        // Plaidから金融機関情報を取得する
        const institution = await getInstitution({
          institutionId: accountsResponse.data.item.institution_id!,
        });

        const account = {
          id: accountData.account_id,
          availableBalance: accountData.balances.available!,
          currentBalance: accountData.balances.current!,
          institutionId: institution.institution_id,
          name: accountData.name,
          officialName: accountData.official_name,
          mask: accountData.mask!,
          type: accountData.type as string,
          subtype: accountData.subtype! as string,
          appwriteItemId: bank.$id,
          sharableId: bank.sharableId,
        };

        return account;
      })
    );

    // 合計の銀行数と現在の合計残高を計算する
    const totalBanks = accounts.length;
    const totalCurrentBalance = accounts.reduce((total, account) => {
      return total + account.currentBalance;
    }, 0);

    // 結果をパースして返す
    return parseStringify({ data: accounts, totalBanks, totalCurrentBalance });
  } catch (error) {
    console.error("口座情報の取得中にエラーが発生しました:", error);
  }
};



// 1つの銀行口座を取得する
export const getAccount = async ({ appwriteItemId }: getAccountProps) => {
  try {
    // データベースから銀行情報を取得する
    const bank = await getBank({ documentId: appwriteItemId });

    // Plaidから口座情報を取得する
    const accountsResponse = await plaidClient.accountsGet({
      access_token: bank.accessToken,
    });
    const accountData = accountsResponse.data.accounts[0];

    // Appwriteから振替取引情報を取得する
    const transferTransactionsData = await getTransactionsByBankId({
      bankId: bank.$id,
    });

    // 振替取引情報を整形する
    const transferTransactions = transferTransactionsData.documents.map(
      (transferData: Transaction) => ({
        id: transferData.$id,
        name: transferData.name!,
        amount: transferData.amount!,
        date: transferData.$createdAt,
        paymentChannel: transferData.channel,
        category: transferData.category,
        type: transferData.senderBankId === bank.$id ? "debit" : "credit",
      })
    );

    // Plaidから金融機関情報を取得する
    const institution = await getInstitution({
      institutionId: accountsResponse.data.item.institution_id!,
    });

    // Plaidから取引情報を取得する
    const transactions = await getTransactions({
      accessToken: bank?.accessToken,
    });

    // 口座情報を作成する
    const account = {
      id: accountData.account_id,
      availableBalance: accountData.balances.available!,
      currentBalance: accountData.balances.current!,
      institutionId: institution.institution_id,
      name: accountData.name,
      officialName: accountData.official_name,
      mask: accountData.mask!,
      type: accountData.type as string,
      subtype: accountData.subtype! as string,
      appwriteItemId: bank.$id,
    };

    // 取引情報を日付順に並べ替える（最新の取引が先頭に来るように）
    const allTransactions = [...transactions, ...transferTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // 結果をパースして返す
    return parseStringify({
      data: account,
      transactions: allTransactions,
    });
  } catch (error) {
    console.error("口座情報の取得中にエラーが発生しました:", error);
  }
};


// 金融機関情報を取得する
export const getInstitution = async ({
  institutionId,
}: getInstitutionProps) => {
  try {
    // Plaidから金融機関情報を取得する
    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: ["US"] as CountryCode[],
    });

    // 金融機関情報を返す
    return parseStringify(institutionResponse.data.institution);
  } catch (error) {
    console.error("金融機関情報の取得中にエラーが発生しました:", error);
  }
};

// 取引情報を取得する
export const getTransactions = async ({
  accessToken,
}: getTransactionsProps) => {
  let hasMore = true;
  let transactions: any = [];

  try {
    // 取引情報を1ページずつ取得する
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
      });

      const data = response.data;

      // 取引情報を整形する
      transactions = response.data.added.map((transaction) => ({
        id: transaction.transaction_id,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        type: transaction.payment_channel,
        accountId: transaction.account_id,
        amount: transaction.amount,
        pending: transaction.pending,
        category: transaction.category ? transaction.category[0] : "",
        date: transaction.date,
        image: transaction.logo_url,
      }));

      // 次のページがあるかどうかを確認する
      hasMore = data.has_more;
    }

    // 取引情報を返す
    return parseStringify(transactions);
  } catch (error) {
    console.error("取引情報の取得中にエラーが発生しました:", error);
  }
};


// 送金の作成
export const createTransfer = async () => {
  // 送金の認証リクエストを作成
  const transferAuthRequest: TransferAuthorizationCreateRequest = {
    access_token: "access-sandbox-cddd20c1-5ba8-4193-89f9-3a0b91034c25",
    account_id: "Zl8GWV1jqdTgjoKnxQn1HBxxVBanm5FxZpnQk",
    funding_account_id: "442d857f-fe69-4de2-a550-0c19dc4af467",
    type: "credit" as TransferType, // 送金の種類を指定 (クレジット)
    network: "ach" as TransferNetwork, // 送金のネットワークを指定 (ACH)
    amount: "10.00",
    ach_class: "ppd" as ACHClass, // ACHクラスを指定 (PPD)
    user: {
      legal_name: "Anne Charleston",
    },
  };

  try {
    // 送金の認証を作成
    const transferAuthResponse =
      await plaidClient.transferAuthorizationCreate(transferAuthRequest);
    const authorizationId = transferAuthResponse.data.authorization.id;

    // 送金の作成リクエストを作成
    const transferCreateRequest: TransferCreateRequest = {
      access_token: "access-sandbox-cddd20c1-5ba8-4193-89f9-3a0b91034c25",
      account_id: "Zl8GWV1jqdTgjoKnxQn1HBxxVBanm5FxZpnQk",
      description: "payment", // 送金の説明
      authorization_id: authorizationId, // 前の認証IDを使用
    };

    // 送金を作成
    const responseCreateResponse = await plaidClient.transferCreate(
      transferCreateRequest
    );

    // 作成された送金情報を返す
    const transfer = responseCreateResponse.data.transfer;
    return parseStringify(transfer);
  } catch (error) {
    // エラーが発生した場合はログに出力
    console.error(
      "An error occurred while creating transfer authorization:",
      error
    );
  }
};