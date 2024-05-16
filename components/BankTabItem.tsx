"use client";

import { useSearchParams, useRouter } from "next/navigation";

import { cn, formUrlQuery } from "@/lib/utils";

export const BankTabItem = ({ account, appwriteItemId }: BankTabItemProps) => {
  // 検索パラメータとルーターを取得
  const searchParams = useSearchParams();
  const router = useRouter();

  // アカウントのIDがアクティブかどうかを判定
  const isActive = appwriteItemId === account?.appwriteItemId;

  // バンクの変更処理
  const handleBankChange = () => {
    // 新しいURLを作成
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: account?.appwriteItemId,
    });

    // 新しいURLにナビゲート
    router.push(newUrl, { scroll: false });
  };

  return (
    <div
      onClick={handleBankChange}
      className={cn(`banktab-item`, {
        " border-blue-600": isActive,
      })}
    >
      <p
        className={cn(`text-16 line-clamp-1 flex-1 font-medium text-gray-500`, {
          " text-blue-600": isActive,
        })}
      >
        {account.name}
      </p>
    </div>
  );
};