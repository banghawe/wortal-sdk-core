import { API_URL, WORTAL_API, API_ENDPOINTS } from "../../data/core-data";
import { notSupported, invalidOperation, operationFailed } from "../../errors/error-handler";
import Wortal from "../../index";
import { IAPBase } from "../iap-base";
import { Product } from "../interfaces/product";
import { Purchase } from "../interfaces/purchase";
import { PurchaseConfig } from "../interfaces/purchase-config";
import { SubscribableProduct } from "../interfaces/subscribable-product";
import { Subscription } from "../interfaces/subscription";
import type { VirtualItemsList, VirtualItem, InventoryItemList, InventoryItem, CreateOrderWithSpecifiedItemOptions, OrderResponse, ConsumeItemOptions } from "../interfaces/xsolla-store";

/**
 * Xsolla implementation of the IAP API.
 * @hidden
 */
export class IAPXsolla extends IAPBase {
    /**
     * to validate xsolla project ID and token
     * @param context the same argument used in invalidOperation
     * @param url the same argument used in invalidOperation
     * @returns
     */
    protected async validateXsollaProjectIDAndToken(context: string, url: string): Promise<{projectId: string, token: string}> {
        if (!window.xsollaProjectID) {
            throw invalidOperation('Xsolla project ID not set', context, url);
        }

        let token: string | null | undefined = undefined;

        if (Wortal.session.getPlatform() === 'crazygames') {
            // get the xsolla token from crazygames
            token = await new Promise((resolve, reject) => {
                Wortal._internalPlatformSDK.user.getXsollaUserToken((error: any, token: string) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(token);
                    }
                })
            });
        } else {
            token = await Wortal.player.getTokenAsync();
        }

        if (!token) {
            throw invalidOperation('Player Token not set', context, url);
        }

        return {
            projectId: window.xsollaProjectID,
            token,
        };
    }

    protected cancelSubscriptionAsyncImpl(purchaseToken: string): Promise<void> {
        return Promise.reject(notSupported(undefined, WORTAL_API.IAP_CANCEL_SUBSCRIPTION_ASYNC, API_URL.IAP_CANCEL_SUBSCRIPTION_ASYNC));
    }

    protected async consumePurchaseAsyncImpl(sku: string): Promise<void> {
        // return Promise.reject(notSupported(undefined, WORTAL_API.IAP_CONSUME_PURCHASE_ASYNC, API_URL.IAP_CONSUME_PURCHASE_ASYNC));
        const {projectId, token} = await this.validateXsollaProjectIDAndToken(WORTAL_API.IAP_CONSUME_PURCHASE_ASYNC, API_URL.IAP_CONSUME_PURCHASE_ASYNC);
        await consumeItem({
            projectId,
            token,
            sku,
            quantity: 1,
        });
    }

    protected async getCatalogAsyncImpl(): Promise<Product[]> {
        // return Promise.reject(notSupported(undefined, WORTAL_API.IAP_GET_CATALOG_ASYNC, API_URL.IAP_GET_CATALOG_ASYNC));
        const {projectId, token} = await this.validateXsollaProjectIDAndToken(WORTAL_API.IAP_GET_CATALOG_ASYNC, API_URL.IAP_GET_CATALOG_ASYNC);

        const items: VirtualItem[] = []
        let hasMore = true;

        while (hasMore) {
            const virtualItems = await fetchVirtualItems({
                projectId,
                token,
                offset: items.length,
                limit: 50,
            });

            items.push(...virtualItems.items);
            hasMore = virtualItems.has_more;
        }

        return items.map(item => ({
            title: item.name,
            productID: item.sku,
            description: item.description,
            imageURI: item.image_url,
            price: `${item.price.amount} ${item.price.currency}`,
            priceCurrencyCode: item.price.currency,
            priceAmount: Number(item.price.amount),
            // _internalData: item,
        }));
    }

    protected async getPurchasesAsyncImpl(): Promise<Purchase[]> {
        // return Promise.reject(notSupported(undefined, WORTAL_API.IAP_GET_PURCHASES_ASYNC, API_URL.IAP_GET_PURCHASES_ASYNC));
        const {projectId, token} = await this.validateXsollaProjectIDAndToken(WORTAL_API.IAP_GET_PURCHASES_ASYNC, API_URL.IAP_GET_PURCHASES_ASYNC);

        const items: InventoryItem[] = []
        let hasMore = true;

        while (hasMore) {
            const userInventory = await fetchUserInventory({
                projectId,
                token,
                offset: items.length,
                limit: 50,
            });

            items.push(...userInventory.items);
            hasMore = userInventory.items.length === 50;
        }

        return items.map(item => ({
            productID: item.sku,
            paymentID: '',
            purchaseTime: '',
            purchaseToken: '',
            signedRequest: '',
            ...item,
        }));
    }

    protected getSubscribableCatalogAsyncImpl(): Promise<SubscribableProduct[]> {
        return Promise.reject(notSupported(undefined, WORTAL_API.IAP_GET_SUBSCRIBABLE_CATALOG_ASYNC, API_URL.IAP_GET_SUBSCRIBABLE_CATALOG_ASYNC));
    }

    protected getSubscriptionsAsyncImpl(): Promise<Subscription[]> {
        return Promise.reject(notSupported(undefined, WORTAL_API.IAP_GET_SUBSCRIPTIONS_ASYNC, API_URL.IAP_GET_SUBSCRIPTIONS_ASYNC));
    }

    protected isEnabledImpl(): boolean {
        return true;
    }

    protected async makePurchaseAsyncImpl(purchase: PurchaseConfig): Promise<Purchase> {
        // return Promise.reject(notSupported(undefined, WORTAL_API.IAP_MAKE_PURCHASE_ASYNC, API_URL.IAP_MAKE_PURCHASE_ASYNC));
        const {projectId, token} = await this.validateXsollaProjectIDAndToken(WORTAL_API.IAP_MAKE_PURCHASE_ASYNC, API_URL.IAP_MAKE_PURCHASE_ASYNC);
        const sandbox = Wortal.session.getPlatform() === 'debug';
        const response = await createOrderWithItem({
            projectId,
            token,
            sandbox,
            sku: purchase.productID,
            quantity: 1,
        });

        // open xsolla payment window
        const paymentUrl = sandbox ?
            `https://sandbox-secure.xsolla.com/paystation4/?token=${response.token}` :
            `https://secure.xsolla.com/paystation4/?token=${response.token}`;
        window.open(paymentUrl, "payment", "popup");

        // since the purchaseToken is used to consume the item and xsolla uses the sku (productID) to consume the item
        return {
            productID: purchase.productID,
            purchaseToken: purchase.productID,
            purchaseTime: new Date().toJSON(),
            signedRequest: response.token,
            paymentID: response.order_id.toString(),
        }
    }

    protected purchaseSubscriptionAsyncImpl(productID: string): Promise<Subscription> {
        return Promise.reject(notSupported(undefined, WORTAL_API.IAP_PURCHASE_SUBSCRIPTION_ASYNC, API_URL.IAP_PURCHASE_SUBSCRIPTION_ASYNC));
    }

    protected _tryEnableIAPImpl(): void {
        // this._isIAPEnabled = false;
        this._isIAPEnabled = true;
        Wortal._log.debug(`IAP initialized for ${Wortal._internalPlatform} platform.`);
    }
}

