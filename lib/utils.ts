/* eslint-disable no-prototype-builtins */
import { type ClassValue, clsx } from "clsx";
import qs from "query-string";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 日付時刻のフォーマット
export const formatDateTime = (dateString: Date) => {
  // 日付時刻のフォーマットオプション
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // 曜日の省略形 (例: '月')
    month: "short", // 月の省略形 (例: '10月')
    day: "numeric", // 月の日付 (例: '25')
    hour: "numeric", // 時 (例: '8')
    minute: "numeric", // 分 (例: '30')
    hour12: true, // 12時間制 (true) または 24時間制 (false)
  };

  // 曜日と日付のフォーマットオプション
  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // 曜日の省略形 (例: '月')
    year: "numeric", // 年 (例: '2023')
    month: "2-digit", // 月 (例: '10')
    day: "2-digit", // 日付 (例: '25')
  };

  // 日付のフォーマットオプション
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short", // 月の省略形 (例: '10月')
    year: "numeric", // 年 (例: '2023')
    day: "numeric", // 日付 (例: '25')
  };

  // 時刻のフォーマットオプション
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // 時 (例: '8')
    minute: "numeric", // 分 (例: '30')
    hour12: true, // 12時間制 (true) または 24時間制 (false)
  };

  // フォーマットされた日付時刻
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );

  // フォーマットされた曜日と日付
  const formattedDateDay: string = new Date(dateString).toLocaleString(
    "en-US",
    dateDayOptions
  );

  // フォーマットされた日付
  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );

  // フォーマットされた時刻
  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );

  // フォーマットされた日付時刻、曜日と日付、日付、時刻を返す
  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

// 金額をフォーマットする関数
export function formatAmount(amount: number): string {
  // 金額のフォーマット
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency", // 通貨スタイル
    currency: "USD", // 通貨
    minimumFractionDigits: 2, // 最小小数点以下の桁数
  });

  // フォーマットされた金額を返す
  return formatter.format(amount);
}

// オブジェクトを文字列に変換してパースする関数
export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

// 特殊文字を削除する関数
export const removeSpecialCharacters = (value: string) => {
  // 特殊文字を削除した文字列を返す
  return value.replace(/[^\w\s]/gi, "");
};

// URLクエリパラメータのインターフェース
interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

// URLクエリを作成する関数
export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  // 現在のURLをパースする
  const currentUrl = qs.parse(params);

  // パラメータを設定する
  currentUrl[key] = value;

  // URLクエリを文字列にして返す
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

// 口座タイプの色を取得する関数
export function getAccountTypeColors(type: AccountTypes) {
  // 口座タイプによって色を返す
  switch (type) {
    case "depository":
      return {
        bg: "bg-blue-25",
        lightBg: "bg-blue-100",
        title: "text-blue-900",
        subText: "text-blue-700",
      };

    case "credit":
      return {
        bg: "bg-success-25",
        lightBg: "bg-success-100",
        title: "text-success-900",
        subText: "text-success-700",
      };

    default:
      return {
        bg: "bg-green-25",
        lightBg: "bg-green-100",
        title: "text-green-900",
        subText: "text-green-700",
      };
  }
}

// 取引カテゴリをカウントする関数
export function countTransactionCategories(
  transactions: Transaction[]
): CategoryCount[] {
  // カテゴリごとのカウントを格納するオブジェクト
  const categoryCounts: { [category: string]: number } = {};
  // トランザクションの総数
  let totalCount = 0;

  // 各トランザクションを反復処理する
  transactions &&
    transactions.forEach((transaction) => {
      // トランザクションからカテゴリを抽出する
      const category = transaction.category;

      // カテゴリがcategoryCountsオブジェクトに存在する場合、そのカウントをインクリメントする
      if (categoryCounts.hasOwnProperty(category)) {
        categoryCounts[category]++;
      } else {
        // それ以外の場合は、カウントを1に初期化する
        categoryCounts[category] = 1;
      }

      // 総数をインクリメントする
      totalCount++;
    });

  // categoryCountsオブジェクトをオブジェクトの配列に変換する
  const aggregatedCategories: CategoryCount[] = Object.keys(categoryCounts).map(
    (category) => ({
      name: category, // カテゴリ名
      count: categoryCounts[category], // カテゴリごとのカウント
      totalCount, // トランザクションの総数
    })
  );

  // aggregatedCategories配列をカウントで降順にソートする
  aggregatedCategories.sort((a, b) => b.count - a.count);

  // ソートされたaggregatedCategories配列を返す
  return aggregatedCategories;
}

// URLから顧客IDを抽出する関数
export function extractCustomerIdFromUrl(url: string) {
  // URL文字列を '/' で分割する
  const parts = url.split("/");

  // 最後の部分（顧客IDを表す）を抽出する
  const customerId = parts[parts.length - 1];

  // 顧客IDを返す
  return customerId;
}

// IDを暗号化する関数
export function encryptId(id: string) {
  // IDをBase64エンコードして返す
  return btoa(id);
}

// IDを復号化する関数
export function decryptId(id: string) {
  // IDをBase64デコードして返す
  return atob(id);
}

// 取引ステータスを取得する関数
export const getTransactionStatus = (date: Date) => {
  // 今日の日付を取得する
  const today = new Date();
  // 2日前の日付を取得する
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  // 取引日が2日前より後の場合は "Processing"、そうでない場合は "Success" を返す
  return date > twoDaysAgo ? "Processing" : "Success";
};


export const authFormSchema = (type: string) => z.object({
  //サインアップ
  firstName: type === "sign-in" ? z.string().optional() : z.string().min(3, "3文字以上入力してください"),
  lastName: type === "sign-in" ? z.string().optional() : z.string().min(3, "3文字以上入力してください"),
  address1: type === "sign-in" ? z.string().optional() : z.string().max(50, "50文字以内で入力してください"),
  city: type === "sign-in" ? z.string().optional() : z.string().max(50, "50文字以内で入力してください"),
  state: type === "sign-in" ? z.string().optional() : z.string().min(2, "2文字以上入力してください").max(2, "10文字以内で入力してください"),
  postalCode: type === "sign-in" ? z.string().optional() : z.string().min(3, "3文字以上入力してください").max(10, "10文字以内で入力してください"),
  dateOfBirth: type === "sign-in" ? z.string().optional() : z.string().min(3, "3文字以上入力してください"),
  ssn: type === "sign-in" ? z.string().optional() : z.string().min(3, "3文字以上入力してください"),

  //サインイン
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(8, "8文字以上のパスワードを入力してください"),
});
