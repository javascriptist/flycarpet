import React, { useState } from 'react';
import { Table, Text, clx } from "@medusajs/ui";
import { convertUsdToUzs, formatUzsAmount } from "@lib/util/money";
import DeleteButton from "@modules/common/components/delete-button";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import Thumbnail from "@modules/products/components/thumbnail";

interface RollCarpetItemProps {
  item: any;
  countryCode?: string;
  exchangeRate?: number;
  type?: "full" | "preview";
}

export const RollCarpetItem: React.FC<RollCarpetItemProps> = ({ 
  item, 
  countryCode, 
  exchangeRate,
  type = "full"
}) => {
  const isLang = countryCode === "uz";
  const isCustomCarpet = item.metadata?.carpet_type === "roll_custom";
  
  const formatPrice = (price: number) => {
    if (exchangeRate && countryCode === "uz") {
      const uzsAmount = convertUsdToUzs(price / 100, exchangeRate); // price is in cents
      return formatUzsAmount(uzsAmount);
    }
    return `$${(price / 100).toFixed(2)}`;
  };

  const formatUnitPrice = (price: number) => {
    if (exchangeRate && countryCode === "uz") {
      const uzsAmount = convertUsdToUzs(price / 100, exchangeRate);
      return formatUzsAmount(uzsAmount);
    }
    return `$${(price / 100).toFixed(2)}`;
  };

  if (!isCustomCarpet) {
    return null; // Use regular cart item component
  }

  const customLength = item.metadata?.custom_length || 0;
  const customerSpecs = item.metadata?.customer_specifications;

  return (
    <Table.Row className="w-full border-l-4 border-l-blue-500 bg-blue-50/30" data-testid="custom-carpet-row">
      <Table.Cell className="!pl-0 p-4 w-24">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className={clx("flex", {
            "w-16": type === "preview",
            "small:w-24 w-12": type === "full",
          })}
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
          />
        </LocalizedClientLink>
      </Table.Cell>

      <Table.Cell className="text-left">
        <div className="flex items-center gap-2 mb-1">
          <Text className="txt-medium-plus text-ui-fg-base" data-testid="custom-carpet-title">
            {item.product_title}
          </Text>
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium">
            {isLang ? "Maxsus" : "Заказной"}
          </span>
        </div>
        
        <div className="text-sm text-ui-fg-subtle space-y-1">
          <div className="font-medium">
            {isLang ? "Uzunlik:" : "Длина:"} <span className="text-blue-600">{customLength}m</span>
          </div>
          
          {customerSpecs && (
            <div>
              <span className="font-medium">
                {isLang ? "Izohlar:" : "Примечания:"}
              </span>
              <div className="text-xs text-ui-fg-muted mt-1 italic">"{customerSpecs}"</div>
            </div>
          )}
          
          <div className="text-xs text-ui-fg-muted">
            {isLang 
              ? "Maxsus o'lcham bo'yicha tayyorlanadi" 
              : "Изготавливается по индивидуальному размеру"
            }
          </div>
        </div>
      </Table.Cell>

      {type === "full" && (
        <Table.Cell>
          <div className="flex gap-2 items-center w-28">
            <DeleteButton id={item.id} data-testid="custom-carpet-delete-button" />
            <div className="flex items-center justify-center w-14 h-10 border border-ui-border-base rounded text-sm font-medium">
              {item.quantity}
            </div>
          </div>
          <div className="text-xs text-ui-fg-muted mt-1">
            {isLang ? "Soni o'zgartirib bo'lmaydi" : "Кол-во не изменяется"}
          </div>
        </Table.Cell>
      )}

      {type === "full" && (
        <Table.Cell className="hidden small:table-cell">
          <div className="text-right">
            <div className="txt-medium-plus">
              {formatUnitPrice(item.unit_price || (item.total / item.quantity))}
            </div>
            <div className="text-xs text-ui-fg-muted">
              {isLang ? "har metr" : "за метр"}
            </div>
          </div>
        </Table.Cell>
      )}

      <Table.Cell className="!pr-0">
        <span
          className={clx("!pr-0", {
            "flex flex-col items-end h-full justify-center": type === "preview",
          })}
        >
          {type === "preview" && (
            <span className="flex gap-x-1 mb-1">
              <Text className="text-ui-fg-muted">{customLength}m × </Text>
              <Text className="text-ui-fg-base">{formatUnitPrice(item.unit_price || (item.total / item.quantity))}</Text>
            </span>
          )}
          <div className="text-right">
            <div className="txt-large-plus font-semibold text-blue-700">
              {formatPrice(item.total)}
            </div>
            {type === "full" && (
              <div className="text-xs text-ui-fg-muted">
                {customLength}m × {formatUnitPrice(item.unit_price || (item.total / item.quantity))}
              </div>
            )}
          </div>
        </span>
      </Table.Cell>
    </Table.Row>
  );
};