const { XSOLLA_STORE } = API_ENDPOINTS;
const STORE_BASE_URL = `${XSOLLA_STORE}/v2/project`;

/**
 * fetchVirtualItems from xsolla store
 * @param param0
 * @returns
 */
async function fetchVirtualItems({ projectId, token, ...rest }: {
    projectId: string;
    token: string;
    offset?: number;
    limit?: number;
    locale?: string;
    country?: string;
    promo_code?: string;
}): Promise<VirtualItemsList> {
    rest.offset = rest.offset || 0;
    rest.limit = rest.limit || 50;
    rest.locale = rest.locale || 'en';
    const params = Object.entries(rest).map(([key, value]) => [key, value.toString()]);
    const query = new URLSearchParams(params).toString();

    const resp = await fetch(
        `${STORE_BASE_URL}/${projectId}/items/virtual_items?${query}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (resp.status !== 200) {
        throw operationFailed(
            `Failed to fetch virtual items: ${resp.status} ${resp.statusText}`,
            WORTAL_API.IAP_GET_CATALOG_ASYNC, API_URL.IAP_GET_CATALOG_ASYNC);
    } else if (!resp.headers.get('Content-Type')?.toLowerCase().includes('application/json')) {
        // else if response headers Content-Type does not contains application/json
        throw operationFailed(
            `Failed to fetch virtual items: invalid response content type`,
            WORTAL_API.IAP_GET_CATALOG_ASYNC, API_URL.IAP_GET_CATALOG_ASYNC);
    }
    return await resp.json() as VirtualItemsList;
}

async function fetchUserInventory({ projectId, token, ...rest }: {
    projectId: string;
    token: string;
    offset?: number;
    limit?: number;
}): Promise<InventoryItemList> {
    const query = new URLSearchParams({
        limit: '50',
        offset: '0',
        platform: 'xsolla'
    }).toString();

    const resp = await fetch(
        `${STORE_BASE_URL}/${projectId}/user/inventory/items?${query}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (resp.status !== 200) {
        throw operationFailed(
            `Failed to fetch user inventory: ${resp.status} ${resp.statusText}`,
            WORTAL_API.IAP_GET_PURCHASES_ASYNC, API_URL.IAP_GET_PURCHASES_ASYNC);
    } else if (!resp.headers.get('Content-Type')?.toLowerCase().includes('application/json')) {
        // else if response headers Content-Type does not contains application/json
        throw operationFailed(
            `Failed to fetch user inventory: invalid response content type`,
             WORTAL_API.IAP_GET_PURCHASES_ASYNC, API_URL.IAP_GET_PURCHASES_ASYNC);
    }
    return await resp.json() as InventoryItemList;
}

/**
 * Create order with specified item
 * url: https://developers.xsolla.com/api/igs-bb/operation/create-order-with-item/
 */
async function createOrderWithItem({ projectId, token, sku, ...rest }: CreateOrderWithSpecifiedItemOptions): Promise<OrderResponse> {
    const url = `${STORE_BASE_URL}/${projectId}/payment/item/${sku}`
    const resp = await fetch(
        url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(rest)
        }
    );
    if (resp.status !== 200) {
        throw operationFailed(
            `Failed to create order with item: ${resp.status} ${resp.statusText}`,
            WORTAL_API.IAP_MAKE_PURCHASE_ASYNC, API_URL.IAP_MAKE_PURCHASE_ASYNC);
    } else if (!resp.headers.get('Content-Type')?.toLowerCase().includes('application/json')) {
        // else if response headers Content-Type does not contains application/json
        throw operationFailed(
            `Failed to create order with item: invalid response content type`,
            WORTAL_API.IAP_MAKE_PURCHASE_ASYNC, API_URL.IAP_MAKE_PURCHASE_ASYNC);
    }
    return await resp.json() as OrderResponse;
}

/**
 * Consume item
 * url: https://developers.xsolla.com/api/igs-bb/operation/consume-item/
 */
async function consumeItem({ projectId, token, ...rest }: ConsumeItemOptions): Promise<void> {
    const query = new URLSearchParams({
        platform: "xsolla"
    }).toString()
    const url = `${STORE_BASE_URL}/${projectId}/user/inventory/item/consume?${query}`
    const resp = await fetch(
        url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(rest)
        }
    );
    if (resp.status !== 200) {
        throw operationFailed(
            `Failed to consume item: ${resp.status} ${resp.statusText}`,
            WORTAL_API.IAP_CONSUME_PURCHASE_ASYNC, API_URL.IAP_CONSUME_PURCHASE_ASYNC);
    }
}
